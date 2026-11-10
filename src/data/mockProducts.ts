import type { Product } from '../types';
import { createMockIllustration } from '../utils/media';

/**
 * 預設 Mock 商品資料（寵物鳥相關用品）
 * 注意：預設商品圖片採用本專案原創 SVG（100% 免費商用，無版權爭議），
 * 您可隨時透過後台 /admin 貼入實拍商品照網址或本機圖片，並嵌入介紹影片。
 * 未來串接 GCP Firestore / Cloud SQL 時，可將此檔案替換為 API 回傳資料。
 */
export const INITIAL_MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: '日光黃金穀物滋養餐（中小型鸚鵡配方）',
    subtitle: '嚴選無農藥小米、燕麥與冷凍乾燥蔬果，營養均衡不挑食',
    category: '天然飼料與零食',
    price: 420,
    originalPrice: 490,
    stock: 36,
    variants: [
      { id: 'v1-500', label: '500g 體驗夾鏈袋', price: 420, originalPrice: 490, stock: 24 },
      { id: 'v1-1000', label: '1kg 家庭號超值包', price: 760, originalPrice: 880, stock: 12 },
    ],
    isActive: true,
    isFeatured: true,
    suitableBirds: ['虎皮', '玄鳳', '牡丹', '小太陽'],
    images: [
      createMockIllustration('feed', '日光黃金穀物滋養餐', '無添加人工色素｜500g 夾鏈袋裝'),
      createMockIllustration('feed', '嚴選天然帶殼穀物與蔬果粒', '日常主食黃金比例'),
    ],
    videoUrl: '',
    descriptionHtml: `
      <h2>每日必備的陽光元氣主食</h2>
      <p>專為中小型鸚鵡調配的日常主食配方，結合<strong>台灣在地無毒帶殼小米</strong>、去殼燕麥仁、亞麻仁籽與低溫凍乾胡蘿蔔丁，保留穀物最原始的香氣與膳食纖維。</p>
      <ul>
        <li><span style="color: #C26D27"><strong>零防腐劑、零人工香料</strong></span>：每日新鮮分裝，開袋即可聞到淡淡穀香。</li>
        <li><strong>促進羽毛亮澤</strong>：內含天然 Omega-3 種子比例，陪伴換羽期營養補給。</li>
        <li><strong>建議餵食方式</strong>：每日更換新鮮飲水與適量穀物，可搭配新鮮深綠色蔬菜一同食用。</li>
      </ul>
      <blockquote>小提醒：第一次轉換飼料時，建議先以 3:7 比例與原飼料混合，讓鳥寶慢慢適應新口味喔！</blockquote>
    `,
    updatedAt: '2026-11-10T10:00:00.000Z',
  },
  {
    id: 'prod-2',
    name: '森林探險原木啃咬串（絲瓜絡 × 松果）',
    subtitle: '天然無染色原木塊搭配酥脆絲瓜絡，舒緩焦慮與磨喙必備',
    category: '啃咬與益智玩具',
    price: 350,
    originalPrice: 400,
    stock: 24,
    isActive: true,
    isFeatured: true,
    suitableBirds: ['玄鳳', '小太陽', '和尚', '月輪'],
    images: [
      createMockIllustration('toy', '森林探險原木啃咬串', '天然絲瓜絡 × 蘋果木 × 松果'),
      createMockIllustration('toy', '安全不鏽鋼掛勾設計', '可自由掛於籠內或站架'),
    ],
    videoUrl: '',
    descriptionHtml: `
      <h2>滿足鳥寶天生的啃咬與探索本能</h2>
      <p>鳥寶無聊時容易拔羽或焦躁？這款結合多種自然觸感的啃咬串，讓鳥寶整天忙碌又開心！</p>
      <ul>
        <li><strong>嚴選材質</strong>：天然日曬絲瓜絡、未漂白松果、蘋果木切片、純棉麻繩。</li>
        <li><strong>安全掛件</strong>：全系列採用 <mark style="background-color: #FDE68A">304 不鏽鋼快拆扣環</mark>，耐咬不生鏽。</li>
        <li><strong>藏食玩法</strong>：可在絲瓜絡孔洞塞入瓜子或小塊凍乾，變身覓食益智玩具！</li>
      </ul>
    `,
    updatedAt: '2026-11-10T10:00:00.000Z',
  },
  {
    id: 'prod-3',
    name: '天然花椒木分岔棲木站台（護爪防滑款）',
    subtitle: '保留自然樹皮紋理，幫助鳥寶腳掌放鬆與自然磨甲',
    category: '鳥籠與棲息空間',
    price: 280,
    stock: 42,
    variants: [
      { id: 'v3-s', label: 'S 號細枝（文鳥／虎皮）', price: 240, stock: 18 },
      { id: 'v3-m', label: 'M 號中枝（玄鳳／小太陽）', price: 280, stock: 16 },
      { id: 'v3-l', label: 'L 號粗枝（和尚／凱克）', price: 340, stock: 8 },
    ],
    isActive: true,
    isFeatured: true,
    suitableBirds: ['文鳥', '虎皮', '玄鳳', '小太陽', '凱克'],
    images: [
      createMockIllustration('perch', '天然花椒木分岔棲木', '粗細漸變｜保護足底關節'),
    ],
    videoUrl: '',
    descriptionHtml: `
      <h2>給毛羽雙腳最自然的支撐</h2>
      <p>長期站在單一粗細的塑膠圓棍上，容易造成鳥寶足底壓力不均。花椒木擁有天然彎曲分岔與凹凸紋理，讓每次抓握都是微運動。</p>
      <ul>
        <li><strong>高溫蒸煮烘乾處理</strong>：去除多餘油脂與蟲卵，無化學漆塗層。</li>
        <li><strong>多向鎖固墊片</strong>：內附大面積不鏽鋼墊片與蝶形螺母，安裝穩固不搖晃。</li>
      </ul>
    `,
    updatedAt: '2026-11-10T10:00:00.000Z',
  },
  {
    id: 'prod-4',
    name: '暖陽微風全景鳥用外出背包（附專屬木棲木）',
    subtitle: '三面防咬透氣網布 + 高透光視窗，帶鳥寶散步看風景超安心',
    category: '外出與日常照護',
    price: 1280,
    originalPrice: 1450,
    stock: 15,
    isActive: true,
    isFeatured: true,
    suitableBirds: ['虎皮', '玄鳳', '小太陽', '和尚', '金太陽'],
    images: [
      createMockIllustration('carrier', '暖陽微風鳥用外出背包', '輕量 880g｜附可拆式棲木與底盤'),
    ],
    videoUrl: '',
    descriptionHtml: `
      <h2>一起出門曬太陽，共享好個鳥日子</h2>
      <p>專為伴侶鳥設計的輕量外出包，兼顧通風對流與視線開闊度，外出就醫、踏青或至合作鳥店聚會都超方便。</p>
      <ul>
        <li><strong>雙側高強度防咬透氣網</strong>：空氣流通不悶熱，且設有可捲起遮陽簾，膽小鳥寶也能安心休息。</li>
        <li><strong>內建專屬棲木固定孔</strong>：附贈一根天然實木棲木與不鏽鋼食水杯固定座。</li>
        <li><strong>快拆防水底盤</strong>：外出清理排泄物只要抽出底盤沖洗即可。</li>
      </ul>
    `,
    updatedAt: '2026-11-10T10:00:00.000Z',
  },
  {
    id: 'prod-5',
    name: '輕羽舒緩微霧花灑澡盆',
    subtitle: '低分貝柔和水柱，讓怕水的鳥寶也愛上泡澡理羽',
    category: '外出與日常照護',
    price: 680,
    originalPrice: 780,
    stock: 4,
    isActive: true,
    isFeatured: false,
    suitableBirds: ['虎皮', '玄鳳', '牡丹', '小太陽', '太平洋'],
    images: [
      createMockIllustration('bath', '輕羽舒緩微霧花灑澡盆', '靜音循環水泵｜USB 供電'),
    ],
    videoUrl: '',
    descriptionHtml: `
      <h2>在家也能享受森林小雨浴</h2>
      <p>定期洗澡有助於去除羽粉與皮屑、維持羽毛防水結構。這款澡盆採用超靜音水泵與雙排微孔噴頭，水花細緻不驚嚇。</p>
      <ul>
        <li><strong>食品級 PP 材質</strong>：圓潤無毛邊，防滑盆底讓鳥寶站得穩穩的。</li>
        <li><strong>防咬包線設計</strong>：USB 電源線外層加裝防啃保護套（仍建議使用時飼主在旁陪伴）。</li>
      </ul>
    `,
    updatedAt: '2026-11-10T10:00:00.000Z',
  },
  {
    id: 'prod-6',
    name: '黃金燕麥草莓凍乾脆片（訓練獎勵小點）',
    subtitle: '非油炸零加糖！互動召回訓練的最佳小獎勵',
    category: '天然飼料與零食',
    price: 210,
    stock: 50,
    isActive: true,
    isFeatured: false,
    suitableBirds: ['全鳥種適用'],
    images: [
      createMockIllustration('feed', '黃金燕麥草莓凍乾脆片', '冷凍乾燥技術｜保留天然果香'),
    ],
    videoUrl: '',
    descriptionHtml: `
      <h2>建立親密信任的小小美味橋樑</h2>
      <p>想教鳥寶上手、定點回籠或簡單小才藝嗎？切成適口小丁的天然凍乾水果與燕麥脆片，不黏手、不油膩，是互動訓練的好夥伴。</p>
    `,
    updatedAt: '2026-11-10T10:00:00.000Z',
  },
];

