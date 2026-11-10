import React, { useState } from 'react';
import { Edit3, Plus, Tag, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { Coupon } from '../../types';

interface CouponFormState {
  code: string;
  title: string;
  discountType: 'fixed' | 'percent';
  discountValue: number;
  minSpend: number;
  isActive: boolean;
  expiresAt: string;
}

const createEmptyCoupon = (): CouponFormState => ({
  code: '',
  title: '',
  discountType: 'fixed',
  discountValue: 50,
  minSpend: 500,
  isActive: true,
  expiresAt: '2026-12-31',
});

export const AdminCouponsPage: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useData();
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<CouponFormState>(createEmptyCoupon);

  const startCreate = () => {
    setForm(createEmptyCoupon());
    setEditingId('new');
  };

  const startEdit = (c: Coupon) => {
    setForm({
      code: c.code,
      title: c.title,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minSpend: c.minSpend,
      isActive: c.isActive,
      expiresAt: c.expiresAt || '',
    });
    setEditingId(c.id);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: form.code.trim().toUpperCase(),
      title: form.title.trim(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue) || 0,
      minSpend: Number(form.minSpend) || 0,
      isActive: form.isActive,
      expiresAt: form.expiresAt.trim() || undefined,
    };

    if (editingId === 'new') {
      addCoupon(payload);
    } else if (editingId) {
      updateCoupon(editingId, payload);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">
            優惠券／折扣碼管理
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            建立滿額折現或打折活動代碼，前台結帳即可立即輸入折抵
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="btn-brand-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
        >
          <Plus className="h-4 w-4" />
          新增折扣碼
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={handleSave} className="card-warm space-y-4 p-6">
          <h2 className="text-base font-bold text-text-primary">
            {editingId === 'new' ? '建立新折扣碼' : '編輯折扣碼'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                折扣代碼（英數大寫）*
              </label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
                placeholder="例如：BIRD100"
                className="input-warm w-full text-sm font-mono"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                活動名稱說明 *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="例如：週年慶滿千折百"
                className="input-warm w-full text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                折扣方式
              </label>
              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discountType: e.target.value as 'fixed' | 'percent',
                  })
                }
                className="input-warm w-full text-sm"
              >
                <option value="fixed">折抵固定金額（NT$）</option>
                <option value="percent">打折比例（輸入 90 代表 9 折）</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                {form.discountType === 'fixed' ? '折抵金額 (NT$)' : '折扣數值 (1-99)'} *
              </label>
              <input
                type="number"
                min={1}
                required
                value={form.discountValue}
                onChange={(e) =>
                  setForm({ ...form, discountValue: Number(e.target.value) })
                }
                className="input-warm w-full text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                最低消費門檻 (NT$)
              </label>
              <input
                type="number"
                min={0}
                value={form.minSpend}
                onChange={(e) =>
                  setForm({ ...form, minSpend: Number(e.target.value) })
                }
                className="input-warm w-full text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                到期日（選填）
              </label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="input-warm w-full text-sm"
              />
            </div>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 accent-brand-accent"
            />
            啟用此折扣碼
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="btn-brand-outline px-5 py-2 text-sm"
            >
              取消
            </button>
            <button type="submit" className="btn-brand-primary px-6 py-2 text-sm">
              儲存折扣碼
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="card-warm flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-brand-soft px-2.5 py-1 font-mono text-xs font-extrabold text-brand-accent">
                  <Tag className="h-3.5 w-3.5" />
                  {coupon.code}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    coupon.isActive
                      ? 'bg-status-success-bg text-status-success'
                      : 'bg-status-danger-bg text-status-danger'
                  }`}
                >
                  {coupon.isActive ? '進行中' : '已停用'}
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-text-primary">
                {coupon.title}
              </h3>
              <p className="mt-0.5 text-xs text-text-secondary">
                {coupon.discountType === 'fixed'
                  ? `折抵 NT$ ${coupon.discountValue}`
                  : `享 ${coupon.discountValue / 10} 折`}{' '}
                ｜ 滿 NT$ {coupon.minSpend.toLocaleString()} 可用
                {coupon.expiresAt ? ` ｜ 至 ${coupon.expiresAt}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => updateCoupon(coupon.id, { isActive: !coupon.isActive })}
                className="btn-brand-outline px-3 py-1.5 text-xs"
              >
                {coupon.isActive ? '停用' : '啟用'}
              </button>
              <button
                type="button"
                onClick={() => startEdit(coupon)}
                className="btn-brand-primary inline-flex items-center gap-1 px-3 py-1.5 text-xs"
              >
                <Edit3 className="h-3.5 w-3.5" />
                編輯
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`確定刪除折扣碼 ${coupon.code} 嗎？`)) {
                    deleteCoupon(coupon.id);
                  }
                }}
                className="rounded-xl border border-border-soft p-2 text-status-danger hover:bg-status-danger-bg"
                title="刪除"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

