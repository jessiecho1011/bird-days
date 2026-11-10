import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bird,
  BookOpen,
  ClipboardList,
  ExternalLink,
  FileEdit,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Palette,
  Store,
  Tag,
  Truck,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { authService } from '../../services/authService';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { orders, reviews } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = orders.filter((o) => o.status === '待處理').length;
  const pendingReviewsCount = reviews.filter((r) => !r.isApproved).length;

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-primary text-text-on-primary font-semibold shadow-sm'
        : 'text-text-secondary hover:bg-brand-soft hover:text-text-primary'
    }`;

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary lg:flex-row">
      {/* 側邊導覽列（桌機常駐左側；手機／平板收合式頂部列） */}
      <aside className="sticky top-0 z-30 w-full shrink-0 border-b border-border-soft bg-bg-surface px-4 py-3 lg:static lg:w-64 lg:border-b-0 lg:border-r lg:p-4">
        <div className="flex items-center justify-between gap-2 lg:mb-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-text-on-primary lg:h-10 lg:w-10">
              <Bird className="h-5 w-5 lg:h-6 lg:w-6" />
            </span>
            <div className="min-w-0">
              <span className="block truncate text-base font-extrabold text-text-primary">
                好個鳥日子後台
              </span>
              <span className="block truncate text-[11px] font-medium text-text-muted">
                品牌管理中心（Mock）
              </span>
            </div>
          </div>

          {/* 手機／平板操作列 */}
          <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
            <Link
              to="/"
              className="btn-brand-outline inline-flex items-center gap-1 px-2.5 py-1.5 text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">返回前台</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="rounded-xl border border-border-soft bg-bg-card p-2 text-text-primary"
              aria-label="切換後台選單"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* 導覽選單（桌機永遠顯示；手機／平板依 mobileMenuOpen 展開） */}
        <nav
          className={`${
            mobileMenuOpen ? 'mt-3 flex flex-col gap-1 border-t border-border-soft pt-3' : 'hidden'
          } lg:flex lg:flex-col lg:gap-1.5`}
        >
          <NavLink to="/admin/dashboard" onClick={closeMenu} className={navClass}>
            <BarChart3 className="h-4 w-4" />
            營運總覽 Dashboard
          </NavLink>
          <NavLink to="/admin/products" onClick={closeMenu} className={navClass}>
            <Package className="h-4 w-4" />
            商品管理（增刪改）
          </NavLink>
          <NavLink to="/admin/orders" onClick={closeMenu} className={navClass}>
            <ClipboardList className="h-4 w-4" />
            <span className="flex-1">訂單管理</span>
            {pendingCount > 0 && (
              <span className="rounded-full bg-brand-accent px-2 py-0.5 text-[11px] font-bold text-text-on-accent">
                {pendingCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/admin/coupons" onClick={closeMenu} className={navClass}>
            <Tag className="h-4 w-4" />
            優惠券／折扣碼
          </NavLink>
          <NavLink to="/admin/shipping" onClick={closeMenu} className={navClass}>
            <Truck className="h-4 w-4" />
            運費與免運管理
          </NavLink>
          <NavLink to="/admin/articles" onClick={closeMenu} className={navClass}>
            <BookOpen className="h-4 w-4" />
            毛羽小教室專欄
          </NavLink>
          <NavLink to="/admin/reviews" onClick={closeMenu} className={navClass}>
            <MessageSquare className="h-4 w-4" />
            <span className="flex-1">買家評價審核</span>
            {pendingReviewsCount > 0 && (
              <span className="rounded-full bg-brand-accent px-2 py-0.5 text-[11px] font-bold text-text-on-accent">
                {pendingReviewsCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/admin/content" onClick={closeMenu} className={navClass}>
            <FileEdit className="h-4 w-4" />
            品牌文案與法規編輯
          </NavLink>
          <NavLink to="/admin/stores" onClick={closeMenu} className={navClass}>
            <Store className="h-4 w-4" />
            合作店家管理
          </NavLink>
          <NavLink to="/admin/settings" onClick={closeMenu} className={navClass}>
            <Palette className="h-4 w-4" />
            色彩 Key 與資料備份
          </NavLink>

          {/* 手機／平板展開時顯示的登出與回前台 */}
          <div className="mt-2 flex items-center gap-2 border-t border-border-soft pt-3 lg:hidden">
            <Link
              to="/"
              onClick={closeMenu}
              className="btn-brand-outline flex flex-1 items-center justify-center gap-1.5 py-2 text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              返回前台預覽
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border-soft py-2 text-xs font-medium text-status-danger hover:bg-status-danger-bg"
            >
              <LogOut className="h-3.5 w-3.5" />
              登出後台
            </button>
          </div>
        </nav>

        <div className="mt-6 hidden space-y-2 border-t border-border-soft pt-5 lg:block">
          <Link
            to="/"
            className="btn-brand-outline flex w-full items-center justify-center gap-2 py-2 text-xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            返回品牌前台預覽
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-text-muted hover:bg-status-danger-bg hover:text-status-danger"
          >
            <LogOut className="h-3.5 w-3.5" />
            登出後台
          </button>
        </div>
      </aside>

      {/* 右側內容區 */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
