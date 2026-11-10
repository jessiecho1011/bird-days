export type ParsedVideo =
  | { type: 'iframe'; embedUrl: string }
  | { type: 'video'; src: string }
  | { type: 'invalid' };

/**
 * 解析後台貼入的介紹影片網址，支援 YouTube、Vimeo 與直連影片檔案
 */
export function parseVideoUrl(rawUrl?: string): ParsedVideo {
  const url = rawUrl?.trim();
  if (!url) return { type: 'invalid' };

  // YouTube 標準連結、youtu.be 短連結、shorts、embed
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  if (ytMatch?.[1]) {
    return {
      type: 'iframe',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch?.[1]) {
    return {
      type: 'iframe',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // 直接影片檔案或 DataURL
  if (
    /^https?:\/\/.+\.(mp4|webm|ogg)(\?.*)?$/i.test(url) ||
    url.startsWith('data:video/')
  ) {
    return { type: 'video', src: url };
  }

  // 若為有效 http(s) 網址，也允許嘗試以 video 標籤或嵌入處理
  if (/^https?:\/\//i.test(url)) {
    return { type: 'video', src: url };
  }

  return { type: 'invalid' };
}

/**
 * 將本機選取的圖片轉成 Base64 DataURL（開發階段暫存於瀏覽器，未來改為上傳至 GCP Cloud Storage）
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('圖片讀取失敗'));
      }
    };
    reader.onerror = () => reject(new Error('圖片讀取發生錯誤'));
    reader.readAsDataURL(file);
  });
}

export type IllustrationTheme =
  | 'feed'
  | 'toy'
  | 'perch'
  | 'carrier'
  | 'bath'
  | 'hero';

/**
 * 產生本專案原創 SVG DataURL（100% 免費商用，無版權爭議）
 */
export function createMockIllustration(
  theme: IllustrationTheme,
  title: string,
  subtitle?: string
): string {
  const palette: Record<IllustrationTheme, { bg: string; accent: string; badge: string }> = {
    feed: { bg: '#FFF6D6', accent: '#F5B731', badge: '#C26D27' },
    toy: { bg: '#FEF0C7', accent: '#E09F1F', badge: '#4D7C43' },
    perch: { bg: '#FFF8E1', accent: '#D99B26', badge: '#8E5B2A' },
    carrier: { bg: '#FDF2D6', accent: '#F5B731', badge: '#C26D27' },
    bath: { bg: '#FFFDF0', accent: '#F3C14B', badge: '#6B573C' },
    hero: { bg: '#FFF4CC', accent: '#F5B731', badge: '#C26D27' },
  };
  const { bg, accent, badge } = palette[theme];

  const iconSvg: Record<IllustrationTheme, string> = {
    feed: `
      <ellipse cx="300" cy="270" rx="115" ry="32" fill="#E6C98F"/>
      <path d="M195 255c0 45 45 78 105 78s105-33 105-78H195Z" fill="${badge}"/>
      <ellipse cx="300" cy="255" rx="105" ry="26" fill="${accent}"/>
      <circle cx="265" cy="248" r="10" fill="#FFFDF5"/>
      <circle cx="295" cy="254" r="12" fill="#FDE68A"/>
      <circle cx="328" cy="246" r="9" fill="#FFFDF5"/>
      <circle cx="308" cy="236" r="8" fill="#4D7C43"/>
      <path d="M365 182c0-28-24-50-54-50-29 0-52 22-52 50 0 24 14 54 52 64 28-8 54-32 54-64Z" fill="#FFFDF5" stroke="#3E2F1C" stroke-width="4"/>
      <path d="M361 174l24 9-20 12-4-21Z" fill="${badge}"/>
      <circle cx="338" cy="170" r="5" fill="#3E2F1C"/>
    `,
    toy: `
      <line x1="300" y1="70" x2="300" y2="120" stroke="#8E5B2A" stroke-width="6" stroke-linecap="round"/>
      <circle cx="300" cy="145" r="28" fill="${accent}" stroke="#3E2F1C" stroke-width="4"/>
      <rect x="262" y="182" width="76" height="44" rx="14" fill="${badge}" stroke="#3E2F1C" stroke-width="4"/>
      <circle cx="300" cy="258" r="30" fill="#FDE68A" stroke="#3E2F1C" stroke-width="4"/>
      <path d="M270 302l30 42 30-42H270Z" fill="#4D7C43" stroke="#3E2F1C" stroke-width="4"/>
      <circle cx="220" cy="175" r="14" fill="${accent}" opacity="0.5"/>
      <circle cx="385" cy="245" r="18" fill="${badge}" opacity="0.25"/>
    `,
    perch: `
      <path d="M125 255c85-16 250-24 350 8" stroke="#8E5B2A" stroke-width="24" stroke-linecap="round"/>
      <path d="M210 244l-24-45" stroke="#8E5B2A" stroke-width="14" stroke-linecap="round"/>
      <ellipse cx="180" cy="190" rx="22" ry="11" transform="rotate(-25 180 190)" fill="#4D7C43"/>
      <path d="M350 165c0-32-25-56-56-56-30 0-54 24-54 56 0 28 16 64 54 76 32-10 56-40 56-76Z" fill="${accent}" stroke="#3E2F1C" stroke-width="4"/>
      <path d="M346 156l26 9-22 13-4-22Z" fill="${badge}"/>
      <circle cx="322" cy="150" r="5" fill="#3E2F1C"/>
      <path d="M278 238v16M304 238v16" stroke="#3E2F1C" stroke-width="5" stroke-linecap="round"/>
    `,
    carrier: `
      <rect x="195" y="125" width="210" height="210" rx="34" fill="${accent}" stroke="#3E2F1C" stroke-width="5"/>
      <path d="M255 125V98c0-14 14-24 45-24s45 10 45 24v27" fill="none" stroke="#3E2F1C" stroke-width="8" stroke-linecap="round"/>
      <circle cx="300" cy="215" r="58" fill="#FFFDF5" stroke="#3E2F1C" stroke-width="5"/>
      <path d="M326 210c0-17-12-30-28-30s-28 13-28 30c0 15 8 33 28 39 17-5 28-20 28-39Z" fill="${badge}"/>
      <circle cx="308" cy="202" r="3.5" fill="#FFFDF5"/>
      <rect x="235" y="292" width="130" height="16" rx="8" fill="#FFFDF5" opacity="0.8"/>
    `,
    bath: `
      <path d="M180 245h240l-28 75H208l-28-75Z" fill="#FFFDF5" stroke="#3E2F1C" stroke-width="5" stroke-linejoin="round"/>
      <rect x="168" y="232" width="264" height="22" rx="11" fill="${accent}" stroke="#3E2F1C" stroke-width="4"/>
      <circle cx="245" cy="178" r="14" fill="#FDE68A" stroke="#3E2F1C" stroke-width="3"/>
      <circle cx="300" cy="152" r="20" fill="#FFFDF5" stroke="#3E2F1C" stroke-width="3"/>
      <circle cx="352" cy="184" r="12" fill="#FDE68A" stroke="#3E2F1C" stroke-width="3"/>
      <path d="M265 208c18-12 52-12 70 0" fill="none" stroke="${badge}" stroke-width="5" stroke-linecap="round"/>
    `,
    hero: `
      <circle cx="440" cy="120" r="65" fill="#FDE68A"/>
      <path d="M120 315c110-25 265-28 375 10" stroke="#8E5B2A" stroke-width="18" stroke-linecap="round"/>
      <path d="M295 190c0-42-34-74-76-74s-76 32-76 74c0 38 22 86 76 102 44-14 76-54 76-102Z" fill="${accent}" stroke="#3E2F1C" stroke-width="5"/>
      <path d="M290 176l34 12-28 18-6-30Z" fill="${badge}"/>
      <circle cx="258" cy="168" r="6" fill="#3E2F1C"/>
      <path d="M405 212c0-32-26-56-58-56s-58 24-58 56c0 28 16 64 58 76 34-10 58-40 58-76Z" fill="#FFFDF5" stroke="#3E2F1C" stroke-width="5"/>
      <path d="M351 200l-28 10 24 15 4-25Z" fill="${badge}"/>
      <circle cx="366" cy="196" r="5" fill="#3E2F1C"/>
    `,
  };

  const safeTitle = title.replace(/[<>&"]/g, '');
  const safeSub = (subtitle ?? '好個鳥日子 Bird Days 原創選物').replace(/[<>&"]/g, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="440" viewBox="0 0 600 440">
    <rect width="600" height="440" rx="28" fill="${bg}"/>
    <circle cx="95" cy="85" r="42" fill="${accent}" opacity="0.22"/>
    <circle cx="515" cy="365" r="56" fill="${badge}" opacity="0.12"/>
    ${iconSvg[theme]}
    <text x="300" y="382" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="700" fill="#3E2F1C">${safeTitle}</text>
    <text x="300" y="410" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#7A6548">${safeSub}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

