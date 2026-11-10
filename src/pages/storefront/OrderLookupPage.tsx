import React, { useState } from 'react';
import { PackageCheck, Search, Truck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  DELIVERY_METHOD_LABELS,
  PAYMENT_METHOD_LABELS,
  type MockOrder,
} from '../../types';

export const OrderLookupPage: React.FC = () => {
  const { orders } = useData();
  const [orderIdInput, setOrderIdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<MockOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const idNorm = orderIdInput.trim().toUpperCase();
    const phoneNorm = phoneInput.replace(/[-\s]/g, '').trim();

    const found = orders.find((o) => {
      const oPhone = o.phone.replace(/[-\s]/g, '').trim();
      return o.id.toUpperCase() === idNorm && oPhone === phoneNorm;
    });

    setMatchedOrder(found ?? null);
    setHasSearched(true);
  };

  const fillDemoOrder = () => {
    if (orders.length === 0) return;
    setOrderIdInput(orders[0].id);
    setPhoneInput(orders[0].phone);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <span className="text-xs font-bold tracking-wider text-brand-accent">
          ORDER TRACKING
        </span>
        <h1 className="mt-1 text-3xl font-extrabold text-text-primary">
          訂單進度查詢
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          免登入會員即可查詢訂單備貨狀態、付款狀況與物流追蹤編號
        </p>
      </div>

      <form onSubmit={handleSearch} className="card-warm space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-text-secondary">
              訂單編號 *
            </label>
            <input
              type="text"
              required
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="例如：ORD-260101"
              className="input-warm w-full text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-text-secondary">
              訂購人手機號碼 *
            </label>
            <input
              type="tel"
              required
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="例如：0912-345-678"
              className="input-warm w-full text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {orders.length > 0 && (
            <button
              type="button"
              onClick={fillDemoOrder}
              className="text-xs font-semibold text-brand-accent hover:underline"
            >
              一鍵帶入測試訂單（{orders[0].id}）
            </button>
          )}
          <button
            type="submit"
            className="btn-brand-primary ml-auto inline-flex items-center gap-2 px-6 py-2.5 text-sm"
          >
            <Search className="h-4 w-4" />
            查詢訂單
          </button>
        </div>
      </form>

      {hasSearched && !matchedOrder && (
        <div className="surface-warm mt-6 p-8 text-center">
          <p className="text-base font-bold text-text-primary">
            查無符合的訂單資料
          </p>
          <p className="mt-1 text-xs text-text-muted">
            請確認訂單編號與下單手機號碼是否填寫正確。
          </p>
        </div>
      )}

      {matchedOrder && (
        <div className="card-warm mt-6 space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-soft pb-4">
            <div className="flex items-center gap-2.5">
              <PackageCheck className="h-5 w-5 text-brand-accent" />
              <span className="text-lg font-extrabold text-text-primary">
                {matchedOrder.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-warm">訂單狀態：{matchedOrder.status}</span>
              <span className="rounded-full border border-border-soft bg-bg-surface px-3 py-0.5 text-xs font-semibold text-text-secondary">
                {matchedOrder.paymentStatus}
              </span>
            </div>
          </div>

          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-text-secondary">
                <strong className="text-text-primary">收件人：</strong>
                {matchedOrder.customerName}
              </p>
              <p className="text-text-secondary">
                <strong className="text-text-primary">配送方式：</strong>
                {DELIVERY_METHOD_LABELS[matchedOrder.deliveryMethod]}
              </p>
              <p className="text-text-secondary">
                <strong className="text-text-primary">配送資訊：</strong>
                {matchedOrder.shippingAddress}
              </p>
              <p className="text-text-secondary">
                <strong className="text-text-primary">付款方式：</strong>
                {PAYMENT_METHOD_LABELS[matchedOrder.paymentMethod]}
              </p>
            </div>

            <div className="rounded-xl border border-border-soft bg-bg-surface p-4">
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-primary">
                <Truck className="h-4 w-4 text-brand-accent" />
                店家出貨／物流追蹤訊息
              </p>
              <p className="text-xs leading-relaxed text-text-secondary">
                {matchedOrder.adminNote
                  ? matchedOrder.adminNote
                  : '店家尚在備貨整理中，出貨後會於此更新物流單號。'}
              </p>
            </div>
          </div>

          <div className="border-t border-border-soft pt-4">
            <p className="mb-2 text-xs font-bold text-text-primary">商品明細</p>
            <ul className="space-y-1.5 text-sm">
              {matchedOrder.items.map((item, idx) => (
                <li
                  key={`${item.productId}-${idx}`}
                  className="flex justify-between text-text-secondary"
                >
                  <span>
                    {item.name}
                    {item.variantLabel ? `（${item.variantLabel}）` : ''} ×{' '}
                    {item.quantity}
                  </span>
                  <span className="font-semibold text-text-primary">
                    NT$ {(item.price * item.quantity).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-border-soft pt-3 text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>商品小計</span>
                <span>NT$ {matchedOrder.subtotal.toLocaleString()}</span>
              </div>
              {matchedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-status-success">
                  <span>優惠券折抵（{matchedOrder.couponCode}）</span>
                  <span>- NT$ {matchedOrder.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>運費</span>
                <span>
                  {matchedOrder.shippingFee === 0
                    ? '免運費'
                    : `NT$ ${matchedOrder.shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-base font-extrabold text-brand-accent">
                <span>實付總額</span>
                <span>NT$ {matchedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

