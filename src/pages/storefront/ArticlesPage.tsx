import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ArticlesPage: React.FC = () => {
  const { articles } = useData();
  const published = articles.filter((a) => a.isPublished);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="text-xs font-bold tracking-wider text-brand-accent">
          FEATHER JOURNAL
        </span>
        <h1 className="mt-1 text-3xl font-extrabold text-text-primary">
          毛羽小教室專欄
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          分享寵物鳥日常照護、換羽期飲食與居家空間佈置知識
        </p>
      </div>

      {published.length === 0 ? (
        <div className="surface-warm py-14 text-center">
          <BookOpen className="mx-auto mb-2 h-8 w-8 text-brand-accent" />
          <p className="text-base font-semibold text-text-primary">
            目前尚無已發佈文章
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {published.map((post) => (
            <article
              key={post.id}
              className="card-warm flex flex-col overflow-hidden transition-transform hover:-translate-y-0.5"
            >
              <Link
                to={`/articles/${post.id}`}
                className="block aspect-[16/9] overflow-hidden bg-bg-surface"
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="badge-warm">{post.category}</span>
                  <span className="text-xs text-text-muted">
                    {new Date(post.publishedAt).toLocaleDateString('zh-TW')}
                  </span>
                </div>
                <Link
                  to={`/articles/${post.id}`}
                  className="mt-3 text-xl font-bold text-text-primary hover:text-brand-accent"
                >
                  {post.title}
                </Link>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                  {post.summary}
                </p>
                <Link
                  to={`/articles/${post.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent hover:underline"
                >
                  閱讀全文
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

