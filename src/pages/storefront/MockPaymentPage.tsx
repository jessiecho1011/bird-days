import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import type { EcpayCheckoutPayload } from '../../services/paymentService';
import { PAYMENT_METHOD_LABELS } from '../../types';

/**
 * 模擬第三方支付（綠界 ECPay）收銀台頁面
 * TODO: 未來串接 GCP 後端與綠界 AIO 後，使用者按下結帳會直接提交加密表單至綠界官方收銀台 URL，
 * 付款完成後由綠界背景呼叫後端 ReturnURL 更新訂單，再透過 OrderResultURL 導回本站結果頁。
 */
export const MockPaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const state = location.state as { session?: EcpayCheckoutPayload } | null;

  const { orders, updateOrderPaymentStatus, updateOrderStatus } = useData();
  const { clearCart } = useCart();
  const order = orders.find((o) => o.id === orderId);
  const [resultMode, setResultMode] = useState<'pending' | 'success' | 'failed'>(
    'pending'
  );

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="surface-warm p-8">
          <h1 className="text-xl font-bold text-text-primary">找不到待付款訂單</h1>
          <Link to="/products" className="btn-brand-primary mt-5 inline-block px-5 py-2.5 text-sm">
            返回商品目錄
          </Link>
        </div>
      </div>
    );
  }

  const tradeNo =
    order.paymentTradeNo ||
    state?.session?.merchantTradeNo ||
    `BD${order.id.replace(/\D/g, '')}`;

  const handleSimulateSuccess = () => {
    updateOrderPaymentStatus(order.id, '已付款（模擬）', tradeNo);
    clearCart();
    setResultMode('success');
  };

  const handleSimulateFail = () => {
    updateOrderPaymentStatus(order.id, '付款失敗', tradeNo);
    updateOrderStatus(order.id, '已取消');
    // 故意保留購物車內容（不呼叫 clearCart），讓顧客返回購物車直接再次結帳！
    setResultMode('failed');
  };

  if (resultMode === 'success' || order.paymentStatus === '已付款（模擬）') {
    return (
      <div className="mx-auto max-w-xl px-4 py-14">
        <div className="card-warm p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-success-bg text-status-success">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary">
            付款成功！訂單已確認
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            訂單編號：<strong className="text-brand-accent">{order.id}</strong>
            <br />
            金流交易序號：<code className="text-xs font-semibold">{tradeNo}</code>
          </p>
          <div className="mt-6 rounded-xl border border-border-soft bg-bg-surface p-4 text-left text-xs text-text-secondary space-y-1">
            <p>付款方式：{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
            <p>實付金額：NT$ {order.totalAmount.toLocaleString()}</p>
            <p>目前狀態：{order.status}（商品庫存已自動扣減）</p>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/orders/lookup" className="btn-brand-primary px-6 py-2.5 text-sm">
              前往訂單進度查詢
            </Link>
            <Link to="/products" className="btn-brand-outline px-6 py-2.5 text-sm">
              繼續逛逛
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (resultMode === 'failed' || order.paymentStatus === '付款失敗') {
    return (
      <div className="mx-auto max-w-xl px-4 py-14">
        <div className="card-warm p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-status-danger-bg text-status-danger">
            <AlertCircle className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-primary">
            付款未完成／已取消交易
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            訂單 <strong>{order.id}</strong> 已標記為「付款失敗」並釋放預扣庫存。
            <br />
            <strong className="text-text-primary">
              已為您完整保留購物車內的商品，您可以直接返回購物車更換付款方式或再次結帳！
            </strong>
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/cart" className="btn-brand-primary px-6 py-2.5 text-sm">
              返回購物車再次結帳
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
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="card-warm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-soft bg-bg-surface px-6 py-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-brand-accent" />
            <span className="text-base font-extrabold text-text-primary">
              模擬第三方支付收銀台（綠界 ECPay 預留流程）
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-status-success">
            <Lock className="h-3.5 w-3.5" />
            安全結帳模擬
          </span>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-xl border border-border-soft bg-brand-soft p-4 text-xs text-text-primary">
            <p className="font-bold">開發 TODO 說明：</p>
            <p className="mt-1 leading-relaxed text-text-secondary">
              目前尚未串接正式綠界 MerchantID / HashKey。未來於 GCP 後端建立{' '}
              <code>POST /api/payments/ecpay/checkout</code> 與{' '}
              <code>ReturnURL</code> 回調後，此步驟將自動跳轉至綠界官方收銀台。
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-border-soft bg-bg-surface p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">特店訂單編號</span>
              <span className="font-bold text-text-primary">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">模擬交易序號 (MerchantTradeNo)</span>
              <span className="font-mono text-xs text-text-primary">{tradeNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">選擇支付方式</span>
              <span className="font-medium text-text-primary">
                {PAYMENT_METHOD_LABELS[order.paymentMethod]}
              </span>
            </div>
            {order.paymentExpiresAt && (
              <div className="flex justify-between">
                <span className="text-text-muted">庫存預扣保留期限</span>
                <span className="font-semibold text-brand-accent">
                  {new Date(order.paymentExpiresAt).toLocaleTimeString('zh-TW')} 前（逾時自動釋放）
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-border-soft pt-2 text-base font-extrabold">
              <span className="text-text-primary">應付總金額</span>
              <span className="text-brand-accent">
                NT$ {order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <ShieldCheck className="h-4 w-4 text-brand-accent" />
            <span>請選擇要模擬的第三方金流回傳結果：</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleSimulateSuccess}
              className="btn-brand-primary py-3 text-sm"
            >
              模擬付款成功（完成交易）
            </button>
            <button
              type="button"
              onClick={handleSimulateFail}
              className="btn-brand-outline py-3 text-sm text-status-danger"
            >
              模擬付款失敗（取消並補回庫存）
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

