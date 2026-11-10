import React, { useMemo, useState } from 'react';
import { Clock, ExternalLink, MapPin, Phone, Store } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { STORE_REGIONS, type StoreRegion } from '../../types';

export const StoresPage: React.FC = () => {
  const { stores } = useData();
  const [selectedRegion, setSelectedRegion] = useState<'全部' | StoreRegion>('全部');

  const filteredStores = useMemo(() => {
    if (selectedRegion === '全部') return stores;
    return stores.filter((s) => s.region === selectedRegion);
  }, [stores, selectedRegion]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="text-xs font-bold tracking-wider text-brand-accent">
          PARTNER STORES
        </span>
        <h1 className="mt-1 text-3xl font-extrabold text-text-primary">
          全台合作店家據點
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          歡迎前往以下合作寵物鳥專門店與友善空間，現場感受商品材質與實品尺寸。
        </p>
      </div>

      {/* 地區篩選 */}
      <div className="mb-8 flex flex-wrap gap-2">
        {(['全部', ...STORE_REGIONS] as const).map((region) => {
          const active = selectedRegion === region;
          return (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-primary text-text-on-primary font-semibold shadow-sm'
                  : 'border border-border-soft bg-bg-card text-text-secondary hover:bg-bg-surface'
              }`}
            >
              {region === '全部' ? '全部地區' : `${region}地區`}
            </button>
          );
        })}
      </div>

      {filteredStores.length === 0 ? (
        <div className="surface-warm py-14 text-center">
          <Store className="mx-auto mb-2 h-8 w-8 text-brand-accent" />
          <p className="text-base font-semibold text-text-primary">
            該地區目前尚未新增合作店家
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredStores.map((store) => (
            <article key={store.id} className="card-warm flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="badge-warm">
                    {store.region}・{store.city}
                  </span>
                  <h2 className="mt-2.5 text-xl font-bold text-text-primary">
                    {store.name}
                  </h2>
                </div>
                {store.mapUrl && (
                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-brand-outline inline-flex shrink-0 items-center gap-1 px-3 py-1.5 text-xs"
                  >
                    地圖導航
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {store.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {store.features.map((feat) => (
                  <span
                    key={feat}
                    className="rounded-lg bg-bg-surface px-2.5 py-1 text-xs font-medium text-text-primary border border-border-soft"
                  >
                    {feat}
                  </span>
                ))}
              </div>

              <div className="mt-5 space-y-2 border-t border-border-soft pt-4 text-sm text-text-secondary">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-brand-accent" />
                  <span>{store.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-brand-accent" />
                  <span>{store.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-brand-accent" />
                  <span>{store.openingHours}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

