import type { SiteContent } from '../types';
import { createMockIllustration } from '../utils/media';

/**
 * 預設首頁、品牌文案與法規頁面 Mock 資料
 * 後台可使用富文本編輯器修改樣式與內容
 */
export const INITIAL_MOCK_SITE_CONTENT: SiteContent = {
  brandName: '好個鳥日子',
  brandSlogan: '陽光灑落棲木，陪伴毛羽度過每一個好日子。',
  heroTitle: '專為寵物鳥打造的溫暖生活選物',
  heroSubtitle:
    '從無毒原木棲木、有機穀物滋養餐到輕量外出背包，我們站在鳥寶的視角挑選每一件日常好物。',
  heroImageUrl: createMockIllustration(
    'hero',
    '好個鳥日子 Bird Days',
    '天然無毒 × 毛羽友善 × 台灣設計選物'
  ),
  heroVideoUrl: '',
  storyTitle: '為什麼我們叫做「好個鳥日子」？',
  storyHtml: `
    <p>生活中偶爾會有忙碌與疲憊的時刻，但只要回到家，看見肩上的小傢伙歪著頭啾啾叫、或是安靜地在陽光下理羽毛，再平凡的一天也能變成<strong>「好個鳥日子」</strong>。</p>
    <p>我們堅持所有商品皆符合三大原則：</p>
    <ul>
      <li><span style="color: #C26D27"><strong>材質安全透明</strong></span>：拒絕化學染劑與劣質重金屬掛鉤，木頭與穀物皆經過安心篩選。</li>
      <li><span style="color: #4D7C43"><strong>尊重天性設計</strong></span>：鼓勵啃咬、探索與自然抓握，讓鳥寶在家中也能保持身心健康。</li>
      <li><strong>與全台鳥店同行</strong>：串聯各地友善寵物鳥的合作店家，讓飼主看得到、摸得到好品質。</li>
    </ul>
    <blockquote>您也可以前往後台的「品牌文案與樣式編輯」頁面，使用文字樣式編輯器自由調整這段內容的顏色、大小與圖片！</blockquote>
  `,
  announcementText: '☀️ 全館滿額免運中｜輸入折扣碼 BIRDDAYS50 滿 500 現折 50 元',
  shoppingGuideHtml: `
    <h2>購物與配送流程說明</h2>
    <p>感謝您選擇「好個鳥日子」為家中的鳥寶選購日常用品！以下為標準訂購與配送方式說明：</p>
    <ul>
      <li><strong>付款方式</strong>：支援第三方支付（綠界 ECPay 信用卡、ATM 虛擬帳號、超商代碼）與貨到付款。</li>
      <li><strong>出貨時間</strong>：現貨商品於付款確認後 1～2 個工作天內寄出，假日順延。</li>
      <li><strong>配送方式</strong>：提供本島宅配到府與 7-ELEVEN／全家超商取貨，實際免運門檻依結帳頁面顯示為主。</li>
    </ul>
  `,
  returnPolicyHtml: `
    <h2>退換貨與商品保固政策</h2>
    <p>依消費者保護法規定，線上購物享有商品到貨七天猶豫期（注意：猶豫期並非試用期）。</p>
    <blockquote><span style="color: #B84A39"><strong>重要衛生提醒</strong></span>：寵物鳥飼料、零食凍乾及接觸毛羽之清潔／澡盆用品，基於鳥禽傳染病防疫與食品衛生安全，<strong>一經拆封即無法受理退貨</strong>（商品本身瑕疵除外）。</blockquote>
    <ul>
      <li>若收到商品有破損、漏寄或規格錯誤，請於收貨 48 小時內拍照並聯絡客服，我們將盡速免費為您補寄或更換。</li>
      <li>原木棲木與天然松果／絲瓜絡每件紋理與形狀皆獨一無二，些微自然木紋差異屬正常現象。</li>
    </ul>
  `,
  privacyPolicyHtml: `
    <h2>隱私權保護政策</h2>
    <p>「好個鳥日子 Bird Days」十分重視您的個人資料安全：</p>
    <ul>
      <li><strong>資料蒐集目的</strong>：您於結帳或加入會員時提供的姓名、電話、電子信箱與寄送地址，僅用於訂單出貨、售後服務通知及金流核對。</li>
      <li><strong>第三方金流安全</strong>：信用卡與線上支付交易將導向第三方支付平台（如綠界 ECPay）加密處理，本站不儲存您的完整信用卡卡號。</li>
      <li><strong>資料保護與查詢</strong>：您隨時可聯絡我們查詢、更正或請求刪除您的會員聯絡資訊。</li>
    </ul>
  `,
};
