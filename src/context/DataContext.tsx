import React, { createContext, useContext, useState } from 'react';
import { INITIAL_MOCK_ARTICLES } from '../data/mockArticles';
import { INITIAL_MOCK_COUPONS } from '../data/mockCoupons';
import { INITIAL_MOCK_ORDERS } from '../data/mockOrders';
import { INITIAL_MOCK_PRODUCTS } from '../data/mockProducts';
import { INITIAL_MOCK_REVIEWS } from '../data/mockReviews';
import { INITIAL_MOCK_SHIPPING } from '../data/mockShipping';
import { INITIAL_MOCK_SITE_CONTENT } from '../data/mockSiteContent';
import { INITIAL_MOCK_STORES } from '../data/mockStores';
import { dataService } from '../services/storageService';
import type {
  BlogPost,
  Coupon,
  MemberAccount,
  MemberProfile,
  MockOrder,
  OrderStatus,
  PartnerStore,
  PaymentStatus,
  Product,
  ProductReview,
  ShippingConfig,
  SiteContent,
} from '../types';

function adjustProductsStock(
  products: Product[],
  orderItems: MockOrder['items'],
  deltaSign: -1 | 1
): Product[] {
  return products.map((product) => {
    const matched = orderItems.filter((i) => i.productId === product.id);
    if (matched.length === 0) return product;

    let totalDelta = 0;
    let nextVariants = product.variants ? [...product.variants] : undefined;

    for (const item of matched) {
      const qtyDelta = item.quantity * deltaSign;
      totalDelta += qtyDelta;
      if (nextVariants && item.variantId) {
        nextVariants = nextVariants.map((v) =>
          v.id === item.variantId
            ? { ...v, stock: Math.max(0, v.stock + qtyDelta) }
            : v
        );
      }
    }

    const nextStock = nextVariants
      ? nextVariants.reduce((sum, v) => sum + v.stock, 0)
      : Math.max(0, product.stock + totalDelta);

    return {
      ...product,
      stock: nextStock,
      variants: nextVariants,
    };
  });
}

export type PlaceOrderInput = Omit<MockOrder, 'id' | 'createdAt' | 'status'>;

export type PlaceOrderResult =
  | { ok: true; order: MockOrder }
  | { ok: false; error: string };

interface DataContextValue {
  products: Product[];
  stores: PartnerStore[];
  siteContent: SiteContent;
  shippingConfig: ShippingConfig;
  coupons: Coupon[];
  articles: BlogPost[];
  reviews: ProductReview[];
  orders: MockOrder[];
  wishlistIds: string[];
  member: MemberProfile | null;

  addProduct: (input: Omit<Product, 'id' | 'updatedAt'>) => Product;
  updateProduct: (id: string, patch: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (id: string) => void;

  addStore: (input: Omit<PartnerStore, 'id'>) => PartnerStore;
  updateStore: (id: string, patch: Partial<Omit<PartnerStore, 'id'>>) => void;
  deleteStore: (id: string) => void;

  updateSiteContent: (content: SiteContent) => void;
  updateShippingConfig: (config: ShippingConfig) => void;

  addCoupon: (input: Omit<Coupon, 'id'>) => Coupon;
  updateCoupon: (id: string, patch: Partial<Omit<Coupon, 'id'>>) => void;
  deleteCoupon: (id: string) => void;

  addArticle: (input: Omit<BlogPost, 'id' | 'publishedAt'>) => BlogPost;
  updateArticle: (id: string, patch: Partial<Omit<BlogPost, 'id'>>) => void;
  deleteArticle: (id: string) => void;

  addReview: (
    input: Omit<ProductReview, 'id' | 'createdAt' | 'isApproved'>
  ) => ProductReview;
  toggleReviewApproval: (id: string) => void;
  deleteReview: (id: string) => void;

  placeOrder: (input: PlaceOrderInput) => PlaceOrderResult;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrderPaymentStatus: (
    id: string,
    paymentStatus: PaymentStatus,
    tradeNo?: string
  ) => void;
  updateOrderAdminNote: (id: string, adminNote: string) => void;
  deleteOrder: (id: string) => void;

  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  checkEmailRegistered: (email: string) => boolean;
  loginWithEmailPassword: (
    email: string,
    password: string
  ) =>
    | { ok: true; member: MemberProfile }
    | { ok: false; reason: 'not_found' | 'wrong_password'; error: string };
  registerWithEmailPassword: (email: string, password: string) => MemberProfile;
  updateMemberProfile: (patch: Partial<Omit<MemberProfile, 'id'>>) => void;
  logoutMember: () => void;

  resetMockData: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

const PAYMENT_RESERVE_MINUTES = 15;

/**
 * 清理超過 15 分鐘尚未完成第三方付款的預扣訂單，自動取消並釋放庫存
 * TODO [GCP Cloud Scheduler / Cloud Tasks]：正式上線後改由後端排程定期執行。
 */
function releaseExpiredOrdersOnInit(): {
  initialProducts: Product[];
  initialOrders: MockOrder[];
} {
  let loadedProducts = dataService.getProducts();
  const loadedOrders = dataService.getOrders();
  const nowMs = Date.now();
  let hasChanged = false;

  const nextOrders = loadedOrders.map((ord) => {
    if (
      ord.paymentStatus === '待付款' &&
      ord.status !== '已取消' &&
      ord.paymentExpiresAt &&
      new Date(ord.paymentExpiresAt).getTime() < nowMs
    ) {
      hasChanged = true;
      loadedProducts = adjustProductsStock(loadedProducts, ord.items, 1);
      return {
        ...ord,
        status: '已取消' as OrderStatus,
        paymentStatus: '付款失敗' as PaymentStatus,
        adminNote: ord.adminNote
          ? `${ord.adminNote}（逾時未付款自動釋放庫存）`
          : '逾時 15 分鐘未付款，系統已自動取消並釋放預扣庫存',
      };
    }
    return ord;
  });

  if (hasChanged) {
    dataService.saveProducts(loadedProducts);
    dataService.saveOrders(nextOrders);
  }

  return { initialProducts: loadedProducts, initialOrders: nextOrders };
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [{ initialProducts, initialOrders }] = useState(() =>
    releaseExpiredOrdersOnInit()
  );
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [stores, setStores] = useState<PartnerStore[]>(() => dataService.getStores());
  const [siteContent, setSiteContent] = useState<SiteContent>(() => dataService.getSiteContent());
  const [shippingConfig, setShippingConfig] = useState<ShippingConfig>(() =>
    dataService.getShippingConfig()
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() => dataService.getCoupons());
  const [articles, setArticles] = useState<BlogPost[]>(() => dataService.getArticles());
  const [reviews, setReviews] = useState<ProductReview[]>(() => dataService.getReviews());
  const [orders, setOrders] = useState<MockOrder[]>(initialOrders);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => dataService.getWishlist());
  const [memberAccounts, setMemberAccounts] = useState<MemberAccount[]>(() =>
    dataService.getMemberAccounts()
  );
  const [member, setMember] = useState<MemberProfile | null>(() => dataService.getMember());

  // --- 商品 ---
  const addProduct = (input: Omit<Product, 'id' | 'updatedAt'>): Product => {
    const newProduct: Product = {
      ...input,
      id: `prod-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    const next = [newProduct, ...products];
    dataService.saveProducts(next);
    setProducts(next);
    return newProduct;
  };

  const updateProduct = (id: string, patch: Partial<Omit<Product, 'id'>>) => {
    const next = products.map((p) =>
      p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
    );
    dataService.saveProducts(next);
    setProducts(next);
  };

  const deleteProduct = (id: string) => {
    const next = products.filter((p) => p.id !== id);
    dataService.saveProducts(next);
    setProducts(next);
  };

  // --- 合作店家 ---
  const addStore = (input: Omit<PartnerStore, 'id'>): PartnerStore => {
    const newStore: PartnerStore = { ...input, id: `store-${Date.now()}` };
    const next = [newStore, ...stores];
    dataService.saveStores(next);
    setStores(next);
    return newStore;
  };

  const updateStore = (id: string, patch: Partial<Omit<PartnerStore, 'id'>>) => {
    const next = stores.map((s) => (s.id === id ? { ...s, ...patch } : s));
    dataService.saveStores(next);
    setStores(next);
  };

  const deleteStore = (id: string) => {
    const next = stores.filter((s) => s.id !== id);
    dataService.saveStores(next);
    setStores(next);
  };

  // --- 文案與運費 ---
  const updateSiteContent = (content: SiteContent) => {
    dataService.saveSiteContent(content);
    setSiteContent(content);
  };

  const updateShippingConfig = (config: ShippingConfig) => {
    dataService.saveShippingConfig(config);
    setShippingConfig(config);
  };

  // --- 優惠券 ---
  const addCoupon = (input: Omit<Coupon, 'id'>): Coupon => {
    const newCoupon: Coupon = {
      ...input,
      code: input.code.trim().toUpperCase(),
      id: `coupon-${Date.now()}`,
    };
    const next = [newCoupon, ...coupons];
    dataService.saveCoupons(next);
    setCoupons(next);
    return newCoupon;
  };

  const updateCoupon = (id: string, patch: Partial<Omit<Coupon, 'id'>>) => {
    const next = coupons.map((c) =>
      c.id === id
        ? { ...c, ...patch, code: (patch.code ?? c.code).trim().toUpperCase() }
        : c
    );
    dataService.saveCoupons(next);
    setCoupons(next);
  };

  const deleteCoupon = (id: string) => {
    const next = coupons.filter((c) => c.id !== id);
    dataService.saveCoupons(next);
    setCoupons(next);
  };

  // --- 毛羽小教室文章 ---
  const addArticle = (input: Omit<BlogPost, 'id' | 'publishedAt'>): BlogPost => {
    const newPost: BlogPost = {
      ...input,
      id: `post-${Date.now()}`,
      publishedAt: new Date().toISOString(),
    };
    const next = [newPost, ...articles];
    dataService.saveArticles(next);
    setArticles(next);
    return newPost;
  };

  const updateArticle = (id: string, patch: Partial<Omit<BlogPost, 'id'>>) => {
    const next = articles.map((a) => (a.id === id ? { ...a, ...patch } : a));
    dataService.saveArticles(next);
    setArticles(next);
  };

  const deleteArticle = (id: string) => {
    const next = articles.filter((a) => a.id !== id);
    dataService.saveArticles(next);
    setArticles(next);
  };

  // --- 商品評價（會員送出先存入待審核，由後台決定是否顯示於商品頁） ---
  const addReview = (
    input: Omit<ProductReview, 'id' | 'createdAt' | 'isApproved'>
  ): ProductReview => {
    const newReview: ProductReview = {
      ...input,
      id: `rev-${Date.now()}`,
      isApproved: false,
      createdAt: new Date().toISOString(),
    };
    const next = [newReview, ...reviews];
    dataService.saveReviews(next);
    setReviews(next);
    return newReview;
  };

  const toggleReviewApproval = (id: string) => {
    const next = reviews.map((r) =>
      r.id === id ? { ...r, isApproved: !r.isApproved } : r
    );
    dataService.saveReviews(next);
    setReviews(next);
  };

  const deleteReview = (id: string) => {
    const next = reviews.filter((r) => r.id !== id);
    dataService.saveReviews(next);
    setReviews(next);
  };

  // --- 訂單與原子性預扣庫存機制（按下送出／前往付款才鎖定，未結帳加入購物車不佔庫存） ---
  const placeOrder = (input: PlaceOrderInput): PlaceOrderResult => {
    // TODO [GCP 後端原子交易]：
    // 未來接上 Firestore / Cloud SQL 後，務必在 Transaction 內進行「檢查 stock >= qty 並扣減」
    //（例如 Firestore runTransaction 或 SQL `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`），
    // 以徹底防止多位客人同時結帳最後一件商品時發生超賣。
    for (const item of input.items) {
      const product = products.find((p) => p.id === item.productId && p.isActive);
      if (!product) {
        return { ok: false, error: `商品「${item.name}」已下架或不存在，請從購物車移除後再結帳` };
      }
      if (item.variantId && product.variants) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant || variant.stock < item.quantity) {
          return {
            ok: false,
            error: `「${product.name}（${variant?.label ?? ''}）」剛剛已被搶購或庫存不足（目前僅剩 ${
              variant?.stock ?? 0
            } 件）`,
          };
        }
      } else if (product.stock < item.quantity) {
        return {
          ok: false,
          error: `「${product.name}」剛剛已被搶購或庫存不足（目前僅剩 ${product.stock} 件）`,
        };
      }
    }

    const updatedProducts = adjustProductsStock(products, input.items, -1);
    dataService.saveProducts(updatedProducts);
    setProducts(updatedProducts);

    const now = Date.now();
    const expiresAt =
      input.paymentStatus === '待付款'
        ? new Date(now + PAYMENT_RESERVE_MINUTES * 60 * 1000).toISOString()
        : undefined;

    const newOrder: MockOrder = {
      ...input,
      id: `ORD-${now.toString().slice(-6)}`,
      status: '待處理',
      paymentExpiresAt: expiresAt,
      createdAt: new Date(now).toISOString(),
    };
    const nextOrders = [newOrder, ...orders];
    dataService.saveOrders(nextOrders);
    setOrders(nextOrders);

    return { ok: true, order: newOrder };
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    const target = orders.find((o) => o.id === id);
    if (!target || target.status === status) return;

    // 取消訂單自動補回庫存；從取消恢復為處理中則重新扣減庫存
    if (target.status !== '已取消' && status === '已取消') {
      const restored = adjustProductsStock(products, target.items, 1);
      dataService.saveProducts(restored);
      setProducts(restored);
    } else if (target.status === '已取消' && status !== '已取消') {
      const deducted = adjustProductsStock(products, target.items, -1);
      dataService.saveProducts(deducted);
      setProducts(deducted);
    }

    const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
    dataService.saveOrders(next);
    setOrders(next);
  };

  const updateOrderPaymentStatus = (
    id: string,
    paymentStatus: PaymentStatus,
    tradeNo?: string
  ) => {
    const next = orders.map((o) =>
      o.id === id
        ? {
            ...o,
            paymentStatus,
            paymentTradeNo: tradeNo ?? o.paymentTradeNo,
          }
        : o
    );
    dataService.saveOrders(next);
    setOrders(next);
  };

  const updateOrderAdminNote = (id: string, adminNote: string) => {
    const next = orders.map((o) => (o.id === id ? { ...o, adminNote } : o));
    dataService.saveOrders(next);
    setOrders(next);
  };

  const deleteOrder = (id: string) => {
    const next = orders.filter((o) => o.id !== id);
    dataService.saveOrders(next);
    setOrders(next);
  };

  // --- 收藏清單 ---
  const toggleWishlist = (productId: string) => {
    const exists = wishlistIds.includes(productId);
    const next = exists
      ? wishlistIds.filter((id) => id !== productId)
      : [productId, ...wishlistIds];
    dataService.saveWishlist(next);
    setWishlistIds(next);
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  // --- 前台 Mock 會員（單一入口支援登入與 Email 驗證註冊） ---
  const toProfile = (acc: MemberAccount): MemberProfile => ({
    id: acc.id,
    email: acc.email,
    emailVerified: acc.emailVerified,
    name: acc.name,
    phone: acc.phone,
    defaultAddress: acc.defaultAddress,
    birdNames: acc.birdNames,
  });

  const checkEmailRegistered = (email: string): boolean => {
    const norm = email.trim().toLowerCase();
    return memberAccounts.some((acc) => acc.email.toLowerCase() === norm);
  };

  const loginWithEmailPassword = (
    email: string,
    password: string
  ):
    | { ok: true; member: MemberProfile }
    | { ok: false; reason: 'not_found' | 'wrong_password'; error: string } => {
    const norm = email.trim().toLowerCase();
    const found = memberAccounts.find((acc) => acc.email.toLowerCase() === norm);
    if (!found) {
      return {
        ok: false,
        reason: 'not_found',
        error: '此 Email 尚未註冊，請進行信箱驗證完成註冊。',
      };
    }
    if (found.password !== password) {
      return {
        ok: false,
        reason: 'wrong_password',
        error: '密碼不正確，請確認後再試。',
      };
    }
    const profile = toProfile(found);
    dataService.saveMember(profile);
    setMember(profile);
    return { ok: true, member: profile };
  };

  const registerWithEmailPassword = (
    email: string,
    password: string
  ): MemberProfile => {
    const norm = email.trim().toLowerCase();
    const defaultName = norm.split('@')[0] || '鳥友會員';
    const newAccount: MemberAccount = {
      id: `mem-${Date.now()}`,
      email: norm,
      password,
      emailVerified: true,
      name: defaultName,
      phone: '',
      defaultAddress: '',
      birdNames: '',
      createdAt: new Date().toISOString(),
    };
    const nextAccounts = [newAccount, ...memberAccounts];
    dataService.saveMemberAccounts(nextAccounts);
    setMemberAccounts(nextAccounts);

    const profile = toProfile(newAccount);
    dataService.saveMember(profile);
    setMember(profile);
    return profile;
  };

  const updateMemberProfile = (patch: Partial<Omit<MemberProfile, 'id'>>) => {
    if (!member) return;
    const nextProfile = { ...member, ...patch };
    dataService.saveMember(nextProfile);
    setMember(nextProfile);

    const nextAccounts = memberAccounts.map((acc) =>
      acc.id === member.id ? { ...acc, ...patch } : acc
    );
    dataService.saveMemberAccounts(nextAccounts);
    setMemberAccounts(nextAccounts);
  };

  const logoutMember = () => {
    dataService.saveMember(null);
    setMember(null);
  };

  // --- 重置全部 Mock ---
  const resetMockData = () => {
    dataService.resetAllMockData();
    setProducts(INITIAL_MOCK_PRODUCTS);
    setStores(INITIAL_MOCK_STORES);
    setSiteContent(INITIAL_MOCK_SITE_CONTENT);
    setShippingConfig(INITIAL_MOCK_SHIPPING);
    setCoupons(INITIAL_MOCK_COUPONS);
    setArticles(INITIAL_MOCK_ARTICLES);
    setReviews(INITIAL_MOCK_REVIEWS);
    setOrders(INITIAL_MOCK_ORDERS);
  };

  return (
    <DataContext.Provider
      value={{
        products,
        stores,
        siteContent,
        shippingConfig,
        coupons,
        articles,
        reviews,
        orders,
        wishlistIds,
        member,
        addProduct,
        updateProduct,
        deleteProduct,
        addStore,
        updateStore,
        deleteStore,
        updateSiteContent,
        updateShippingConfig,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        addArticle,
        updateArticle,
        deleteArticle,
        addReview,
        toggleReviewApproval,
        deleteReview,
        placeOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        updateOrderAdminNote,
        deleteOrder,
        toggleWishlist,
        isWishlisted,
        checkEmailRegistered,
        loginWithEmailPassword,
        registerWithEmailPassword,
        updateMemberProfile,
        logoutMember,
        resetMockData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData 必須在 DataProvider 內使用');
  return ctx;
}
