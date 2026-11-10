import type { ProductReview } from '../types';

/**
 * 預設商品評價／鳥寶買家秀 Mock 資料
 */
export const INITIAL_MOCK_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    memberEmail: 'birdlover@example.com',
    authorName: '阿吉媽咪',
    birdType: '玄鳳「麻糬」',
    rating: 5,
    comment: '打開袋子穀香超明顯！挑嘴的麻糬這次連裡面凍乾胡蘿蔔都吃光光，已經回購 1kg 家庭號了。',
    isApproved: true,
    createdAt: '2026-11-08T11:20:00.000Z',
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    authorName: '小太陽飼主 Kevin',
    birdType: '小太陽「芒果」',
    rating: 5,
    comment: '絲瓜絡跟松果超耐咬，芒果每天放風都會先衝去啃咬串尋寶，我還會塞瓜子進去讓牠動腦。',
    isApproved: true,
    createdAt: '2026-11-06T18:45:00.000Z',
  },
  {
    id: 'rev-3',
    productId: 'prod-3',
    authorName: 'Hana',
    birdType: '虎皮「檸檬」',
    rating: 5,
    comment: '買 S 號細枝剛剛好！花椒木握起來不打滑，螺母固定在籠子上也很穩不會晃。',
    isApproved: true,
    createdAt: '2026-11-04T09:10:00.000Z',
  },
  {
    id: 'rev-4',
    productId: 'prod-4',
    authorName: '新鳥友小安',
    birdType: '和尚「抹茶」',
    rating: 5,
    comment: '透氣網布很厚實，帶抹茶去醫院健檢的時候牠在裡面乖乖看風景！',
    isApproved: false, // 預設待審核範例，可於後台切換核准顯示
    createdAt: '2026-11-10T10:30:00.000Z',
  },
];
