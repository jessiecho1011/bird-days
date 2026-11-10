import type { MockOrder, PaymentMethod } from '../types';

/**
 * ============================================================================
 * 第三方支付串接服務（預留綠界科技 ECPay AIO 全方位金流架構）
 * ============================================================================
 * 目前以 Mock 流程完整模擬：
 * 「建立待付款訂單 -> 產生交易編號 -> 導向第三方支付閘道 -> 付款結果回寫訂單」。
 *
 * TODO [ECPay 綠界正式串接步驟]：
 * 1. 於 GCP Cloud Run（Node.js / Python / Go）建立後端 API：POST /api/payments/ecpay/checkout
 * 2. 後端依照綠界文件組裝參數（MerchantID, MerchantTradeNo, MerchantTradeDate,
 *    PaymentType: 'aio', TotalAmount, TradeDesc, ItemName, ReturnURL, OrderResultURL,
 *    ChoosePayment: 'Credit' | 'ATM' | 'CVS', EncryptType: 1）
 *    並以 HashKey / HashIV 計算 SHA256 CheckMacValue。
 * 3. 本函式改為 fetch 該後端 API，取得綠界表單參數或自動送出的 HTML Form，
 *    導向 https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5（測試環境）
 *    或 https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5（正式環境）。
 * 4. 後端實作 ReturnURL（POST /api/payments/ecpay/callback）驗證 CheckMacValue 與 RtnCode === 1，
 *    確認無誤後更新 Firestore / Cloud SQL 訂單的 paymentStatus 與 status。
 * ============================================================================
 */

export interface EcpayCheckoutPayload {
  merchantTradeNo: string;
  merchantTradeDate: string;
  totalAmount: number;
  itemName: string;
  choosePayment: 'Credit' | 'ATM' | 'CVS' | 'ALL';
  redirectUrl: string;
}

const PAYMENT_METHOD_TO_ECPAY: Record<PaymentMethod, 'Credit' | 'ATM' | 'CVS' | 'ALL'> = {
  ecpay_credit: 'Credit',
  ecpay_atm: 'ATM',
  ecpay_cvs: 'CVS',
  cod: 'ALL',
};

export const paymentService = {
  /**
   * 檢查該付款方式是否需要導向第三方支付頁面
   */
  requiresGatewayRedirect(method: PaymentMethod): boolean {
    return method !== 'cod';
  },

  /**
   * 建立第三方金流交易請求（目前回傳模擬綠界閘道頁面與參數）
   */
  async createEcpaySession(order: MockOrder): Promise<EcpayCheckoutPayload> {
    // TODO: 未來改為呼叫 GCP 後端 API：
    // const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/payments/ecpay/checkout`, { ... });
    // return await res.json();

    const tradeNo = `BD${Date.now().toString().slice(-10)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}`;

    const itemName = order.items
      .map((i) => `${i.name}${i.variantLabel ? `(${i.variantLabel})` : ''} x${i.quantity}`)
      .join('#')
      .slice(0, 200);

    return {
      merchantTradeNo: tradeNo,
      merchantTradeDate: formattedDate,
      totalAmount: order.totalAmount,
      itemName,
      choosePayment: PAYMENT_METHOD_TO_ECPAY[order.paymentMethod],
      // 目前導向站內模擬綠界付款畫面；正式串接時會提交 Form 到綠界 URL
      redirectUrl: `/checkout/payment/${order.id}`,
    };
  },
};

