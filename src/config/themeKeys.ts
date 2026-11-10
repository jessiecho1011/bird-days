/**
 * 主題色彩 Key 對照設定檔
 * 所有色碼實際定義於 src/styles/index.css 的 :root 區塊中。
 * 未來定案最終品牌暖黃色調時，請至 src/styles/index.css 修改對應 Key 的色碼。
 */
export interface ThemeColorKeyMeta {
  key: string;
  label: string;
  description: string;
  defaultHex: string;
}

export const THEME_COLOR_KEYS: ThemeColorKeyMeta[] = [
  {
    key: '--key-brand-primary',
    label: '品牌主色（暖黃）',
    description: '主要按鈕、Logo 識別、重點導覽狀態',
    defaultHex: '#F5B731',
  },
  {
    key: '--key-brand-primary-hover',
    label: '品牌主色 Hover',
    description: '主要按鈕滑鼠移入狀態',
    defaultHex: '#E09F1F',
  },
  {
    key: '--key-brand-secondary',
    label: '品牌次要色（奶油黃）',
    description: '分類標籤、柔和裝飾區塊',
    defaultHex: '#FDE68A',
  },
  {
    key: '--key-brand-soft',
    label: '極淺暖黃',
    description: '提示區、列表選中底色',
    defaultHex: '#FEF3C7',
  },
  {
    key: '--key-brand-accent',
    label: '強調色（焦糖暖橘）',
    description: '商品價格、特價標籤、強調文字',
    defaultHex: '#C26D27',
  },
  {
    key: '--key-bg-base',
    label: '全站底色（暖米白）',
    description: '網頁主體背景',
    defaultHex: '#FFFDF5',
  },
  {
    key: '--key-bg-surface',
    label: '區塊表面色（淡蛋黃）',
    description: '側邊欄、品牌介紹、次要區塊底色',
    defaultHex: '#FFF8E1',
  },
  {
    key: '--key-text-primary',
    label: '主要文字色（深焙咖）',
    description: '標題與內文主色',
    defaultHex: '#3E2F1C',
  },
  {
    key: '--key-border-soft',
    label: '柔順邊框色',
    description: '卡片外框與分隔線',
    defaultHex: '#F0DFB8',
  },
];

/**
 * 後台富文本編輯器可選的文字顏色與高亮底色（符合暖色品牌調性）
 */
export const EDITOR_TEXT_COLORS = [
  { label: '深焙咖（預設）', value: '#3E2F1C' },
  { label: '焦糖暖橘', value: '#C26D27' },
  { label: '暖麥金黃', value: '#B9770E' },
  { label: '森林苔綠', value: '#4D7C43' },
  { label: '磚紅重點', value: '#B84A39' },
  { label: '柔灰咖', value: '#7A6548' },
];

export const EDITOR_HIGHLIGHT_COLORS = [
  { label: '奶油暖黃', value: '#FDE68A' },
  { label: '淡杏桃', value: '#FED7AA' },
  { label: '嫩芽淺綠', value: '#DCFCE7' },
  { label: '柔粉米', value: '#FFE4E6' },
];

