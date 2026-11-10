import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Edit3, Plus, Trash2, Upload } from 'lucide-react';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import { useData } from '../../context/DataContext';
import type { BlogPost } from '../../types';
import { createMockIllustration, fileToDataUrl } from '../../utils/media';

interface ArticleFormState {
  title: string;
  category: string;
  summary: string;
  coverImage: string;
  videoUrl: string;
  contentHtml: string;
  relatedProductIds: string[];
  isPublished: boolean;
}

const createEmptyArticle = (): ArticleFormState => ({
  title: '',
  category: '照護知識',
  summary: '',
  coverImage: createMockIllustration('hero', '毛羽小教室文章封面'),
  videoUrl: '',
  contentHtml: '<h2>文章小標題</h2><p>請在此撰寫寵物鳥照護文章...</p>',
  relatedProductIds: [],
  isPublished: true,
});

export const AdminArticlesPage: React.FC = () => {
  const { articles, products, addArticle, updateArticle, deleteArticle } = useData();
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<ArticleFormState>(createEmptyArticle);

  const startCreate = () => {
    setForm(createEmptyArticle());
    setEditingId('new');
  };

  const startEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      category: post.category,
      summary: post.summary,
      coverImage: post.coverImage,
      videoUrl: post.videoUrl || '',
      contentHtml: post.contentHtml,
      relatedProductIds: [...post.relatedProductIds],
      isPublished: post.isPublished,
    });
    setEditingId(post.id);
  };

  const toggleRelatedProduct = (productId: string) => {
    setForm((prev) => {
      const exists = prev.relatedProductIds.includes(productId);
      return {
        ...prev,
        relatedProductIds: exists
          ? prev.relatedProductIds.filter((id) => id !== productId)
          : [...prev.relatedProductIds, productId],
      };
    });
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, coverImage: dataUrl }));
    } catch {
      window.alert('圖片讀取失敗');
    } finally {
      e.target.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      category: form.category.trim() || '照護知識',
      summary: form.summary.trim(),
      coverImage:
        form.coverImage.trim() ||
        createMockIllustration('hero', form.title || '毛羽小教室'),
      videoUrl: form.videoUrl.trim() || undefined,
      contentHtml: form.contentHtml,
      relatedProductIds: form.relatedProductIds,
      isPublished: form.isPublished,
    };

    if (editingId === 'new') {
      addArticle(payload);
    } else if (editingId) {
      updateArticle(editingId, payload);
    }
    setEditingId(null);
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
            返回文章列表
          </button>
          <h1 className="text-xl font-extrabold text-text-primary">
            {editingId === 'new' ? '撰寫毛羽小教室文章' : '編輯專欄文章'}
          </h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <section className="card-warm space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  文章標題 *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-warm w-full text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  專欄分類
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="例如：照護知識、空間挑選"
                  className="input-warm w-full text-sm"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) =>
                      setForm({ ...form, isPublished: e.target.checked })
                    }
                    className="h-4 w-4 accent-brand-accent"
                  />
                  公開發佈於前台專欄
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  文章摘要 *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="input-warm w-full text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  封面圖片網址（或本機上傳預覽）
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={form.coverImage}
                    onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                    className="input-warm flex-1 text-sm"
                  />
                  <label className="btn-brand-outline inline-flex cursor-pointer items-center gap-1.5 px-4 py-2 text-xs">
                    <Upload className="h-3.5 w-3.5" />
                    選擇圖片
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadCover}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  文章嵌入介紹影片網址（選填）
                </label>
                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="YouTube / Vimeo / MP4 網址"
                  className="input-warm w-full text-sm"
                />
              </div>
            </div>
          </section>

          <section className="card-warm space-y-3 p-6">
            <h2 className="text-base font-bold text-text-primary">
              文章內文排版（文字樣式編輯器）
            </h2>
            <RichTextEditor
              value={form.contentHtml}
              onChange={(html) => setForm({ ...form, contentHtml: html })}
            />
          </section>

          <section className="card-warm space-y-3 p-6">
            <h2 className="text-base font-bold text-text-primary">
              文末推薦商品導購綁定
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {products.map((p) => (
                <label
                  key={p.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border-soft bg-bg-surface px-3 py-2 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={form.relatedProductIds.includes(p.id)}
                    onChange={() => toggleRelatedProduct(p.id)}
                    className="h-4 w-4 accent-brand-accent"
                  />
                  <span className="truncate font-medium text-text-primary">
                    {p.name}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="btn-brand-outline px-6 py-2.5 text-sm"
            >
              取消
            </button>
            <button type="submit" className="btn-brand-primary px-8 py-2.5 text-sm">
              儲存文章
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
          <h1 className="text-2xl font-extrabold text-text-primary">
            毛羽小教室專欄管理
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            撰寫養鳥照護教學文章並綁定推薦商品，提升品牌專業度與導購轉換
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="btn-brand-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
        >
          <Plus className="h-4 w-4" />
          新增專欄文章
        </button>
      </div>

      <div className="space-y-3">
        {articles.map((post) => (
          <div
            key={post.id}
            className="card-warm flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-4">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-16 w-24 shrink-0 rounded-xl bg-bg-surface object-cover"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-warm">{post.category}</span>
                  <span className="text-xs text-text-muted">
                    {post.isPublished ? '已發佈' : '草稿隱藏'} ｜ 綁定{' '}
                    {post.relatedProductIds.length} 項商品
                  </span>
                </div>
                <h2 className="mt-1 text-base font-bold text-text-primary">
                  {post.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => startEdit(post)}
                className="btn-brand-primary inline-flex items-center gap-1 px-3.5 py-1.5 text-xs"
              >
                <Edit3 className="h-3.5 w-3.5" />
                編輯
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`確定刪除文章「${post.title}」嗎？`)) {
                    deleteArticle(post.id);
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
        {articles.length === 0 && (
          <div className="surface-warm py-12 text-center">
            <BookOpen className="mx-auto mb-2 h-8 w-8 text-brand-accent" />
            <p className="text-sm text-text-muted">尚無專欄文章</p>
          </div>
        )}
      </div>
    </div>
  );
};

