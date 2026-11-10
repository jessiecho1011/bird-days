import { INITIAL_MOCK_ARTICLES } from '../data/mockArticles';
import { INITIAL_MOCK_COUPONS } from '../data/mockCoupons';
import { INITIAL_MOCK_ACCOUNTS } from '../data/mockMembers';
import { INITIAL_MOCK_ORDERS } from '../data/mockOrders';
import { INITIAL_MOCK_PRODUCTS } from '../data/mockProducts';
import { INITIAL_MOCK_REVIEWS } from '../data/mockReviews';
import { INITIAL_MOCK_SHIPPING } from '../data/mockShipping';
import { INITIAL_MOCK_SITE_CONTENT } from '../data/mockSiteContent';
import { INITIAL_MOCK_STORES } from '../data/mockStores';
import type {
  BlogPost,
  CartItem,
  Coupon,
  MemberAccount,
  MemberProfile,
  MockOrder,
  PartnerStore,
  Product,
  ProductReview,
  ShippingConfig,
  SiteContent,
} from '../types';

/**
 * 本地儲存鍵值（目前以 localStorage 模擬資料庫持久化）
 * 未來架設 GCP 時，只需將此 Service 層內的方法改為呼叫 Cloud Run / Firestore REST API 即可。
 */
const STORAGE_KEYS = {
  PRODUCTS: 'birddays_mock_products_v1',
  STORES: 'birddays_mock_stores_v1',
  SITE_CONTENT: 'birddays_mock_site_content_v1',
  SHIPPING: 'birddays_mock_shipping_v1',
  COUPONS: 'birddays_mock_coupons_v1',
  ARTICLES: 'birddays_mock_articles_v1',
  REVIEWS: 'birddays_mock_reviews_v1',
  CART: 'birddays_mock_cart_v1',
  ORDERS: 'birddays_mock_orders_v1',
  WISHLIST: 'birddays_mock_wishlist_v1',
  MEMBER: 'birddays_mock_member_v1',
  MEMBER_ACCOUNTS: 'birddays_mock_member_accounts_v1',
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('localStorage 寫入失敗（可能是圖片檔案過大超過瀏覽器容量限制）', err);
    throw new Error('儲存空間不足，建議改用圖片網址或較小的圖片檔案');
  }
}

export const dataService = {
  // --- 商品 ---
  getProducts(): Product[] {
    return readJson<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_MOCK_PRODUCTS);
  },
  saveProducts(products: Product[]): void {
    writeJson(STORAGE_KEYS.PRODUCTS, products);
  },

  // --- 合作店家 ---
  getStores(): PartnerStore[] {
    return readJson<PartnerStore[]>(STORAGE_KEYS.STORES, INITIAL_MOCK_STORES);
  },
  saveStores(stores: PartnerStore[]): void {
    writeJson(STORAGE_KEYS.STORES, stores);
  },

  // --- 品牌文案與法規（相容補齊新增欄位） ---
  getSiteContent(): SiteContent {
    const raw = readJson<Partial<SiteContent>>(
      STORAGE_KEYS.SITE_CONTENT,
      INITIAL_MOCK_SITE_CONTENT
    );
    return {
      ...INITIAL_MOCK_SITE_CONTENT,
      ...raw,
    };
  },
  saveSiteContent(content: SiteContent): void {
    writeJson(STORAGE_KEYS.SITE_CONTENT, content);
  },

  // --- 運費與免運門檻 ---
  getShippingConfig(): ShippingConfig {
    const raw = readJson<Partial<ShippingConfig>>(
      STORAGE_KEYS.SHIPPING,
      INITIAL_MOCK_SHIPPING
    );
    return {
      ...INITIAL_MOCK_SHIPPING,
      ...raw,
    };
  },
  saveShippingConfig(config: ShippingConfig): void {
    writeJson(STORAGE_KEYS.SHIPPING, config);
  },

  // --- 優惠券 ---
  getCoupons(): Coupon[] {
    return readJson<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_MOCK_COUPONS);
  },
  saveCoupons(coupons: Coupon[]): void {
    writeJson(STORAGE_KEYS.COUPONS, coupons);
  },

  // --- 毛羽小教室文章 ---
  getArticles(): BlogPost[] {
    return readJson<BlogPost[]>(STORAGE_KEYS.ARTICLES, INITIAL_MOCK_ARTICLES);
  },
  saveArticles(articles: BlogPost[]): void {
    writeJson(STORAGE_KEYS.ARTICLES, articles);
  },

  // --- 商品評價（相容舊資料補齊 isApproved） ---
  getReviews(): ProductReview[] {
    const raw = readJson<ProductReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_MOCK_REVIEWS);
    return raw.map((rev) => ({
      ...rev,
      isApproved: rev.isApproved ?? true,
    }));
  },
  saveReviews(reviews: ProductReview[]): void {
    writeJson(STORAGE_KEYS.REVIEWS, reviews);
  },

  // --- 購物車 ---
  getCart(): CartItem[] {
    return readJson<CartItem[]>(STORAGE_KEYS.CART, []);
  },
  saveCart(cart: CartItem[]): void {
    writeJson(STORAGE_KEYS.CART, cart);
  },

  // --- 收藏清單 ---
  getWishlist(): string[] {
    return readJson<string[]>(STORAGE_KEYS.WISHLIST, []);
  },
  saveWishlist(ids: string[]): void {
    writeJson(STORAGE_KEYS.WISHLIST, ids);
  },

  // --- 前台 Mock 會員帳號清單與目前登入狀態 ---
  getMemberAccounts(): MemberAccount[] {
    return readJson<MemberAccount[]>(
      STORAGE_KEYS.MEMBER_ACCOUNTS,
      INITIAL_MOCK_ACCOUNTS
    );
  },
  saveMemberAccounts(accounts: MemberAccount[]): void {
    writeJson(STORAGE_KEYS.MEMBER_ACCOUNTS, accounts);
  },
  getMember(): MemberProfile | null {
    return readJson<MemberProfile | null>(STORAGE_KEYS.MEMBER, null);
  },
  saveMember(member: MemberProfile | null): void {
    if (!member) {
      localStorage.removeItem(STORAGE_KEYS.MEMBER);
      return;
    }
    writeJson(STORAGE_KEYS.MEMBER, member);
  },

  // --- 訂單（相容舊資料格式補齊預設欄位） ---
  getOrders(): MockOrder[] {
    const raw = readJson<MockOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_MOCK_ORDERS);
    return raw.map((ord) => {
      const itemsSubtotal =
        ord.subtotal ??
        ord.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return {
        ...ord,
        status: ord.status ?? '待處理',
        deliveryMethod: ord.deliveryMethod ?? 'home_delivery',
        paymentMethod: ord.paymentMethod ?? 'ecpay_credit',
        paymentStatus: ord.paymentStatus ?? '已付款（模擬）',
        discountAmount: ord.discountAmount ?? 0,
        subtotal: itemsSubtotal,
        shippingFee:
          ord.shippingFee ??
          Math.max(0, ord.totalAmount - itemsSubtotal + (ord.discountAmount ?? 0)),
      };
    });
  },
  saveOrders(orders: MockOrder[]): void {
    writeJson(STORAGE_KEYS.ORDERS, orders);
  },

  // --- 開發與資料移轉輔助 ---
  resetAllMockData(): void {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.STORES);
    localStorage.removeItem(STORAGE_KEYS.SITE_CONTENT);
    localStorage.removeItem(STORAGE_KEYS.SHIPPING);
    localStorage.removeItem(STORAGE_KEYS.COUPONS);
    localStorage.removeItem(STORAGE_KEYS.ARTICLES);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
  },

  exportAllAsJson(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        products: this.getProducts(),
        stores: this.getStores(),
        siteContent: this.getSiteContent(),
        shippingConfig: this.getShippingConfig(),
        coupons: this.getCoupons(),
        articles: this.getArticles(),
        reviews: this.getReviews(),
        orders: this.getOrders(),
      },
      null,
      2
    );
  },
};
