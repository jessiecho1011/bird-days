import React, { useMemo, useState } from 'react';
import {
  ClipboardList,
  MapPin,
  Phone,
  Search,
  Trash2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  DELIVERY_METHOD_LABELS,
  ORDER_STATUSES,
  PAYMENT_METHOD_LABELS,
  type MockOrder,
  type OrderStatus,
} from '../../types';

const STATUS_STYLE_MAP: Record<OrderStatus, string> = {
  待處理: 'bg-status-warning-bg text-status-warning',
  備貨中: 'bg-brand-soft text-brand-accent',
  已出貨: 'bg-brand-secondary text-text-primary',
  已完成: 'bg-status-success-bg text-status-success',
  已取消: 'bg-status-danger-bg text-status-danger',
};

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderAdminNote, deleteOrder } = useData();
  const [selectedStatus, setSelectedStatus] = useState<'全部' | OrderStatus>('全部');
  const [keyword, setKeyword] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const filteredOrders = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return orders.filter((ord) => {
      if (selectedStatus !== '全部' && ord.status !== selectedStatus) return false;
      if (!q) return true;
      return (
        ord.id.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        ord.phone.toLowerCase().includes(q)
      );
    });
  }, [orders, selectedStatus, keyword]);

  const statusCountMap = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      待處理: 0,
      備貨中: 0,
      已出貨: 0,
      已完成: 0,
      已取消: 0,
    };
    for (const o of orders) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  }, [orders]);

  const startEditNote = (order: MockOrder) => {
    setEditingNoteId(order.id);
    setNoteDraft(order.adminNote || '');
  };

  const handleSaveNote = (orderId: string) => {
    updateOrderAdminNote(orderId, noteDraft.trim());
    setEditingNoteId(null);
  };

  const handleDelete = (order: MockOrder) => {
    if (window.confirm(`確定要刪除訂單 ${order.id}（${order.customerName}）嗎？`)) {
      deleteOrder(order.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">訂單管理</h1>
          <p className="mt-1 text-sm text-text-secondary">
            檢視顧客訂單明細、更新出貨處理狀態與填寫後台物流備註
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜尋訂單編號、姓名或電話"
            className="input-warm w-full pl-9 text-sm"
          />
        </div>
      </div>

      {/* 狀態統計與篩選按鈕 */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedStatus('全部')}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
            selectedStatus === '全部'
              ? 'bg-brand-primary text-text-on-primary shadow-sm'
              : 'border border-border-soft bg-bg-card text-text-secondary hover:bg-bg-surface'
          }`}
        >
          全部訂單（{orders.length}）
        </button>

        {ORDER_STATUSES.map((st) => {
          const active = selectedStatus === st;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                active
                  ? 'bg-brand-primary text-text-on-primary shadow-sm'
                  : 'border border-border-soft bg-bg-card text-text-secondary hover:bg-bg-surface'
              }`}
            >
              {st}（{statusCountMap[st]}）
            </button>
          );
        })}
      </div>

      {/* 訂單清單 */}
      {filteredOrders.length === 0 ? (
        <div className="surface-warm py-14 text-center">
          <ClipboardList className="mx-auto mb-2 h-8 w-8 text-brand-accent" />
          <p className="text-base font-semibold text-text-primary">
            目前沒有符合條件的訂單
          </p>
          <p className="mt-1 text-xs text-text-muted">
            可至前台購物車測試下單，或切換其他訂單狀態篩選。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <article key={order.id} className="card-warm p-5">
              {/* 頂部資訊與狀態切換 */}
              <div className="flex flex-col justify-between gap-3 border-b border-border-soft pb-4 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-base font-extrabold text-brand-accent">
                    {order.id}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLE_MAP[order.status]}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-xs text-text-muted">
                    {new Date(order.createdAt).toLocaleString('zh-TW')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-xs font-medium text-text-secondary">
                    處理狀態：
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value as OrderStatus)
                    }
                    className="input-warm py-1.5 text-xs font-semibold"
                  >
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleDelete(order)}
                    className="rounded-xl border border-border-soft p-2 text-status-danger hover:bg-status-danger-bg"
                    title="刪除訂單"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* 顧客資訊與訂購明細 */}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="min-w-0 space-y-1.5 text-sm">
                  <p className="font-bold text-text-primary">
                    收件人：{order.customerName}
                  </p>
                  <p className="flex items-center gap-1.5 break-all text-xs text-text-secondary">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-brand-accent" />
                    {order.phone} ｜ {order.email}
                  </p>
                  <p className="flex items-start gap-1.5 text-xs text-text-secondary">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-accent" />
                    <span>
                      [{DELIVERY_METHOD_LABELS[order.deliveryMethod]}] {order.shippingAddress}
                    </span>
                  </p>
                  <p className="text-xs text-text-secondary">
                    <strong className="text-text-primary">付款：</strong>
                    {PAYMENT_METHOD_LABELS[order.paymentMethod]}（
                    <span className="font-semibold text-brand-accent">
                      {order.paymentStatus}
                    </span>
                    {order.paymentTradeNo ? ` / ${order.paymentTradeNo}` : ''}）
                  </p>
                  {order.note && (
                    <div className="mt-2 rounded-lg bg-bg-surface px-3 py-2 text-xs text-text-secondary">
                      <span className="font-semibold text-text-primary">顧客備註：</span>
                      {order.note}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-border-soft bg-bg-surface p-3.5 text-xs">
                  <p className="mb-2 font-bold text-text-primary">訂購商品明細</p>
                  <ul className="space-y-1 text-text-secondary">
                    {order.items.map((item, idx) => (
                      <li
                        key={`${item.productId}-${idx}`}
                        className="flex justify-between gap-2"
                      >
                        <span className="truncate">
                          {item.name}
                          {item.variantLabel ? `（${item.variantLabel}）` : ''} ×{' '}
                          {item.quantity}
                        </span>
                        <span className="shrink-0 font-medium text-text-primary">
                          NT$ {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 space-y-1 border-t border-border-soft pt-2">
                    <div className="flex justify-between text-text-muted">
                      <span>商品小計</span>
                      <span>NT$ {order.subtotal.toLocaleString()}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between text-status-success">
                        <span>折扣碼折抵（{order.couponCode}）</span>
                        <span>- NT$ {order.discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-text-muted">
                      <span>運費</span>
                      <span>
                        {order.shippingFee === 0
                          ? '免運費'
                          : `NT$ ${order.shippingFee.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 text-sm font-extrabold text-text-primary">
                      <span>訂單總金額</span>
                      <span className="text-brand-accent">
                        NT$ {order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 後台內部備註 / 物流單號 */}
              <div className="mt-4 border-t border-border-soft pt-3">
                {editingNoteId === order.id ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="輸入物流單號或內部處理備註..."
                      className="input-warm flex-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveNote(order.id)}
                      className="btn-brand-primary px-3.5 py-1.5 text-xs"
                    >
                      儲存備註
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingNoteId(null)}
                      className="btn-brand-outline px-3 py-1.5 text-xs"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-text-secondary">
                      <strong className="text-text-primary">管理備註 / 物流單號：</strong>
                      {order.adminNote ? order.adminNote : '尚未填寫'}
                    </span>
                    <button
                      type="button"
                      onClick={() => startEditNote(order)}
                      className="font-semibold text-brand-accent hover:underline"
                    >
                      {order.adminNote ? '修改備註' : '+ 新增備註 / 單號'}
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

