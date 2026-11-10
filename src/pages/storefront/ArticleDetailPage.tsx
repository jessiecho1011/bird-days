import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { RichTextViewer } from '../../components/common/RichTextViewer';
import { VideoPlayer } from '../../components/common/VideoPlayer';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { articles, products } = useData();
  const { addToCart } = useCart();

  const post = articles.find((a) => a.id === id && a.isPublished);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="surface-warm p-10">
          <h1 className="text-xl font-bold text-text-primary">找不到此文章</h1>
          <Link
            to="/articles"
            className="btn-brand-primary mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            返回毛羽小教室
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products.filter(
    (p) => p.isActive && post.relatedProductIds.includes(p.id)
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link
        to="/articles"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-brand-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        返回毛羽小教室
      </Link>

      <article className="card-warm overflow-hidden">
        <div className="aspect-[16/9] bg-bg-surface">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge-warm">{post.category}</span>
            <span className="text-xs text-text-muted">
              發佈於 {new Date(post.publishedAt).toLocaleDateString('zh-TW')}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold text-text-primary sm:text-3xl">
            {post.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            {post.summary}
          </p>

          {post.videoUrl && post.videoUrl.trim() !== '' && (
            <div className="my-6">
              <VideoPlayer url={post.videoUrl} title={post.title} />
            </div>
          )}

          <div className="mt-6 border-t border-border-soft pt-6">
            <RichTextViewer html={post.contentHtml} />
          </div>
        </div>
      </article>

      {relatedProducts.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-extrabold text-text-primary">
            文章推薦搭配好物
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedProducts.map((product) => (
              <div key={product.id} className="card-warm flex flex-col p-4">
                <Link
                  to={`/products/${product.id}`}
                  className="aspect-[4/3] overflow-hidden rounded-xl bg-bg-surface"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <Link
                  to={`/products/${product.id}`}
                  className="mt-3 line-clamp-2 flex-1 text-sm font-bold text-text-primary hover:text-brand-accent"
                >
                  {product.name}
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-brand-accent">
                    NT$ {product.price.toLocaleString()}
                  </span>
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
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

