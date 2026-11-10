import React, { useState } from 'react';
import { Check, Upload } from 'lucide-react';
import { VideoPlayer } from '../../components/common/VideoPlayer';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import { useData } from '../../context/DataContext';
import type { SiteContent } from '../../types';
import { fileToDataUrl } from '../../utils/media';

export const AdminContentPage: React.FC = () => {
  const { siteContent, updateSiteContent } = useData();
  const [form, setForm] = useState<SiteContent>(siteContent);
  const [activePolicyTab, setActivePolicyTab] = useState<
    'shoppingGuideHtml' | 'returnPolicyHtml' | 'privacyPolicyHtml'
  >('shoppingGuideHtml');
  const [savedToast, setSavedToast] = useState(false);

  const handleUploadHeroImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, heroImageUrl: dataUrl }));
    } catch {
      window.alert('圖片讀取失敗');
    } finally {
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateSiteContent(form);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : '儲存失敗');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">
          品牌文案與樣式編輯
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          修改首頁橫幅圖片、介紹影片與品牌故事文字樣式，儲存後即時同步前台。
        </p>
      </div>

      {savedToast && (
        <div className="flex items-center gap-2 rounded-xl bg-status-success-bg px-4 py-3 text-sm font-medium text-status-success">
          <Check className="h-4 w-4" />
          已成功儲存品牌文案設定！
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="card-warm space-y-4 p-6">
          <h2 className="text-base font-bold text-text-primary">頂部公告與首頁主視覺</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                品牌名稱
              </label>
              <input
                type="text"
                required
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                className="input-warm w-full text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                品牌標語（Slogan）
              </label>
              <input
                type="text"
                required
                value={form.brandSlogan}
                onChange={(e) => setForm({ ...form, brandSlogan: e.target.value })}
                className="input-warm w-full text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                頂部公告條文字（留空則隱藏）
              </label>
              <input
                type="text"
                value={form.announcementText}
                onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
                className="input-warm w-full text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                首頁 Hero 主標題
              </label>
              <input
                type="text"
                required
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                className="input-warm w-full text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                首頁 Hero 副標題說明
              </label>
              <textarea
                rows={2}
                required
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                className="input-warm w-full text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                首頁形象圖片網址（或本機上傳預覽）
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={form.heroImageUrl}
                  onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })}
                  className="input-warm flex-1 text-sm"
                />
                <label className="btn-brand-outline inline-flex cursor-pointer items-center gap-1.5 px-4 py-2 text-xs">
                  <Upload className="h-3.5 w-3.5" />
                  選擇圖片
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadHeroImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-text-secondary">
                首頁形象影片網址（選填，若填入則首頁 Hero 右側改為播放影片）
              </label>
              <input
                type="url"
                value={form.heroVideoUrl || ''}
                onChange={(e) => setForm({ ...form, heroVideoUrl: e.target.value })}
                placeholder="貼上 YouTube / Vimeo / MP4 網址"
                className="input-warm w-full text-sm"
              />
              {form.heroVideoUrl && form.heroVideoUrl.trim() !== '' && (
                <div className="mt-3 max-w-lg">
                  <VideoPlayer url={form.heroVideoUrl} title="首頁影片預覽" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 品牌故事文字編輯器 */}
        <section className="card-warm space-y-4 p-6">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              首頁品牌故事（富文本樣式編輯器）
            </h2>
            <p className="mt-0.5 text-xs text-text-muted">
              可編輯標題與內文的字級、文字色彩、底色標記與排版樣式
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-text-secondary">
              故事區塊標題
            </label>
            <input
              type="text"
              required
              value={form.storyTitle}
              onChange={(e) => setForm({ ...form, storyTitle: e.target.value })}
              className="input-warm w-full text-sm"
            />
          </div>

          <RichTextEditor
            value={form.storyHtml}
            onChange={(html) => setForm({ ...form, storyHtml: html })}
          />
        </section>

        {/* 法規與購物須知頁面編輯 */}
        <section className="card-warm space-y-4 p-6">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              購物須知、退換貨政策與隱私權條款（富文本編輯器）
            </h2>
            <p className="mt-0.5 text-xs text-text-muted">
              點擊下方頁籤切換編輯不同政策頁面內容，儲存後前台法規頁將同步更新。
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ['shoppingGuideHtml', '購物與配送須知'],
                ['returnPolicyHtml', '退換貨與保固政策'],
                ['privacyPolicyHtml', '隱私權保護條款'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActivePolicyTab(key)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  activePolicyTab === key
                    ? 'bg-brand-primary text-text-on-primary shadow-sm'
                    : 'border border-border-soft bg-bg-surface text-text-secondary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <RichTextEditor
            value={form[activePolicyTab]}
            onChange={(html) => setForm({ ...form, [activePolicyTab]: html })}
          />
        </section>

        <div className="flex justify-end">
          <button type="submit" className="btn-brand-primary px-8 py-3 text-sm">
            儲存所有品牌文案
          </button>
        </div>
      </form>
    </div>
  );
};

