import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bird,
  Film,
  Heart,
  MessageSquarePlus,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { RichTextViewer } from '../../components/common/RichTextViewer';
import { VideoPlayer } from '../../components/common/VideoPlayer';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    products,
    reviews,
    addReview,
    isWishlisted,
    toggleWishlist,
    member,
  } = useData();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id && p.isActive);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    undefined
  );
  const [quantity, setQuantity] = useState(1);

  // 評價表單
  const [authorName, setAuthorName] = useState(member?.name || '');
  const [birdType, setBirdType] = useState(member?.birdNames || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const productReviews = useMemo(
    () => reviews.filter((r) => r.productId === id && r.isApproved),
    [reviews, id]
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          p.isActive &&
          p.suitableBirds.some((b) => product.suitableBirds.includes(b))
      )
      .slice(0, 3);
  }, [products, product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="surface-warm p-10">
          <h1 className="text-2xl font-bold text-text-primary">找不到此商品</h1>
          <p className="mt-2 text-sm text-text-secondary">
            商品可能已下架或連結有誤，歡迎回產品目錄逛逛。
          </p>
          <Link
            to="/products"
            className="btn-brand-primary mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            返回產品目錄
          </Link>
        </div>
      </div>
    );
  }

  const variants = product.variants ?? [];
  const activeVariant =
    variants.length > 0
      ? variants.find((v) => v.id === selectedVariantId) ?? variants[0]
      : undefined;

  const displayPrice = activeVariant ? activeVariant.price : product.price;
  const displayOriginalPrice = activeVariant
    ? activeVariant.originalPrice
    : product.originalPrice;
  const displayStock = activeVariant ? activeVariant.stock : product.stock;
  const activeImage = product.images[selectedImageIdx] || product.images[0];
  const wished = isWishlisted(product.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!member || !authorName.trim() || !comment.trim()) return;
    addReview({
      productId: product.id,
      memberEmail: member.email,
      authorName: authorName.trim(),
      birdType: birdType.trim() || '毛羽家長',
      rating,
      comment: comment.trim(),
    });
    setComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 5000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-brand-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        返回產品目錄
      </Link>

      {/* 上半部：圖庫與購買資訊 */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* 左側多圖切換 */}
        <div className="space-y-3">
          <div className="card-warm aspect-[4/3] overflow-hidden bg-bg-surface p-2">
            <img
              src={activeImage}
              alt={product.name}
              className="h-full w-full rounded-xl object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex flex-wrap gap-2.5">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={`${imgUrl.slice(0, 24)}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`h-20 w-24 overflow-hidden rounded-xl border-2 bg-bg-surface transition-all ${
                    idx === selectedImageIdx
                      ? 'border-brand-primary shadow-sm'
                      : 'border-border-soft opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} 縮圖 ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 右側資訊 */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-warm">{product.category}</span>
              <span className="text-xs font-medium text-text-muted">
                庫存：{displayStock} 件
              </span>
            </div>

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="btn-brand-outline inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
            >
              <Heart
                className={`h-3.5 w-3.5 ${
                  wished ? 'fill-brand-accent text-brand-accent' : 'text-brand-accent'
                }`}
              />
              {wished ? '已收藏' : '加入收藏'}
            </button>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold text-text-primary sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-2 text-base text-text-secondary">{product.subtitle}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-brand-accent">
              NT$ {displayPrice.toLocaleString()}
            </span>
            {displayOriginalPrice && displayOriginalPrice > displayPrice && (
              <span className="text-base text-text-muted line-through">
                NT$ {displayOriginalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* 規格選擇 */}
          {variants.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-bold text-text-primary">選擇商品規格：</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                  const selected = activeVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={variant.stock <= 0}
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setQuantity(1);
                      }}
                      className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                        selected
                          ? 'border-brand-accent bg-brand-soft text-text-primary shadow-sm'
                          : 'border-border-soft bg-bg-card text-text-secondary hover:bg-bg-surface'
                      } disabled:opacity-45`}
                    >
                      {variant.label}
                      {variant.stock <= 0 ? '（缺貨）' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 適用鳥種 */}
          {product.suitableBirds.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border-soft bg-bg-surface p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-text-primary">
                <Bird className="h-4 w-4 text-brand-accent" />
                推薦適用鳥種
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.suitableBirds.map((bird) => (
                  <span
                    key={bird}
                    className="rounded-full border border-border-soft bg-bg-card px-3 py-1 text-xs font-medium text-text-secondary"
                  >
                    {bird}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 數量與加入購物車 */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="inline-flex w-fit items-center rounded-xl border border-border-strong bg-bg-card px-1 py-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="rounded-lg p-2 text-text-secondary hover:bg-bg-surface"
                aria-label="減少數量"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2.5rem] text-center text-sm font-bold text-text-primary">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(Math.max(1, displayStock), q + 1))
                }
                className="rounded-lg p-2 text-text-secondary hover:bg-bg-surface"
                aria-label="增加數量"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={displayStock <= 0}
              onClick={(e) =>
                addToCart(product.id, quantity, e.currentTarget, activeVariant?.id)
              }
              className="btn-brand-primary flex flex-1 items-center justify-center gap-2 px-6 py-3.5 text-sm"
            >
              <ShoppingBag className="h-4 w-4" />
              {displayStock > 0 ? '加入購物籃' : '目前缺貨中'}
            </button>
          </div>
        </div>
      </div>

      {/* 介紹影片區 */}
      {product.videoUrl && product.videoUrl.trim() !== '' && (
        <section className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <Film className="h-5 w-5 text-brand-accent" />
            <h2 className="text-xl font-extrabold text-text-primary">商品介紹影片</h2>
          </div>
          <div className="max-w-3xl">
            <VideoPlayer url={product.videoUrl} title={product.name} />
          </div>
        </section>
      )}

      {/* 富文本詳細說明區 */}
      <section className="mt-12 border-t border-border-soft pt-10">
        <h2 className="mb-4 text-xl font-extrabold text-text-primary">
          商品詳細介紹與使用說明
        </h2>
        <div className="card-warm p-6 sm:p-8">
          <RichTextViewer html={product.descriptionHtml} />
        </div>
      </section>

      {/* 鳥友買家秀與評價區 */}
      <section className="mt-12 border-t border-border-soft pt-10">
        <h2 className="mb-6 text-xl font-extrabold text-text-primary">
          鳥友評價與實測心得（{productReviews.length}）
        </h2>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {productReviews.length === 0 ? (
              <div className="surface-warm p-6 text-center text-sm text-text-muted">
                目前尚無評價，歡迎分享家裡鳥寶的使用心得！
              </div>
            ) : (
              productReviews.map((rev) => (
                <article key={rev.id} className="card-warm p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary">
                        {rev.authorName}
                      </span>
                      <span className="badge-warm">{rev.birdType}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-brand-primary">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rev.rating ? 'fill-brand-primary' : 'text-border-strong'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {rev.comment}
                  </p>
                  <p className="mt-2 text-right text-[11px] text-text-muted">
                    {new Date(rev.createdAt).toLocaleDateString('zh-TW')}
                  </p>
                </article>
              ))
            )}
          </div>

          {/* 撰寫評價（需登入會員才可送出 feedback，送出後由後台審核顯示） */}
          {!member ? (
            <div className="card-warm h-fit space-y-3 p-5 text-center">
              <MessageSquarePlus className="mx-auto h-7 w-7 text-brand-accent" />
              <h3 className="text-base font-bold text-text-primary">分享鳥寶心得</h3>
              <p className="text-xs leading-relaxed text-text-secondary">
                登入鳥友會員即可留下購買回饋，評價經後台審核後會顯示於商品頁！
              </p>
              <Link
                to={`/login?redirect=/products/${product.id}`}
                className="btn-brand-primary inline-flex w-full items-center justify-center py-2.5 text-xs"
              >
                登入／註冊會員以撰寫評價
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="card-warm h-fit space-y-3 p-5">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="h-4 w-4 text-brand-accent" />
                <h3 className="text-base font-bold text-text-primary">分享鳥寶心得</h3>
              </div>

              {reviewSubmitted && (
                <div className="rounded-lg bg-status-success-bg px-3 py-2 text-xs font-medium text-status-success">
                  感謝您的回饋！評價已儲存，待管理員審核後會顯示於此商品頁面。
                </div>
              )}

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                您的稱呼 *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="例如：阿吉媽咪"
                className="input-warm w-full text-xs"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                家中鳥寶品種與名字
              </label>
              <input
                type="text"
                value={birdType}
                onChange={(e) => setBirdType(e.target.value)}
                placeholder="例如：玄鳳「麻糬」"
                className="input-warm w-full text-xs"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                滿意度評分
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className="p-1"
                    aria-label={`${num} 顆星`}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        num <= rating
                          ? 'fill-brand-primary text-brand-primary'
                          : 'text-border-strong'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                心得內容 *
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="說說鳥寶喜不喜歡這項商品..."
                className="input-warm w-full text-xs"
              />
            </div>

            <button type="submit" className="btn-brand-primary w-full py-2.5 text-xs">
              送出評價（待後台審核）
            </button>
          </form>
          )}
        </div>
      </section>

      {/* 同鳥種推薦好物 */}
      {relatedProducts.length > 0 && (
        <section className="mt-12 border-t border-border-soft pt-10">
          <h2 className="mb-5 text-xl font-extrabold text-text-primary">
            相同鳥種也在逛的好物
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                to={`/products/${rel.id}`}
                onClick={() => setSelectedImageIdx(0)}
                className="card-warm flex items-center gap-3 p-3 transition-transform hover:-translate-y-0.5"
              >
                <img
                  src={rel.images[0]}
                  alt={rel.name}
                  className="h-16 w-20 shrink-0 rounded-xl bg-bg-surface object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-text-primary">
                    {rel.name}
                  </p>
                  <p className="mt-1 text-xs font-extrabold text-brand-accent">
                    NT$ {rel.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
