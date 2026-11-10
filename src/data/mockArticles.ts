import type { BlogPost } from '../types';
import { createMockIllustration } from '../utils/media';

/**
 * 預設「毛羽小教室」專欄文章 Mock 資料
 */
export const INITIAL_MOCK_ARTICLES: BlogPost[] = [
  {
    id: 'post-1',
    title: '換羽期總是毛毛躁躁？給鸚鵡寶貝的 3 個飲食與舒緩建議',
    category: '照護知識',
    summary: '換羽期間鳥寶需要大量蛋白質與微涼澡浴舒緩皮膚發癢，一起了解如何從日常主食與沐浴著手！',
    coverImage: createMockIllustration('bath', '換羽期照護指南', '好個鳥日子・毛羽小教室'),
    videoUrl: '',
    contentHtml: `
      <h2>換羽期為什麼特別需要照顧？</h2>
      <p>每逢季節交替，鳥寶會開始大量掉羽並長出新羽管。這時候除了體力消耗大，羽管頂端發癢也常讓鳥寶變得比較敏感或愛撒嬌。</p>
      <ul>
        <li><span style="color: #C26D27"><strong>補充優質穀物與 Omega-3</strong></span>：可提高天然帶殼穀物與亞麻仁籽比例，幫助新羽毛光滑亮麗。</li>
        <li><strong>增加溫和噴霧浴次數</strong>：使用低噪音微霧花灑或溫水盆，軟化羽鞘讓理羽更輕鬆。</li>
        <li><strong>提供安全啃咬玩具</strong>：轉移煩躁情緒，避免過度咬傷新羽管。</li>
      </ul>
      <blockquote>小叮嚀：若發現鳥寶食慾明顯下降或精神萎靡超過兩天，請務必及早就醫諮詢專業鳥禽獸醫師喔！</blockquote>
    `,
    relatedProductIds: ['prod-1', 'prod-5', 'prod-2'],
    isPublished: true,
    publishedAt: '2026-11-05T10:00:00.000Z',
  },
  {
    id: 'post-2',
    title: '為什麼天然分岔棲木比塑膠圓棍更好？鳥腳健康小學堂',
    category: '空間挑選',
    summary: '長期站在單一粗細的塑膠棲木上容易導致足底壓力集中。挑選有粗細變化的花椒木或蘋果木，能讓毛羽雙腳自然伸展。',
    coverImage: createMockIllustration('perch', '天然棲木挑選秘訣', '守護鳥寶足部關節健康'),
    videoUrl: '',
    contentHtml: `
      <h2>鳥寶一天有超過 20 小時都在站立</h2>
      <p>棲木就像是鳥寶的床墊與鞋子！如果籠內全是平滑、粗細一致的塑膠圓棍，腳掌肌肉會永遠停在同一個抓握角度。</p>
      <p>建議籠內至少配置 <strong>2～3 種不同材質與粗細</strong> 的天然原木棲木：</p>
      <ul>
        <li><strong>主要休息區</strong>：選擇樹皮溫潤、微彎曲的花椒木，讓腳趾能包覆約 2/3 圓周。</li>
        <li><strong>門邊互動區</strong>：可搭配較細的蘋果木枝，增加腳趾抓握變換的機會。</li>
      </ul>
    `,
    relatedProductIds: ['prod-3', 'prod-4'],
    isPublished: true,
    publishedAt: '2026-11-01T14:30:00.000Z',
  },
];

