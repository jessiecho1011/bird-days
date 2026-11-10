import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Copy, Download, Palette, RefreshCw } from 'lucide-react';
import { THEME_COLOR_KEYS } from '../../config/themeKeys';
import { useData } from '../../context/DataContext';
import { dataService } from '../../services/storageService';

export const AdminSettingsPage: React.FC = () => {
  const { orders, resetMockData } = useData();
  const [previewColors, setPreviewColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const item of THEME_COLOR_KEYS) {
      initial[item.key] = item.defaultHex;
    }
    return initial;
  });
  const [copiedCss, setCopiedCss] = useState(false);

  const handlePreviewColorChange = (cssKey: string, hex: string) => {
    document.documentElement.style.setProperty(cssKey, hex);
    setPreviewColors((prev) => ({ ...prev, [cssKey]: hex }));
  };

  const handleResetThemePreview = () => {
    const restored: Record<string, string> = {};
    for (const item of THEME_COLOR_KEYS) {
      document.documentElement.style.removeProperty(item.key);
      restored[item.key] = item.defaultHex;
    }
    setPreviewColors(restored);
  };

  const handleCopyCssVars = async () => {
    const cssText = THEME_COLOR_KEYS.map(
      (item) => `  ${item.key}: ${previewColors[item.key]}; /* ${item.label} */`
    ).join('\n');
    try {
      await navigator.clipboard.writeText(cssText);
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2500);
    } catch {
      window.alert('複製失敗，請手動選取或於 src/styles/index.css 修改。');
    }
  };

  const handleExportJson = () => {
    const jsonStr = dataService.exportAllAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bird-days-mock-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetMock = () => {
    if (
      window.confirm(
        '確定要清除瀏覽器內的修改，並還原成預設的 Mock 商品、店家與文案嗎？'
      )
    ) {
      resetMockData();
      window.alert('已還原為預設 Mock 資料！');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">
          色彩 Key 預覽與資料備份
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          全站顏色皆綁定於 <code className="rounded bg-bg-surface px-1.5 py-0.5 font-semibold">src/styles/index.css</code> 的 Key 變數，沒有使用 Tailwind 內建色票。
        </p>
      </div>

      {/* 色彩 Key 即時預覽調色盤 */}
      <section className="card-warm p-6">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-brand-accent" />
            <h2 className="text-base font-bold text-text-primary">
              品牌暖黃色調 Keys（即時預覽試色）
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleResetThemePreview}
              className="btn-brand-outline inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              恢復預設試色
            </button>
            <button
              type="button"
              onClick={handleCopyCssVars}
              className="btn-brand-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedCss ? '已複製 CSS Key！' : '複製 CSS Key 設定'}
            </button>
          </div>
        </div>

        <p className="mb-4 text-xs text-text-muted">
          您可以在這裡直接試調顏色看全站效果，確定色碼後複製貼回 <code>src/styles/index.css</code> 的 <code>:root</code> 即可永久生效。
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {THEME_COLOR_KEYS.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-3 rounded-xl border border-border-soft bg-bg-surface p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-text-primary">
                  {item.label}
                </p>
                <p className="truncate font-mono text-[11px] text-brand-accent">
                  {item.key}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-text-muted">
                  {item.description}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-1">
                <input
                  type="color"
                  value={previewColors[item.key]}
                  onChange={(e) => handlePreviewColorChange(item.key, e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded-lg border border-border-soft bg-bg-card p-0.5"
                />
                <span className="font-mono text-[10px] text-text-secondary">
                  {previewColors[item.key]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mock 資料匯出與重置 */}
      <section className="card-warm p-6">
        <h2 className="text-base font-bold text-text-primary">
          Mock 資料庫管理（預留未來移轉 GCP）
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          目前商品、店家與品牌故事皆暫存於瀏覽器 localStorage；未來串接 GCP Firestore / Cloud SQL 時，可先匯出 JSON 備份。
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            className="btn-brand-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
          >
            <Download className="h-4 w-4" />
            匯出目前所有 Mock 資料 (JSON)
          </button>
          <button
            type="button"
            onClick={handleResetMock}
            className="btn-brand-outline inline-flex items-center gap-2 px-4 py-2 text-sm text-status-danger"
          >
            <RefreshCw className="h-4 w-4" />
            還原初始預設資料
          </button>
        </div>
      </section>

      {/* 訂單管理快速入口 */}
      <section className="card-warm flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-brand-accent" />
          <div>
            <h2 className="text-base font-bold text-text-primary">
              目前共有 {orders.length} 筆訂單紀錄
            </h2>
            <p className="text-xs text-text-secondary">
              可前往「訂單管理」頁面切換訂單處理狀態、編輯物流單號與管理訂單。
            </p>
          </div>
        </div>
        <Link to="/admin/orders" className="btn-brand-primary px-4 py-2 text-sm">
          前往訂單管理
        </Link>
      </section>
    </div>
  );
};

