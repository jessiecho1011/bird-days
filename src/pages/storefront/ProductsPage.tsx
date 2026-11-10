import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import {
  BIRD_SPECIES_FILTERS,
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from '../../types';

export const ProductsPage: React.FC = () => {
  const { products, isWishlisted, toggleWishlist } = useData();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<'全部' | ProductCategory>('全部');
  const [selectedBird, setSelectedBird] = useState<string>('全部');
  const [keyword, setKeyword] = useState('');

  const filteredProducts = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return products.filter((p) => {
      if (!p.isActive) return false;
      if (selectedCategory !== '全部' && p.category !== selectedCategory) return false;
      if (
        selectedBird !== '全部' &&
        !p.suitableBirds.some((b) => b.includes(selectedBird) || b === '全鳥種適用')
      ) {
        return false;
      }
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.suitableBirds.some((b) => b.toLowerCase().includes(q))
      );
    });
  }, [products, selectedCategory, selectedBird, keyword]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-xs font-bold tracking-wider text-brand-accent">
            PRODUCT CATALOG
          </span>
          <h1 className="mt-1 text-3xl font-extrabold text-text-primary">
            寵物鳥生活選物目錄
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            依鳥寶需求與品種挑選安全主食、原木棲木、啃咬玩具與外出配件
          </p>
        </div>

        {/* 搜尋列 */}
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜尋商品或鳥種（如：玄鳳）"
            className="input-warm w-full pl-9 text-sm"
          />
        </div>
      </div>

      {/* 分類篩選按鈕 */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(['全部', ...PRODUCT_CATEGORIES] as const).map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-primary text-text-on-primary font-semibold shadow-sm'
                  : 'border border-border-soft bg-bg-card text-text-secondary hover:bg-bg-surface'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 鳥種快速篩選 */}
      <div className="mb-8 flex flex-wrap items-center gap-2 rounded-2xl border border-border-soft bg-bg-surface px-4 py-3">
        <span className="text-xs font-bold text-text-primary">我家鳥寶品種：</span>
        {(['全部', ...BIRD_SPECIES_FILTERS] as const).map((bird) => {
          const active = selectedBird === bird;
          return (
            <button
              key={bird}
              type="button"
              onClick={() => setSelectedBird(bird)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? 'bg-brand-accent text-text-on-accent font-semibold'
                  : 'border border-border-soft bg-bg-card text-text-secondary hover:bg-brand-soft'
              }`}
            >
              {bird === '全部' ? '不限鳥種' : bird}
            </button>
          );
        })}
      </div>

      {/* 商品網格 */}
      {filteredProducts.length === 0 ? (
        <div className="surface-warm py-16 text-center">
          <p className="text-base font-semibold text-text-primary">
            找不到符合條件的商品
          </p>
          <p className="mt-1 text-sm text-text-muted">
            試試看清除搜尋關鍵字或切換其他分類／鳥種
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const wished = isWishlisted(product.id);
            const hasVariants = Boolean(product.variants && product.variants.length > 0);
            const displayPrice = hasVariants
              ? Math.min(...product.variants!.map((v) => v.price))
              : product.price;

            return (
              <article
                key={product.id}
                className="card-warm flex flex-col overflow-hidden transition-transform hover:-translate-y-0.5"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-bg-surface">
                  <Link to={`/products/${product.id}`} className="block h-full w-full">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={wished ? '移除收藏' : '加入收藏'}
                    className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-border-soft bg-bg-card/90 text-brand-accent shadow-sm transition-transform hover:scale-105"
                  >
                    <Heart
                      className={`h-4 w-4 ${wished ? 'fill-brand-accent text-brand-accent' : ''}`}
                    />
                  </button>
                  {product.videoUrl && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-bg-dark/80 px-2.5 py-1 text-[11px] font-medium text-text-on-accent">
                      <Film className="h-3 w-3" />
                      含介紹影片
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="badge-warm">{product.category}</span>
                    {product.suitableBirds.slice(0, 3).map((bird) => (
                      <span
                        key={bird}
                        className="rounded-full border border-border-soft bg-bg-base px-2 py-0.5 text-[11px] text-text-secondary"
                      >
                        {bird}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/products/${product.id}`}
                    className="mt-3 text-lg font-bold text-text-primary hover:text-brand-accent"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1.5 flex-1 text-sm text-text-secondary">
                    {product.subtitle}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-border-soft pt-4">
                    <div>
                      <span className="text-lg font-extrabold text-brand-accent">
                        NT$ {displayPrice.toLocaleString()}
                        {hasVariants ? ' 起' : ''}
                      </span>
                      {!hasVariants &&
                        product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="ml-2 text-xs text-text-muted line-through">
                            NT$ {product.originalPrice}
                          </span>
                        )}
                    </div>
                    <button
                      type="button"
                      disabled={product.stock <= 0}
                      onClick={(e) => addToCart(product.id, 1, e.currentTarget)}
                      className="btn-brand-primary inline-flex items-center gap-1.5 px-4 py-2 text-sm"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {product.stock > 0 ? '加入購物籃' : '已售完'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
