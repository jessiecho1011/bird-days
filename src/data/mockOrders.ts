import type { MockOrder } from '../types';

/**
 * 預設 Mock 訂單範例資料
 */
export const INITIAL_MOCK_ORDERS: MockOrder[] = [
  {
    id: 'ORD-260101',
    status: '待處理',
    deliveryMethod: 'home_delivery',
    paymentMethod: 'ecpay_credit',
    paymentStatus: '已付款（模擬）',
    paymentTradeNo: 'BD2601018812',
    customerName: '林羽晴',
    phone: '0912-345-678',
    email: 'yuqing@example.com',
    shippingAddress: '台北市大安區羅斯福路三段 128 號 4 樓',
    note: '家裡養兩隻玄鳳，請幫忙留意穀物保存期限，謝謝！',
    adminNote: '',
    items: [
      {
        productId: 'prod-1',
        variantId: 'v1-500',
        variantLabel: '500g 體驗夾鏈袋',
        name: '日光黃金穀物滋養餐（中小型鸚鵡配方）',
        price: 420,
        quantity: 2,
      },
      {
        productId: 'prod-2',
        name: '森林探險原木啃咬串（絲瓜絡 × 松果）',
        price: 350,
        quantity: 1,
      },
    ],
    subtotal: 1190,
    discountAmount: 50,
    couponCode: 'BIRDDAYS50',
    shippingFee: 100,
    totalAmount: 1240,
    createdAt: '2026-11-10T09:30:00.000Z',
  },
  {
    id: 'ORD-260102',
    status: '已出貨',
    deliveryMethod: 'cvs_pickup',
    cvsStoreName: '7-ELEVEN 台安門市（台北市大安區）',
    paymentMethod: 'ecpay_atm',
    paymentStatus: '已付款（模擬）',
    paymentTradeNo: 'BD2601029045',
    customerName: '陳柏宇',
    phone: '0988-221-456',
    email: 'poyu@example.com',
    shippingAddress: '7-ELEVEN 台安門市（台北市大安區）',
    note: '週末方便去超商取貨',
    adminNote: '超商交貨便單號：711-8821-4409',
    items: [
      {
        productId: 'prod-4',
        name: '暖陽微風全景鳥用外出背包（附專屬木棲木）',
        price: 1280,
        quantity: 1,
      },
    ],
    subtotal: 1280,
    discountAmount: 0,
    shippingFee: 0,
    totalAmount: 1280,
    createdAt: '2026-11-09T15:15:00.000Z',
  },
];
