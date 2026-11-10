import type { PartnerStore } from '../types';

/**
 * 預設 Mock 合作店家資料
 * 未來可透過後台新增/編輯/刪除，並對接 GCP Firestore。
 */
export const INITIAL_MOCK_STORES: PartnerStore[] = [
  {
    id: 'store-1',
    name: '好個鳥日子 × 暖羽選物台北大安店',
    region: '北部',
    city: '台北市',
    address: '台北市大安區溫州街 74 巷 12 號 1 樓',
    phone: '02-2368-5120',
    openingHours: '週二至週日 11:30 - 20:30（週一公休）',
    features: ['全系列試吃體驗', '外出包試背', '手工啃咬玩具客製'],
    description: '鄰近台大生活圈的寵物鳥選物空間，現場備有天然棲木尺寸對照區與滋養丸試吃樣品，歡迎攜帶鳥寶前來散步交流。',
    mapUrl: 'https://maps.google.com/?q=台北市大安區溫州街',
  },
  {
    id: 'store-2',
    name: '啾啾森林鳥用品生活館',
    region: '北部',
    city: '新竹市',
    address: '新竹市東區光復路二段 298 號',
    phone: '03-571-8890',
    openingHours: '每日 12:00 - 21:00',
    features: ['鳥籠專區展示', '鳥寶剪羽預約', '穀物秤重零售'],
    description: '新竹地區深耕多年的鳥類友善專門店，販售「好個鳥日子」全系列原木棲木與天然飼料配方。',
    mapUrl: 'https://maps.google.com/?q=新竹市東區光復路二段',
  },
  {
    id: 'store-3',
    name: '草悟道羽翼咖啡 × 選物據點',
    region: '中部',
    city: '台中市',
    address: '台中市西區向上路一段 79 巷 36 號',
    phone: '04-2301-4421',
    openingHours: '週三至週日 11:00 - 19:30',
    features: ['寵物鳥友善空間', '實體寄售櫃位', '鳥友聚會包場'],
    description: '結合溫馨早午餐與鳥類生活選物的複合式空間，店內設有安全防飛網門廊，方便飼主安心帶鳥寶來喝杯咖啡。',
    mapUrl: 'https://maps.google.com/?q=台中市西區向上路一段',
  },
  {
    id: 'store-4',
    name: '南國晴天鸚鵡專門店',
    region: '南部',
    city: '高雄市',
    address: '高雄市左營區自由二路 412 號',
    phone: '07-556-9032',
    openingHours: '週二至週日 13:00 - 21:30',
    features: ['中大型鸚鵡用品', '照護用品專區', '品牌經銷門市'],
    description: '高雄左營專業鸚鵡照護與百貨經銷夥伴，提供齊全的益智玩具與鳥用澡盆現貨體驗。',
    mapUrl: 'https://maps.google.com/?q=高雄市左營區自由二路',
  },
  {
    id: 'store-5',
    name: '花蓮山海小雀手作坊',
    region: '東部',
    city: '花蓮縣',
    address: '花蓮市博愛街 152 號',
    phone: '03-832-1197',
    openingHours: '週四至週一 12:30 - 19:00',
    features: ['天然漂流木棲架', '手編麻繩玩具', '品牌合作寄賣點'],
    description: '善用花東在地無毒木料創作的獨立工作室，亦協助代售「好個鳥日子」精選穀物主食與外出配件。',
    mapUrl: 'https://maps.google.com/?q=花蓮市博愛街',
  },
];

