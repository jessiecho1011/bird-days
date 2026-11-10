import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Feather,
  HeartHandshake,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
} from 'lucide-react';
import { RichTextViewer } from '../../components/common/RichTextViewer';
import { VideoPlayer } from '../../components/common/VideoPlayer';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';

export const HomePage: React.FC = () => {
  const { products, stores, siteContent, articles } = useData();
  const { addToCart } = useCart();

  const latestArticles = articles.filter((a) => a.isPublished).slice(0, 2);

  const featuredProducts = products
    .filter((p) => p.isActive && p.isFeatured)
    .slice(0, 4);

  const displayProducts =
    featuredProducts.length > 0
      ? featuredProducts
      : products.filter((p) => p.isActive).slice(0, 4);

  return (
    <div>
      {/* Hero 形象區 */}
      <section className="border-b border-border-soft bg-bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-16">
          <div>
            <span className="badge-warm inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-accent" />
              寵物鳥專屬溫暖選物店
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-text-primary sm:text-4xl lg:text-[2.65rem]">
              {siteContent.heroTitle}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              {siteContent.heroSubtitle}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="btn-brand-primary inline-flex items-center gap-2 px-6 py-3 text-sm"
              >
                探索鳥寶好物
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/stores"
                className="btn-brand-outline inline-flex items-center gap-2 px-5 py-3 text-sm"
              >
                <Store className="h-4 w-4 text-brand-accent" />
                尋找合作店家
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {siteContent.heroVideoUrl ? (
              <VideoPlayer
                url={siteContent.heroVideoUrl}
                title="品牌介紹影片"
                className="shadow-md"
              />
            ) : (
              <div className="card-warm overflow-hidden p-2">
                <img
                  src={siteContent.heroImageUrl}
                  alt={siteContent.brandName}
                  className="w-full rounded-xl object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 品牌三大堅持 */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card-warm flex items-start gap-3.5 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-accent">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-text-primary">無毒原木與食材把關</h2>
              <p className="mt-1 text-sm text-text-secondary">
                拒絕化學染色與劣質零件，讓愛啃咬探索的鳥寶每一口都安心。
              </p>
            </div>
          </div>

          <div className="card-warm flex items-start gap-3.5 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-accent">
              <Feather className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-text-primary">貼近毛羽自然天性</h2>
              <p className="mt-1 text-sm text-text-secondary">
                從護爪分岔棲木到藏食益智玩具，豐富居家籠內與放風時光。
              </p>
            </div>
          </div>

          <div className="card-warm flex items-start gap-3.5 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-accent">
              <HeartHandshake className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-text-primary">全台友善合作鳥店</h2>
              <p className="mt-1 text-sm text-text-secondary">
                目前共有 {stores.length} 家實體合作據點，提供實品體驗與鳥友交流。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 精選商品區 */}
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-brand-accent">
              FEATURED PICKS
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-text-primary">
              鳥寶最愛精選商品
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-accent hover:underline"
          >
            查看全部商品
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <article
              key={product.id}
              className="card-warm flex flex-col overflow-hidden transition-transform hover:-translate-y-0.5"
            >
              <Link
                to={`/products/${product.id}`}
                className="relative block aspect-[4/3] overflow-hidden bg-bg-surface"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="absolute left-3 top-3 rounded-full bg-brand-accent px-2.5 py-0.5 text-[11px] font-bold text-text-on-accent">
                    優惠中
                  </span>
                )}
              </Link>

              <div className="flex flex-1 flex-col p-4">
                <span className="text-xs font-medium text-text-muted">
                  {product.category}
                </span>
                <Link
                  to={`/products/${product.id}`}
                  className="mt-1 line-clamp-2 text-base font-bold text-text-primary hover:text-brand-accent"
                >
                  {product.name}
                </Link>
                <p className="mt-1 line-clamp-2 flex-1 text-xs text-text-secondary">
                  {product.subtitle}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-border-soft pt-3">
                  <div>
                    <span className="text-base font-extrabold text-brand-accent">
                      NT$ {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="ml-1.5 text-xs text-text-muted line-through">
                        NT$ {product.originalPrice}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => addToCart(product.id, 1, e.currentTarget)}
                    className="btn-brand-primary inline-flex items-center gap-1 px-3 py-1.5 text-xs"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    加入
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 毛羽小教室精選專欄 */}
      {latestArticles.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="text-xs font-bold tracking-wider text-brand-accent">
                FEATHER JOURNAL
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-text-primary">
                毛羽小教室・養鳥日常專欄
              </h2>
            </div>
            <Link
              to="/articles"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-accent hover:underline"
            >
              閱讀更多文章
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {latestArticles.map((post) => (
              <Link
                key={post.id}
                to={`/articles/${post.id}`}
                className="card-warm flex flex-col overflow-hidden transition-transform hover:-translate-y-0.5 sm:flex-row"
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-44 w-full shrink-0 bg-bg-surface object-cover sm:h-auto sm:w-44"
                />
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <span className="badge-warm">{post.category}</span>
                    <h3 className="mt-2 line-clamp-2 text-base font-bold text-text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs text-text-secondary">
                      {post.summary}
                    </p>
                  </div>
                  <span className="mt-3 text-xs font-semibold text-brand-accent">
                    點此閱讀全文 →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 品牌故事區塊（可由後台富文本編輯器自由修改樣式） */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="surface-warm p-6 sm:p-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-extrabold text-text-primary">
              {siteContent.storyTitle}
            </h2>
            <div className="mt-4">
              <RichTextViewer html={siteContent.storyHtml} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

