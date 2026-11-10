import type { Coupon } from '../types';

/**
 * 預設優惠券／折扣碼 Mock 資料
 */
export const INITIAL_MOCK_COUPONS: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'BIRDDAYS50',
    title: '鳥友見面禮（滿 500 折 50）',
    discountType: 'fixed',
    discountValue: 50,
    minSpend: 500,
    isActive: true,
    expiresAt: '2026-12-31',
  },
  {
    id: 'coupon-2',
    code: 'SUNSHINE90',
    title: '暖陽生活節（滿 1,000 享 9 折）',
    discountType: 'percent',
    discountValue: 90, // 代表 9 折（付 90%）
    minSpend: 1000,
    isActive: true,
    expiresAt: '2026-12-31',
  },
];

export function calculateCouponDiscount(subtotal: number, coupon?: Coupon | null): number {
  if (!coupon || !coupon.isActive || subtotal < coupon.minSpend) return 0;
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date(new Date().toDateString())) {
    return 0;
  }
  if (coupon.discountType === 'fixed') {
    return Math.min(subtotal, Math.max(0, coupon.discountValue));
  }
  // percent 例如 90 = 9 折 -> 折扣 10%
  const payRate = Math.min(100, Math.max(1, coupon.discountValue));
  return Math.round(subtotal * ((100 - payRate) / 100));
}

