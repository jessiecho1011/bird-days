import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { calculateCouponDiscount } from '../../data/mockCoupons';
import { calculateShippingFee } from '../../data/mockShipping';
import { paymentService } from '../../services/paymentService';
import {
  DELIVERY_METHOD_LABELS,
  PAYMENT_METHOD_LABELS,
  type Coupon,
  type DeliveryMethod,
  type MockOrder,
  type PaymentMethod,
} from '../../types';

const MOCK_CVS_STORES = [
  '7-ELEVEN 台安門市（台北市大安區）',
  '7-ELEVEN 公益門市（台中市西區）',
  '全家 新竹光復店（新竹市東區）',
  '全家 高雄巨蛋店（高雄市左營區）',
];

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { hydratedItems, updateQuantity, removeFromCart, clearCart, subtotal } =
    useCart();
  const { placeOrder, shippingConfig, coupons, member, updateMemberProfile } =
    useData();

  const [customerName, setCustomerName] = useState(member?.name || '');
  const [phone, setPhone] = useState(member?.phone || '');
  const [email, setEmail] = useState(member?.email || '');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('home_delivery');
  const [shippingAddress, setShippingAddress] = useState(member?.defaultAddress || '');
  const [cvsStoreName, setCvsStoreName] = useState(MOCK_CVS_STORES[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ecpay_credit');
  const [note, setNote] = useState('');

  // 優惠券狀態
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState<{
    type: 'ok' | 'err';
    text: string;
  } | null>(null);

  const [checkoutError, setCheckoutError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCodOrder, setSubmittedCodOrder] = useState<MockOrder | null>(null);

  // 未登入會員進入結帳頁面時，強制導向統一會員登入／註冊頁
  if (!member) {
    return <Navigate to="/login?redirect=/cart" replace />;
  }

  const hasStockIssue = hydratedItems.some(
    (item) => item.availableStock <= 0 || item.quantity > item.availableStock
  );

  const handleFixStockIssues = () => {
    for (const item of hydratedItems) {
      if (item.availableStock <= 0) {
        removeFromCart(item.product.id, item.variant?.id);
      } else if (item.quantity > item.availableStock) {
        updateQuantity(item.product.id, item.availableStock, item.variant?.id);
      }
    }
    setCheckoutError('');
  };

  const discountAmount = calculateCouponDiscount(subtotal, appliedCoupon);
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const shippingFee = calculateShippingFee(afterDiscount, shippingConfig, deliveryMethod);
  const totalAmount = afterDiscount + shippingFee;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setAppliedCoupon(null);
      setCouponMessage(null);
      return;
    }
    const found = coupons.find((c) => c.code === code && c.isActive);
    if (!found) {
      setAppliedCoupon(null);
      setCouponMessage({ type: 'err', text: '找不到此折扣碼或活動已結束' });
      return;
    }
    if (found.expiresAt && new Date(found.expiresAt) < new Date(new Date().toDateString())) {
      setAppliedCoupon(null);
      setCouponMessage({ type: 'err', text: '此折扣碼已超過使用期限' });
      return;
    }
    if (subtotal < found.minSpend) {
      setAppliedCoupon(null);
      setCouponMessage({
        type: 'err',
        text: `需消費滿 NT$ ${found.minSpend.toLocaleString()} 才能使用此折扣碼`,
      });
      return;
    }

    setAppliedCoupon(found);
    setCouponMessage({
      type: 'ok',
      text: `已套用「${found.title}」`,
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hydratedItems.length === 0) return;
    setCheckoutError('');
    setIsSubmitting(true);

    try {
      const finalAddress =
        deliveryMethod === 'cvs_pickup' ? cvsStoreName : shippingAddress.trim();

      const result = placeOrder({
        deliveryMethod,
        cvsStoreName: deliveryMethod === 'cvs_pickup' ? cvsStoreName : undefined,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? '貨到付款' : '待付款',
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        shippingAddress: finalAddress,
        note: note.trim() || undefined,
        items: hydratedItems.map(({ product, variant, unitPrice, quantity }) => ({
          productId: product.id,
          variantId: variant?.id,
          variantLabel: variant?.label,
          name: product.name,
          price: unitPrice,
          quantity,
        })),
        subtotal,
        discountAmount,
        couponCode: appliedCoupon?.code,
        shippingFee,
        totalAmount,
      });

      if (!result.ok) {
        setCheckoutError(result.error);
        setIsSubmitting(false);
        return;
      }

      // 結帳時填寫的收件資訊同步存回會員檔案，下次結帳免重填
      updateMemberProfile({
        name: customerName.trim(),
        phone: phone.trim(),
        defaultAddress:
          deliveryMethod === 'home_delivery'
            ? shippingAddress.trim()
            : member.defaultAddress,
      });

      // 若選擇第三方支付（綠界 ECPay），先保留購物車直到付款成功才清空，避免付款失敗購物車不見
      if (paymentService.requiresGatewayRedirect(paymentMethod)) {
        const session = await paymentService.createEcpaySession(result.order);
        navigate(session.redirectUrl, { state: { session } });
        return;
      }

      // 貨到付款無須跳轉金流，成立後直接清空購物車
      clearCart();
      setSubmittedCodOrder(result.order);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedCodOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="card-warm p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-success-bg text-status-success">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary">
            感謝訂購！貨到付款訂單已建立
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            訂單編號：<strong className="text-brand-accent">{submittedCodOrder.id}</strong>
            （已自動扣減商品庫存，您可至「訂單查詢」追蹤出貨進度）
          </p>

          <div className="mt-6 space-y-1.5 rounded-2xl border border-border-soft bg-bg-surface p-4 text-left text-sm">
            <p>
              <span className="text-text-muted">收件人：</span>
              <span className="font-semibold text-text-primary">
                {submittedCodOrder.customerName}（{submittedCodOrder.phone}）
              </span>
            </p>
            <p>
              <span className="text-text-muted">配送方式：</span>
              <span className="text-text-primary">
                {DELIVERY_METHOD_LABELS[submittedCodOrder.deliveryMethod]} —{' '}
                {submittedCodOrder.shippingAddress}
              </span>
            </p>
            <p>
              <span className="text-text-muted">應付總金額：</span>
              <span className="font-bold text-brand-accent">
                NT$ {submittedCodOrder.totalAmount.toLocaleString()}
              </span>
            </p>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/orders/lookup" className="btn-brand-primary px-6 py-2.5 text-sm">
              查詢訂單進度
            </Link>
            <Link to="/products" className="btn-brand-outline px-6 py-2.5 text-sm">
              繼續逛逛商品
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="text-xs font-bold tracking-wider text-brand-accent">
          SHOPPING CART & CHECKOUT
        </span>
        <h1 className="mt-1 text-3xl font-extrabold text-text-primary">
          購物車與結帳
        </h1>
      </div>

      {hydratedItems.length === 0 ? (
        <div className="surface-warm py-16 text-center">
          <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-brand-accent" />
          <p className="text-lg font-bold text-text-primary">購物車內尚無商品</p>
          <p className="mt-1 text-sm text-text-secondary">
            快去挑選天然寵物鳥選物，陪伴毛羽好時光！
          </p>
          <Link
            to="/products"
            className="btn-brand-primary mt-6 inline-flex items-center px-6 py-3 text-sm"
          >
            前往產品目錄
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {hasStockIssue && (
            <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border-strong bg-status-danger-bg px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-2.5 text-xs text-status-danger">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-bold">購物車內部分商品庫存異動或已售完</p>
                  <p className="mt-0.5">
                    可能已有其他鳥友搶先下單，請調整數量或移除缺貨品項後再結帳。
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFixStockIssues}
                className="btn-brand-outline shrink-0 px-3.5 py-2 text-xs text-status-danger"
              >
                一鍵自動調整為可用庫存
              </button>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
          {/* 左側購物車清單與優惠券 */}
          <div className="space-y-4 lg:col-span-2">
            {hydratedItems.map(
              ({ itemKey, product, variant, unitPrice, availableStock, quantity, lineTotal }) => (
                <div
                  key={itemKey}
                  className="card-warm flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-36 w-full shrink-0 rounded-xl border border-border-soft bg-bg-surface object-cover sm:h-24 sm:w-28"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${product.id}`}
                      className="text-base font-bold text-text-primary hover:text-brand-accent"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {product.category}
                      {variant ? ` ｜ 規格：${variant.label}` : ''}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-brand-accent">
                      單價 NT$ {unitPrice.toLocaleString()}
                      {quantity > availableStock && (
                        <span className="ml-2 text-xs text-status-danger">
                          （庫存僅剩 {availableStock} 件）
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="inline-flex items-center rounded-xl border border-border-soft bg-bg-surface">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1, variant?.id)}
                        className="p-2 text-text-secondary hover:text-text-primary"
                        aria-label="減少數量"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[2.25rem] text-center text-sm font-bold text-text-primary">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            product.id,
                            Math.min(availableStock, quantity + 1),
                            variant?.id
                          )
                        }
                        className="p-2 text-text-secondary hover:text-text-primary"
                        aria-label="增加數量"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="min-w-[5rem] text-right text-base font-extrabold text-text-primary">
                      NT$ {lineTotal.toLocaleString()}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id, variant?.id)}
                      className="rounded-lg p-2 text-text-muted hover:bg-status-danger-bg hover:text-status-danger"
                      title="移除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            )}

            {/* 優惠券折扣碼區塊 */}
            <div className="card-warm p-5">
              <div className="mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-brand-accent" />
                <h2 className="text-sm font-bold text-text-primary">使用優惠券／折扣碼</h2>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="輸入折扣碼（試試：BIRDDAYS50 或 SUNSHINE90）"
                  className="input-warm w-full text-sm sm:flex-1"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="btn-brand-outline px-4 py-2 text-sm"
                >
                  套用折扣
                </button>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponInput('');
                      setCouponMessage(null);
                    }}
                    className="rounded-xl px-3 py-2 text-xs font-medium text-status-danger hover:bg-status-danger-bg"
                  >
                    取消使用
                  </button>
                )}
              </div>
              {couponMessage && (
                <p
                  className={`mt-2 text-xs font-semibold ${
                    couponMessage.type === 'ok'
                      ? 'text-status-success'
                      : 'text-status-danger'
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>
          </div>

          {/* 右側配送、金流與結帳表單 */}
          <form onSubmit={handleCheckout} className="card-warm h-fit p-6">
            <h2 className="text-lg font-extrabold text-text-primary">結帳與配送設定</h2>

            <div className="mt-4 space-y-2 border-b border-border-soft pb-4 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>商品小計</span>
                <span>NT$ {subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between font-semibold text-status-success">
                  <span>優惠券折抵（{appliedCoupon?.code}）</span>
                  <span>- NT$ {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-text-secondary">
                <span>
                  {deliveryMethod === 'cvs_pickup'
                    ? shippingConfig.enableFreeShipping
                      ? `超商運費（滿 ${shippingConfig.cvsFreeThreshold.toLocaleString()} 免運）`
                      : '超商取貨運費'
                    : shippingConfig.enableFreeShipping
                      ? `宅配運費（滿 ${shippingConfig.freeShippingThreshold.toLocaleString()} 免運）`
                      : '宅配運費'}
                </span>
                <span>{shippingFee === 0 ? '免運費' : `NT$ ${shippingFee.toLocaleString()}`}</span>
              </div>

              {shippingConfig.shippingNotice && (
                <p className="text-xs text-text-muted">{shippingConfig.shippingNotice}</p>
              )}

              <div className="flex justify-between pt-2 text-base font-extrabold text-text-primary">
                <span>應付總額</span>
                <span className="text-brand-accent">NT$ {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 space-y-3.5">
              {/* 配送方式 */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-primary">
                  <Truck className="h-3.5 w-3.5 text-brand-accent" />
                  選擇配送方式
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['home_delivery', 'cvs_pickup'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setDeliveryMethod(method)}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                        deliveryMethod === method
                          ? 'border-brand-accent bg-brand-soft text-text-primary'
                          : 'border-border-soft bg-bg-card text-text-secondary'
                      }`}
                    >
                      {method === 'home_delivery' ? '宅配到府' : '超商取貨'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 付款方式（預留綠界第三方支付） */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-primary">
                  <CreditCard className="h-3.5 w-3.5 text-brand-accent" />
                  選擇付款方式（支援第三方支付）
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="input-warm w-full text-xs font-medium"
                >
                  {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((pm) => (
                    <option key={pm} value={pm}>
                      {PAYMENT_METHOD_LABELS[pm]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  收件人姓名 *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="請輸入真實姓名"
                  className="input-warm w-full text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  聯絡電話 *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912-345-678"
                  className="input-warm w-full text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  電子信箱 *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-warm w-full text-sm"
                />
              </div>

              {deliveryMethod === 'cvs_pickup' ? (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-text-secondary">
                    選擇取貨超商門市（Mock 模擬電子地圖）*
                  </label>
                  <select
                    value={cvsStoreName}
                    onChange={(e) => setCvsStoreName(e.target.value)}
                    className="input-warm w-full text-xs"
                  >
                    {MOCK_CVS_STORES.map((store) => (
                      <option key={store} value={store}>
                        {store}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-text-secondary">
                    收件地址 *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="請輸入完整寄送地址"
                    className="input-warm w-full text-sm"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  給店家的備註（例如家中鳥寶品種）
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="選填"
                  className="input-warm w-full text-sm"
                />
              </div>
            </div>

            {checkoutError && (
              <div className="mt-4 rounded-xl bg-status-danger-bg px-3.5 py-2.5 text-xs font-semibold text-status-danger">
                {checkoutError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || hasStockIssue}
              className="btn-brand-primary mt-5 w-full py-3 text-sm"
            >
              {hasStockIssue
                ? '請先調整庫存異常商品'
                : paymentService.requiresGatewayRedirect(paymentMethod)
                  ? '前往第三方支付付款'
                  : '確認送出訂單'}
            </button>

            <p className="mt-2.5 text-center text-[11px] text-text-muted">
              下單即同意本站之{' '}
              <Link to="/policies/shopping" className="text-brand-accent underline">
                購物須知
              </Link>{' '}
              與{' '}
              <Link to="/policies/return" className="text-brand-accent underline">
                退換貨政策
              </Link>
            </p>
          </form>
        </div>
        </div>
      )}
    </div>
  );
};
