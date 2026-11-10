export type ProductCategory =
  | '天然飼料與零食'
  | '啃咬與益智玩具'
  | '鳥籠與棲息空間'
  | '外出與日常照護';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  '天然飼料與零食',
  '啃咬與益智玩具',
  '鳥籠與棲息空間',
  '外出與日常照護',
];

export const BIRD_SPECIES_FILTERS = [
  '虎皮',
  '玄鳳',
  '小太陽',
  '牡丹',
  '和尚',
  '文鳥',
  '凱克',
] as const;

export interface ProductVariant {
  id: string;
  label: string;          // 例如：300g 體驗包、600g 家庭號、S 細木、M 中木
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stock: number;
  variants?: ProductVariant[]; // 選填：若設定多規格，購買與扣庫以選取的規格為主
  isActive: boolean;
  isFeatured: boolean;
  suitableBirds: string[];
  images: string[];
  videoUrl?: string;
  descriptionHtml: string;
  updatedAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  memberEmail?: string;
  authorName: string;
  birdType: string;
  rating: number;         // 1 ~ 5
  comment: string;
  imageUrl?: string;
  isApproved: boolean;    // 預設為 false，經後台審核核准後才顯示於商品頁
  createdAt: string;
}

export type StoreRegion = '北部' | '中部' | '南部' | '東部';

export const STORE_REGIONS: StoreRegion[] = ['北部', '中部', '南部', '東部'];

export interface PartnerStore {
  id: string;
  name: string;
  region: StoreRegion;
  city: string;
  address: string;
  phone: string;
  openingHours: string;
  features: string[];
  description: string;
  mapUrl?: string;
}

export interface SiteContent {
  brandName: string;
  brandSlogan: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroVideoUrl?: string;
  storyTitle: string;
  storyHtml: string;
  announcementText: string;
  shoppingGuideHtml: string; // 購物與配送須知
  returnPolicyHtml: string;  // 飼料／衛生用品退換貨政策
  privacyPolicyHtml: string; // 隱私權保護條款
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export type OrderStatus = '待處理' | '備貨中' | '已出貨' | '已完成' | '已取消';

export const ORDER_STATUSES: OrderStatus[] = [
  '待處理',
  '備貨中',
  '已出貨',
  '已完成',
  '已取消',
];

export type DeliveryMethod = 'home_delivery' | 'cvs_pickup';

export const DELIVERY_METHOD_LABELS: Record<DeliveryMethod, string> = {
  home_delivery: '本島宅配到府',
  cvs_pickup: '超商取貨（7-ELEVEN / 全家 Mock）',
};

export type PaymentMethod = 'ecpay_credit' | 'ecpay_atm' | 'ecpay_cvs' | 'cod';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  ecpay_credit: '第三方支付（綠界 ECPay 信用卡）',
  ecpay_atm: '第三方支付（綠界 ECPay ATM 虛擬帳號）',
  ecpay_cvs: '第三方支付（綠界 ECPay 超商代碼）',
  cod: '宅配／超商貨到付款',
};

export type PaymentStatus = '待付款' | '已付款（模擬）' | '付款失敗' | '貨到付款';

export interface ShippingConfig {
  baseFee: number;               // 宅配基本運費
  cvsFee: number;                // 超商取貨基本運費
  enableFreeShipping: boolean;
  freeShippingThreshold: number; // 宅配免運門檻
  cvsFreeThreshold: number;      // 超商取貨免運門檻
  shippingNotice: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  discountType: 'fixed' | 'percent'; // fixed: 折抵固定金額；percent: 打折（例如 90 代表 9 折）
  discountValue: number;
  minSpend: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface MockOrder {
  id: string;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  cvsStoreName?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTradeNo?: string;  // 第三方金流交易編號（預留綠界 MerchantTradeNo）
  paymentExpiresAt?: string; // 第三方支付預扣庫存保留截止時間（例如 +15 分鐘）
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  note?: string;
  adminNote?: string;
  items: {
    productId: string;
    variantId?: string;
    variantLabel?: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  summary: string;
  coverImage: string;
  videoUrl?: string;
  contentHtml: string;
  relatedProductIds: string[];
  isPublished: boolean;
  publishedAt: string;
}

export interface MemberProfile {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  phone: string;
  defaultAddress: string;
  birdNames: string; // 例如：小太陽「芒果」、玄鳳「布丁」
}

export interface MemberAccount extends MemberProfile {
  password: string;
  createdAt: string;
}
