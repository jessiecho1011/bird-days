import React, { useState } from 'react';
import { Check, Truck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { calculateShippingFee } from '../../data/mockShipping';
import type { DeliveryMethod, ShippingConfig } from '../../types';

export const AdminShippingPage: React.FC = () => {
  const { shippingConfig, updateShippingConfig } = useData();
  const [form, setForm] = useState<ShippingConfig>(shippingConfig);
  const [testSubtotal, setTestSubtotal] = useState<number>(800);
  const [testMethod, setTestMethod] = useState<DeliveryMethod>('home_delivery');
  const [savedToast, setSavedToast] = useState(false);

  const previewShippingFee = calculateShippingFee(testSubtotal, form, testMethod);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned: ShippingConfig = {
      baseFee: Math.max(0, Number(form.baseFee) || 0),
      cvsFee: Math.max(0, Number(form.cvsFee) || 0),
      enableFreeShipping: form.enableFreeShipping,
      freeShippingThreshold: Math.max(0, Number(form.freeShippingThreshold) || 0),
      cvsFreeThreshold: Math.max(0, Number(form.cvsFreeThreshold) || 0),
      shippingNotice: form.shippingNotice.trim(),
    };
    updateShippingConfig(cleaned);
    setForm(cleaned);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">
          運費與免運門檻管理
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          客製化「本島宅配」與「超商取貨」基本運費及各自免運門檻，儲存後前台購物籃與結帳頁面將立即套用新規則。
        </p>
      </div>

      {savedToast && (
        <div className="flex items-center gap-2 rounded-xl bg-status-success-bg px-4 py-3 text-sm font-medium text-status-success">
          <Check className="h-4 w-4" />
          運費與免運門檻設定已儲存並同步至前台！
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左側設定表單 */}
        <form onSubmit={handleSubmit} className="card-warm space-y-5 p-6 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-border-soft pb-3">
            <Truck className="h-5 w-5 text-brand-accent" />
            <h2 className="text-base font-bold text-text-primary">雙配送運費規則設定</h2>
          </div>

          {/* 宅配與超商運費雙欄 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                本島宅配基本運費（NT$）*
              </label>
              <input
                type="number"
                min={0}
                required
                value={form.baseFee}
                onChange={(e) =>
                  setForm({ ...form, baseFee: Math.max(0, Number(e.target.value)) })
                }
                className="input-warm w-full text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                本島宅配免運門檻（NT$）
              </label>
              <input
                type="number"
                min={0}
                disabled={!form.enableFreeShipping}
                value={form.freeShippingThreshold}
                onChange={(e) =>
                  setForm({
                    ...form,
                    freeShippingThreshold: Math.max(0, Number(e.target.value)),
                  })
                }
                className="input-warm w-full text-sm disabled:opacity-50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                超商取貨基本運費（NT$）*
              </label>
              <input
                type="number"
                min={0}
                required
                value={form.cvsFee}
                onChange={(e) =>
                  setForm({ ...form, cvsFee: Math.max(0, Number(e.target.value)) })
                }
                className="input-warm w-full text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                超商取貨免運門檻（NT$）
              </label>
              <input
                type="number"
                min={0}
                disabled={!form.enableFreeShipping}
                value={form.cvsFreeThreshold}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cvsFreeThreshold: Math.max(0, Number(e.target.value)),
                  })
                }
                className="input-warm w-full text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border-soft bg-bg-surface p-4">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-text-primary">
              <input
                type="checkbox"
                checked={form.enableFreeShipping}
                onChange={(e) =>
                  setForm({ ...form, enableFreeShipping: e.target.checked })
                }
                className="h-4 w-4 accent-brand-accent"
              />
              啟用「滿額免運」優惠門檻（設為 0 元代表全館免運）
            </label>
          </div>

          {/* 快捷預設按鈕 */}
          <div>
            <p className="mb-2 text-xs font-semibold text-text-secondary">
              常用活動門檻快速套用：
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    enableFreeShipping: true,
                    freeShippingThreshold: 0,
                    cvsFreeThreshold: 0,
                  })
                }
                className="btn-brand-outline px-3 py-1.5 text-xs"
              >
                全館免運活動（門檻 0）
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    enableFreeShipping: true,
                    baseFee: 100,
                    freeShippingThreshold: 999,
                    cvsFee: 60,
                    cvsFreeThreshold: 699,
                  })
                }
                className="btn-brand-outline px-3 py-1.5 text-xs"
              >
                超商 699 / 宅配 999 免運
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    enableFreeShipping: true,
                    baseFee: 100,
                    freeShippingThreshold: 1200,
                    cvsFee: 60,
                    cvsFreeThreshold: 899,
                  })
                }
                className="btn-brand-outline px-3 py-1.5 text-xs"
              >
                超商 899 / 宅配 1,200 免運
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
              結帳頁面運費／配送補充說明
            </label>
            <textarea
              rows={2}
              value={form.shippingNotice}
              onChange={(e) => setForm({ ...form, shippingNotice: e.target.value })}
              className="input-warm w-full text-sm"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn-brand-primary px-8 py-2.5 text-sm">
              儲存運費設定
            </button>
          </div>
        </form>

        {/* 右側即時試算預覽 */}
        <aside className="card-warm h-fit space-y-4 p-6">
          <h2 className="text-base font-bold text-text-primary">規則即時試算預覽</h2>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTestMethod('home_delivery')}
              className={`rounded-xl border py-2 text-xs font-semibold ${
                testMethod === 'home_delivery'
                  ? 'border-brand-accent bg-brand-soft text-text-primary'
                  : 'border-border-soft bg-bg-card text-text-secondary'
              }`}
            >
              宅配到府
            </button>
            <button
              type="button"
              onClick={() => setTestMethod('cvs_pickup')}
              className={`rounded-xl border py-2 text-xs font-semibold ${
                testMethod === 'cvs_pickup'
                  ? 'border-brand-accent bg-brand-soft text-text-primary'
                  : 'border-border-soft bg-bg-card text-text-secondary'
              }`}
            >
              超商取貨
            </button>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
              模擬折抵後商品金額（NT$）
            </label>
            <input
              type="number"
              min={0}
              step={100}
              value={testSubtotal}
              onChange={(e) => setTestSubtotal(Math.max(0, Number(e.target.value)))}
              className="input-warm w-full text-sm"
            />
          </div>

          <div className="space-y-2 border-t border-border-soft pt-3 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>模擬商品金額</span>
              <span>NT$ {testSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>試算運費</span>
              <span className="font-semibold text-brand-accent">
                {previewShippingFee === 0
                  ? '免運費'
                  : `NT$ ${previewShippingFee.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-border-soft pt-2 font-extrabold text-text-primary">
              <span>應付總金額</span>
              <span>NT$ {(testSubtotal + previewShippingFee).toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
