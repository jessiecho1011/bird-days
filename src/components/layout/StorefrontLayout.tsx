import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Bird,
  Heart,
  Menu,
  Settings,
  ShoppingBag,
  Store,
  User,
  X,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useData } from "../../context/DataContext";
import { CartDrawer } from "../common/CartDrawer";

const CURRENT_YEAR = new Date().getFullYear();

export const StorefrontLayout: React.FC = () => {
  const { siteContent, wishlistIds, member } = useData();
  const {
    totalCount,
    openDrawer,
    flyingItems,
    removeFlyingItem,
    cartBumpTick,
    lastAddedNotice,
  } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (cartBumpTick === 0) return;
    const btn = cartButtonRef.current;
    if (!btn) return;
    btn.classList.remove("animate-cart-bump");
    // 觸發重繪讓連點時可平滑重啟彈跳動畫而不卸載按鈕
    void btn.offsetWidth;
    btn.classList.add("animate-cart-bump");
  }, [cartBumpTick]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-soft text-text-primary font-semibold"
        : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary">
      {/* 頂部公告列 */}
      {siteContent.announcementText && (
        <div className="bg-brand-primary px-4 py-2 text-center text-xs font-semibold text-text-on-primary sm:text-sm">
          {siteContent.announcementText}
        </div>
      )}

      {/* 導覽列 */}
      <header className="sticky top-0 z-40 border-b border-border-soft bg-bg-base/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-3.5">
          {/* 品牌 Logo */}
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-text-on-primary shadow-sm sm:h-10 sm:w-10">
              <Bird className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <div className="min-w-0">
              <span className="block truncate text-base font-extrabold tracking-wide text-text-primary sm:text-lg">
                {siteContent.brandName}
              </span>
              <span className="hidden truncate text-[11px] font-medium text-text-muted sm:block">
                BIRD DAYS 寵物鳥生活選物
              </span>
            </div>
          </Link>

          {/* 桌面版選單（1024px+ 顯示，避免平板擠壓折行） */}
          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink to="/" end className={navLinkClass}>
              品牌首頁
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              產品目錄
            </NavLink>
            <NavLink to="/articles" className={navLinkClass}>
              毛羽小教室
            </NavLink>
            <NavLink to="/stores" className={navLinkClass}>
              合作店家
            </NavLink>
            <NavLink to="/orders/lookup" className={navLinkClass}>
              訂單查詢
            </NavLink>
          </nav>

          {/* 右側操作鈕 */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              to={member ? "/account" : "/login"}
              className="hidden items-center gap-1.5 rounded-xl border border-border-soft bg-bg-surface px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-primary hover:text-text-primary sm:inline-flex"
              title={member ? "會員中心" : "登入或註冊鳥友會員"}
            >
              <User className="h-3.5 w-3.5 text-brand-accent" />
              <span className="max-w-[5rem] truncate">
                {member ? member.name || "會員" : "登入／註冊"}
              </span>
            </Link>

            <Link
              to="/account"
              className="hidden items-center gap-1.5 rounded-xl border border-border-soft bg-bg-surface px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-primary hover:text-text-primary sm:inline-flex"
              title="我的收藏清單"
            >
              <Heart className="h-3.5 w-3.5 text-brand-accent" />
              收藏
              {wishlistIds.length > 0 && (
                <span className="rounded-full bg-brand-secondary px-1.5 text-[10px] font-bold text-text-primary">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-xl border border-border-soft bg-bg-surface px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-brand-primary hover:text-text-primary lg:inline-flex"
              title="前往後台管理系統"
            >
              <Settings className="h-3.5 w-3.5" />
              管理後台
            </Link>

            <div className="relative">
              <button
                ref={cartButtonRef}
                type="button"
                data-cart-target="true"
                onClick={openDrawer}
                onAnimationEnd={(e) => {
                  e.currentTarget.classList.remove("animate-cart-bump");
                }}
                className="btn-brand-primary relative inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:gap-2 sm:px-3.5 sm:text-sm"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">購物籃</span>
                {totalCount > 0 && (
                  <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-accent px-1.5 text-[11px] font-bold text-text-on-accent">
                    {totalCount}
                  </span>
                )}
              </button>

              {lastAddedNotice && (
                <span
                  key={lastAddedNotice.key}
                  className="animate-cart-added-pop pointer-events-none absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-full border border-border-strong bg-bg-card px-2.5 py-1 text-xs font-bold text-brand-accent shadow-md"
                >
                  +{lastAddedNotice.quantity} 已加入購物籃
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="rounded-xl border border-border-soft p-2 text-text-primary lg:hidden"
              aria-label="切換選單"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* 手機與平板展開選單 */}
        {mobileMenuOpen && (
          <div className="border-t border-border-soft bg-bg-surface px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              <NavLink
                to="/"
                end
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                品牌首頁
              </NavLink>
              <NavLink
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                產品目錄
              </NavLink>
              <NavLink
                to="/articles"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                毛羽小教室
              </NavLink>
              <NavLink
                to="/stores"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                合作店家
              </NavLink>
              <NavLink
                to="/orders/lookup"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                訂單查詢
              </NavLink>
              {!member && (
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass}
                >
                  會員登入／註冊
                </NavLink>
              )}
              <NavLink
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                {member
                  ? `會員中心（${member.name || "已登入"}）・收藏（${wishlistIds.length}）`
                  : `我的收藏清單（${wishlistIds.length}）`}
              </NavLink>
              <NavLink
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                購物車結帳
              </NavLink>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1 inline-flex items-center gap-2 rounded-lg border border-border-soft bg-bg-card px-3 py-2 text-sm font-medium text-text-secondary"
              >
                <Settings className="h-4 w-4" />
                進入管理後台
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 主要內容區 */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 頁尾 Footer */}
      <footer className="mt-16 border-t border-border-soft bg-bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-primary text-text-on-primary">
                <Bird className="h-5 w-5" />
              </span>
              <span className="text-base font-bold text-text-primary">
                {siteContent.brandName}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {siteContent.brandSlogan}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-primary">
              快速導覽與須知
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <Link to="/products" className="hover:text-brand-accent">
                  所有寵物鳥商品
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-brand-accent">
                  毛羽小教室專欄
                </Link>
              </li>
              <li>
                <Link to="/orders/lookup" className="hover:text-brand-accent">
                  訂單進度查詢
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/shopping"
                  className="hover:text-brand-accent"
                >
                  購物須知與退換貨政策
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/privacy"
                  className="hover:text-brand-accent"
                >
                  隱私權保護條款
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-primary">商家與合作</h3>
            <p className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
              <Store className="h-4 w-4 text-brand-accent" />
              歡迎寵物鳥專門店洽談寄賣與合作
            </p>
            <Link
              to="/admin"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-accent hover:underline"
            >
              <Settings className="h-3.5 w-3.5" />
              品牌後台管理入口
            </Link>
          </div>
        </div>

        <div className="border-t border-border-soft px-4 py-4 text-center text-xs text-text-muted">
          © {CURRENT_YEAR} {siteContent.brandName} Bird Days. 目前為 Mock
          資料展示版（預留 GCP 雲端架構）。
        </div>
      </footer>

      <CartDrawer />

      {/* 飛入購物籃動畫粒子（X/Y 軸獨立 GPU 曲線，無轉折頓點） */}
      {flyingItems.map((dot) => (
        <span
          key={dot.id}
          aria-hidden="true"
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget) {
              removeFlyingItem(dot.id);
            }
          }}
          className="animate-cart-fly-x pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2"
          style={
            {
              left: `${dot.startX}px`,
              top: `${dot.startY}px`,
              "--fly-x": `${dot.flyX}px`,
            } as React.CSSProperties
          }
        >
          <span
            className="animate-cart-fly-y flex h-7 w-7 items-center justify-center rounded-full bg-brand-accent text-text-on-accent shadow-md"
            style={{ "--fly-y": `${dot.flyY}px` } as React.CSSProperties}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </span>
        </span>
      ))}
    </div>
  );
};
