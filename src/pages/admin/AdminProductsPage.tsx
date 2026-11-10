import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  Eye,
  EyeOff,
  Film,
  ImagePlus,
  Plus,
  Star,
  Trash2,
  Upload,
} from 'lucide-react';
import { VideoPlayer } from '../../components/common/VideoPlayer';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import { useData } from '../../context/DataContext';
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
  type ProductVariant,
} from '../../types';
import { createMockIllustration, fileToDataUrl } from '../../utils/media';

interface ProductFormState {
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  originalPrice: string;
  stock: number;
  variants: ProductVariant[];
  isActive: boolean;
  isFeatured: boolean;
  suitableBirdsText: string;
  images: string[];
  videoUrl: string;
  descriptionHtml: string;
}

const createEmptyForm = (): ProductFormState => ({
  name: '',
  subtitle: '',
  category: '天然飼料與零食',
  price: 380,
  originalPrice: '',
  stock: 20,
  variants: [],
  isActive: true,
  isFeatured: false,
  suitableBirdsText: '虎皮, 玄鳳, 小太陽',
  images: [
    createMockIllustration('feed', '新上架寵物鳥好物', '可於下方新增或替換商品實拍圖'),
  ],
  videoUrl: '',
  descriptionHtml: '<h2>商品特色介紹</h2><p>請在此輸入商品描述，上方工具列可調整標題、字體大小、顏色與對齊樣式。</p>',
});

export const AdminProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<ProductFormState>(createEmptyForm);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [feedback, setFeedback] = useState('');

  const startCreate = () => {
    setForm(createEmptyForm());
    setEditingId('new');
    setFeedback('');
  };

  const startEdit = (product: Product) => {
    setForm({
      name: product.name,
      subtitle: product.subtitle,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      stock: product.stock,
      variants: product.variants ? product.variants.map((v) => ({ ...v })) : [],
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      suitableBirdsText: product.suitableBirds.join(', '),
      images: product.images.length > 0 ? [...product.images] : [],
      videoUrl: product.videoUrl || '',
      descriptionHtml: product.descriptionHtml,
    });
    setEditingId(product.id);
    setFeedback('');
  };

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, trimmed] }));
    setNewImageUrl('');
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, images: [...prev.images, dataUrl] }));
    } catch {
      window.alert('圖片轉換失敗，請確認檔案格式或大小。');
    } finally {
      e.target.value = '';
    }
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    setForm((prev) => {
      const next = [...prev.images];
      const [picked] = next.splice(index, 1);
      return { ...prev, images: [picked, ...next] };
    });
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const birds = form.suitableBirdsText
      .split(/[,，、]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const imagesToSave =
      form.images.length > 0
        ? form.images
        : [createMockIllustration('feed', form.name || '好個鳥日子商品')];

    const validVariants = form.variants
      .filter((v) => v.label.trim() !== '')
      .map((v) => ({
        ...v,
        label: v.label.trim(),
        price: Number(v.price) || 0,
        originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined,
        stock: Math.max(0, Number(v.stock) || 0),
      }));

    const computedPrice =
      validVariants.length > 0
        ? Math.min(...validVariants.map((v) => v.price))
        : Number(form.price) || 0;
    const computedStock =
      validVariants.length > 0
        ? validVariants.reduce((sum, v) => sum + v.stock, 0)
        : Number(form.stock) || 0;

    const payload = {
      name: form.name.trim(),
      subtitle: form.subtitle.trim(),
      category: form.category,
      price: computedPrice,
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      stock: computedStock,
      variants: validVariants.length > 0 ? validVariants : undefined,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      suitableBirds: birds.length > 0 ? birds : ['全鳥種適用'],
      images: imagesToSave,
      videoUrl: form.videoUrl.trim() || undefined,
      descriptionHtml: form.descriptionHtml,
    };

    try {
      if (editingId === 'new') {
        addProduct(payload);
        setFeedback('已新增商品並同步至前台目錄！');
      } else if (editingId) {
        updateProduct(editingId, payload);
        setFeedback('已儲存商品變更！');
      }
      setEditingId(null);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : '儲存失敗');
    }
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`確定要刪除商品「${product.name}」嗎？此動作無法復原。`)) {
      deleteProduct(product.id);
      setFeedback(`已刪除商品「${product.name}」`);
    }
  };

  // --- 表單編輯畫面 ---
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
            返回商品列表
          </button>
          <h1 className="text-xl font-extrabold text-text-primary">
            {editingId === 'new' ? '新增寵物鳥商品' : '編輯商品資料'}
          </h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* 基本資訊 */}
          <section className="card-warm space-y-4 p-6">
            <h2 className="text-base font-bold text-text-primary">1. 基本資訊與價格</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  商品名稱 *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="例如：天然蘋果木啃咬吊橋"
                  className="input-warm w-full text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  商品副標題 / 一句話亮點 *
                </label>
                <input
                  type="text"
                  required
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="簡短介紹商品特色"
                  className="input-warm w-full text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  商品分類 *
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as ProductCategory })
                  }
                  className="input-warm w-full text-sm"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  適用鳥種（以逗號分隔）
                </label>
                <input
                  type="text"
                  value={form.suitableBirdsText}
                  onChange={(e) =>
                    setForm({ ...form, suitableBirdsText: e.target.value })
                  }
                  placeholder="虎皮, 玄鳳, 小太陽, 和尚"
                  className="input-warm w-full text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  販售價格 (NT$) *
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="input-warm w-full text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  原價 (NT$，選填，高於售價會顯示優惠)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                  placeholder="選填"
                  className="input-warm w-full text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-secondary">
                  庫存數量
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  className="input-warm w-full text-sm"
                />
              </div>

              <div className="flex items-center gap-6 pt-5">
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="h-4 w-4 accent-brand-accent"
                  />
                  前台顯示上架
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="h-4 w-4 accent-brand-accent"
                  />
                  首頁精選推薦
                </label>
              </div>
            </div>
          </section>

          {/* 多規格管理（選填） */}
          <section className="card-warm space-y-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  商品多規格設定（選填，例如不同重量／尺寸）
                </h2>
                <p className="mt-0.5 text-xs text-text-muted">
                  若新增多規格，商品頁將可切換規格，總庫存與起售價也會自動以規格計算。
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    variants: [
                      ...prev.variants,
                      {
                        id: `var-${Date.now()}-${prev.variants.length}`,
                        label: '',
                        price: prev.price,
                        stock: 10,
                      },
                    ],
                  }))
                }
                className="btn-brand-outline inline-flex items-center gap-1 px-3 py-1.5 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                新增規格
              </button>
            </div>

            {form.variants.length > 0 && (
              <div className="space-y-2.5">
                {form.variants.map((variant, vIdx) => (
                  <div
                    key={variant.id}
                    className="grid gap-2 rounded-xl border border-border-soft bg-bg-surface p-3 sm:grid-cols-12 sm:items-center"
                  >
                    <div className="sm:col-span-5">
                      <label className="mb-1 block text-[11px] font-semibold text-text-muted sm:hidden">
                        規格名稱
                      </label>
                      <input
                        type="text"
                        value={variant.label}
                        onChange={(e) => {
                          const next = [...form.variants];
                          next[vIdx] = { ...variant, label: e.target.value };
                          setForm({ ...form, variants: next });
                        }}
                        placeholder="規格名稱（例：500g / M 號）"
                        className="input-warm w-full text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="mb-1 block text-[11px] font-semibold text-text-muted sm:hidden">
                        售價 (NT$)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={variant.price}
                        onChange={(e) => {
                          const next = [...form.variants];
                          next[vIdx] = { ...variant, price: Number(e.target.value) };
                          setForm({ ...form, variants: next });
                        }}
                        placeholder="售價 NT$"
                        className="input-warm w-full text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="mb-1 block text-[11px] font-semibold text-text-muted sm:hidden">
                        庫存數量
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={variant.stock}
                        onChange={(e) => {
                          const next = [...form.variants];
                          next[vIdx] = { ...variant, stock: Number(e.target.value) };
                          setForm({ ...form, variants: next });
                        }}
                        placeholder="庫存"
                        className="input-warm w-full text-xs"
                      />
                    </div>
                    <div className="flex justify-end sm:col-span-1">
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            variants: form.variants.filter((_, idx) => idx !== vIdx),
                          })
                        }
                        className="rounded-lg p-1.5 text-status-danger hover:bg-status-danger-bg"
                        title="移除此規格"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 圖片管理 */}
          <section className="card-warm space-y-4 p-6">
            <h2 className="text-base font-bold text-text-primary">
              2. 商品圖片管理（第一張為主圖）
            </h2>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="貼上圖片網址（https://...）"
                className="input-warm w-full text-sm sm:flex-1"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="btn-brand-outline inline-flex items-center gap-1.5 px-4 py-2 text-sm"
              >
                <ImagePlus className="h-4 w-4" />
                加入網址圖片
              </button>
              <label className="btn-brand-primary inline-flex cursor-pointer items-center gap-1.5 px-4 py-2 text-sm">
                <Upload className="h-4 w-4" />
                本機選圖預覽
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="hidden"
                />
              </label>
            </div>

            {form.images.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
                {form.images.map((imgUrl, idx) => (
                  <div
                    key={`${imgUrl.slice(0, 20)}-${idx}`}
                    className="overflow-hidden rounded-xl border border-border-soft bg-bg-surface"
                  >
                    <div className="relative aspect-[4/3]">
                      <img
                        src={imgUrl}
                        alt={`預覽 ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-brand-primary px-2 py-0.5 text-[11px] font-bold text-text-on-primary">
                          主圖
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between px-2.5 py-2 text-xs">
                      {idx !== 0 ? (
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(idx)}
                          className="font-semibold text-brand-accent hover:underline"
                        >
                          設為主圖
                        </button>
                      ) : (
                        <span className="text-text-muted">封面圖片</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="text-status-danger hover:underline"
                      >
                        移除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 介紹影片管理 */}
          <section className="card-warm space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-brand-accent" />
              <h2 className="text-base font-bold text-text-primary">
                3. 介紹影片連結（選填）
              </h2>
            </div>

            <input
              type="url"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="貼上 YouTube、Vimeo 或 MP4 影片網址（例：https://www.youtube.com/watch?v=...）"
              className="input-warm w-full text-sm"
            />

            {form.videoUrl.trim() !== '' && (
              <div className="max-w-xl">
                <p className="mb-2 text-xs font-medium text-text-muted">即時影片預覽：</p>
                <VideoPlayer url={form.videoUrl} title={form.name || '影片預覽'} />
              </div>
            )}
          </section>

          {/* 富文本文字樣式編輯器 */}
          <section className="card-warm space-y-3 p-6">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                4. 商品詳細介紹（文字樣式編輯器）
              </h2>
              <p className="mt-0.5 text-xs text-text-muted">
                可自由調整標題層級、字體大小、文字顏色、重點底色、對齊方式、清單與插入文章圖片。
              </p>
            </div>
            <RichTextEditor
              value={form.descriptionHtml}
              onChange={(html) => setForm({ ...form, descriptionHtml: html })}
            />
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
              儲存商品
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- 商品列表畫面 ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">商品管理</h1>
          <p className="mt-1 text-sm text-text-secondary">
            新增、編輯或下架寵物鳥商品，支援多圖、介紹影片與文字樣式排版
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="btn-brand-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
        >
          <Plus className="h-4 w-4" />
          新增商品
        </button>
      </div>

      {feedback && (
        <div className="rounded-xl bg-status-success-bg px-4 py-3 text-sm font-medium text-status-success">
          {feedback}
        </div>
      )}

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="card-warm flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-4">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-16 w-20 shrink-0 rounded-xl border border-border-soft bg-bg-surface object-cover"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-warm">{product.category}</span>
                  {product.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand-accent">
                      <Star className="h-3 w-3" />
                      首頁精選
                    </span>
                  )}
                  {!product.isActive && (
                    <span className="rounded-full bg-status-danger-bg px-2 py-0.5 text-[11px] font-semibold text-status-danger">
                      已下架
                    </span>
                  )}
                </div>
                <h2 className="mt-1 text-base font-bold text-text-primary">
                  {product.name}
                </h2>
                <p className="mt-0.5 text-xs text-text-secondary">
                  NT$ {product.price.toLocaleString()} ｜ 庫存 {product.stock}
                  {product.videoUrl ? ' ｜ 含影片' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => updateProduct(product.id, { isActive: !product.isActive })}
                className="btn-brand-outline inline-flex items-center gap-1 px-3 py-1.5 text-xs"
                title={product.isActive ? '切換為下架' : '切換為上架'}
              >
                {product.isActive ? (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    已上架
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    已下架
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => startEdit(product)}
                className="btn-brand-primary inline-flex items-center gap-1 px-3.5 py-1.5 text-xs"
              >
                <Edit3 className="h-3.5 w-3.5" />
                編輯
              </button>
              <button
                type="button"
                onClick={() => handleDelete(product)}
                className="rounded-xl border border-border-soft p-2 text-status-danger hover:bg-status-danger-bg"
                title="刪除商品"
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

