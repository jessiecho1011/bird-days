import React, { useState } from 'react';
import { ArrowLeft, Edit3, MapPin, Plus, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  STORE_REGIONS,
  type PartnerStore,
  type StoreRegion,
} from '../../types';

interface StoreFormState {
  name: string;
  region: StoreRegion;
  city: string;
  address: string;
  phone: string;
  openingHours: string;
  featuresText: string;
  description: string;
  mapUrl: string;
}

const createEmptyStore = (): StoreFormState => ({
  name: '',
  region: '北部',
  city: '台北市',
  address: '',
  phone: '',
  openingHours: '週二至週日 11:30 - 20:30',
  featuresText: '全系列選物, 友善鳥寶空間',
  description: '',
  mapUrl: '',
});

export const AdminStoresPage: React.FC = () => {
  const { stores, addStore, updateStore, deleteStore } = useData();
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<StoreFormState>(createEmptyStore);
  const [feedback, setFeedback] = useState('');

  const startCreate = () => {
    setForm(createEmptyStore());
    setEditingId('new');
    setFeedback('');
  };

  const startEdit = (store: PartnerStore) => {
    setForm({
      name: store.name,
      region: store.region,
      city: store.city,
      address: store.address,
      phone: store.phone,
      openingHours: store.openingHours,
      featuresText: store.features.join(', '),
      description: store.description,
      mapUrl: store.mapUrl || '',
    });
    setEditingId(store.id);
    setFeedback('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const features = form.featuresText
      .split(/[,，、]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: form.name.trim(),
      region: form.region,
      city: form.city.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      openingHours: form.openingHours.trim(),
      features,
      description: form.description.trim(),
      mapUrl: form.mapUrl.trim() || undefined,
    };

    if (editingId === 'new') {
      addStore(payload);
      setFeedback('已新增合作店家！');
    } else if (editingId) {
      updateStore(editingId, payload);
      setFeedback('已更新店家資訊！');
    }
    setEditingId(null);
  };

  const handleDelete = (store: PartnerStore) => {
    if (window.confirm(`確定要刪除合作店家「${store.name}」嗎？`)) {
      deleteStore(store.id);
      setFeedback(`已刪除「${store.name}」`);
    }
  };

  if (editingId !== null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-brand-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            返回店家列表
          </button>
          <h1 className="text-xl font-extrabold text-text-primary">
            {editingId === 'new' ? '新增合作店家' : '編輯合作店家'}
          </h1>
        </div>

        <form onSubmit={handleSave} className="card-warm space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                店家名稱 *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-warm w-full text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                所屬地區 *
              </label>
              <select
                value={form.region}
                onChange={(e) =>
                  setForm({ ...form, region: e.target.value as StoreRegion })
                }
                className="input-warm w-full text-sm"
              >
                {STORE_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                縣市 *
              </label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="例如：台北市"
                className="input-warm w-full text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                完整地址 *
              </label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="input-warm w-full text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                聯絡電話 *
              </label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-warm w-full text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                營業時間 *
              </label>
              <input
                type="text"
                required
                value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                className="input-warm w-full text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                店家特色標籤（以逗號分隔）
              </label>
              <input
                type="text"
                value={form.featuresText}
                onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                className="input-warm w-full text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                Google 地圖連結（選填）
              </label>
              <input
                type="url"
                value={form.mapUrl}
                onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
                placeholder="https://maps.google.com/?q=..."
                className="input-warm w-full text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                合作店家介紹 *
              </label>
              <textarea
                rows={3}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-warm w-full text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="btn-brand-outline px-6 py-2.5 text-sm"
            >
              取消
            </button>
            <button type="submit" className="btn-brand-primary px-8 py-2.5 text-sm">
              儲存店家
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">合作店家管理</h1>
          <p className="mt-1 text-sm text-text-secondary">
            管理全台「好個鳥日子」合作經銷與寄賣門市
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="btn-brand-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
        >
          <Plus className="h-4 w-4" />
          新增合作店家
        </button>
      </div>

      {feedback && (
        <div className="rounded-xl bg-status-success-bg px-4 py-3 text-sm font-medium text-status-success">
          {feedback}
        </div>
      )}

      <div className="space-y-3">
        {stores.map((store) => (
          <div
            key={store.id}
            className="card-warm flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center"
          >
            <div>
              <span className="badge-warm">
                {store.region}・{store.city}
              </span>
              <h2 className="mt-1.5 text-base font-bold text-text-primary">
                {store.name}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                <MapPin className="h-3.5 w-3.5 text-brand-accent" />
                {store.address} ｜ {store.phone}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => startEdit(store)}
                className="btn-brand-primary inline-flex items-center gap-1 px-3.5 py-1.5 text-xs"
              >
                <Edit3 className="h-3.5 w-3.5" />
                編輯
              </button>
              <button
                type="button"
                onClick={() => handleDelete(store)}
                className="rounded-xl border border-border-soft p-2 text-status-danger hover:bg-status-danger-bg"
                title="刪除店家"
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

