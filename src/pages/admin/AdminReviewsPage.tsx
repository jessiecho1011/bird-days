import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, MessageSquare, Star, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminReviewsPage: React.FC = () => {
  const { reviews, products, toggleReviewApproval, deleteReview } = useData();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;

  const filteredReviews = useMemo(() => {
    if (filter === 'pending') return reviews.filter((r) => !r.isApproved);
    if (filter === 'approved') return reviews.filter((r) => r.isApproved);
    return reviews;
  }, [reviews, filter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">
          買家評價審核與顯示管理
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          會員送出的評價會先暫存為「待審核」，由您決定是否核准顯示在對應商品頁面。
        </p>
      </div>

      {/* 狀態篩選按鈕 */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            ['all', `全部評價（${reviews.length}）`],
            ['pending', `待審核／隱藏（${pendingCount}）`],
            ['approved', `已顯示於商品頁（${approvedCount}）`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              filter === key
                ? 'bg-brand-primary text-text-on-primary shadow-sm'
                : 'border border-border-soft bg-bg-card text-text-secondary hover:bg-bg-surface'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filteredReviews.length === 0 ? (
        <div className="surface-warm py-12 text-center">
          <MessageSquare className="mx-auto mb-2 h-8 w-8 text-brand-accent" />
          <p className="text-sm text-text-muted">目前此分類沒有商品評價</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((rev) => {
            const product = products.find((p) => p.id === rev.productId);
            return (
              <div
                key={rev.id}
                className="card-warm flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-start"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-text-primary">{rev.authorName}</span>
                    <span className="badge-warm">{rev.birdType}</span>
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-brand-accent">
                      <Star className="h-3.5 w-3.5 fill-brand-primary text-brand-primary" />
                      {rev.rating}.0
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        rev.isApproved
                          ? 'bg-status-success-bg text-status-success'
                          : 'bg-status-warning-bg text-status-warning'
                      }`}
                    >
                      {rev.isApproved ? '商品頁已顯示' : '待審核（未顯示）'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-text-muted">
                    對應商品：{product?.name || rev.productId}
                    {rev.memberEmail ? ` ｜ 會員：${rev.memberEmail}` : ''}
                  </p>
                  <p className="text-sm text-text-secondary">{rev.comment}</p>
                  <p className="text-[11px] text-text-muted">
                    送出時間：{new Date(rev.createdAt).toLocaleString('zh-TW')}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => toggleReviewApproval(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs ${
                      rev.isApproved ? 'btn-brand-outline' : 'btn-brand-primary'
                    }`}
                  >
                    {rev.isApproved ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        隱藏（不顯示）
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        核准顯示於商品頁
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('確定要永久刪除此則評價嗎？')) {
                        deleteReview(rev.id);
                      }
                    }}
                    className="rounded-xl border border-border-soft p-2 text-status-danger hover:bg-status-danger-bg"
                    title="刪除評價"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
