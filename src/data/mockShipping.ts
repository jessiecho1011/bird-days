import type { DeliveryMethod, ShippingConfig } from '../types';

/**
 * 預設運費與免運門檻設定（支援宅配與超商取貨）
 */
export const INITIAL_MOCK_SHIPPING: ShippingConfig = {
  baseFee: 100,
  cvsFee: 60,
  enableFreeShipping: true,
  freeShippingThreshold: 1200,
  cvsFreeThreshold: 899,
  shippingNotice: '本島宅配約 2-3 個工作天送達；超商取貨約 2-4 天送達指定門市。',
};

/**
 * 依配送方式與目前運費規則計算運費金額（計算基準為折抵後的訂單金額或商品小計）
 */
export function calculateShippingFee(
  amountAfterDiscount: number,
  config: ShippingConfig,
  deliveryMethod: DeliveryMethod = 'home_delivery'
): number {
  if (amountAfterDiscount <= 0) return 0;

  if (deliveryMethod === 'cvs_pickup') {
    if (config.enableFreeShipping && amountAfterDiscount >= config.cvsFreeThreshold) {
      return 0;
    }
    return Math.max(0, config.cvsFee);
  }

  if (config.enableFreeShipping && amountAfterDiscount >= config.freeShippingThreshold) {
    return 0;
  }
  return Math.max(0, config.baseFee);
}
