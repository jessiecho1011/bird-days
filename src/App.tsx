import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { StorefrontLayout } from './components/layout/StorefrontLayout';
import { CartProvider } from './context/CartContext';
import { DataProvider } from './context/DataContext';
import { AdminArticlesPage } from './pages/admin/AdminArticlesPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminShippingPage } from './pages/admin/AdminShippingPage';
import { AdminStoresPage } from './pages/admin/AdminStoresPage';
import { AccountPage } from './pages/storefront/AccountPage';
import { ArticleDetailPage } from './pages/storefront/ArticleDetailPage';
import { ArticlesPage } from './pages/storefront/ArticlesPage';
import { CartPage } from './pages/storefront/CartPage';
import { HomePage } from './pages/storefront/HomePage';
import { MemberAuthPage } from './pages/storefront/MemberAuthPage';
import { MockPaymentPage } from './pages/storefront/MockPaymentPage';
import { OrderLookupPage } from './pages/storefront/OrderLookupPage';
import { PolicyPage } from './pages/storefront/PolicyPage';
import { ProductDetailPage } from './pages/storefront/ProductDetailPage';
import { ProductsPage } from './pages/storefront/ProductsPage';
import { StoresPage } from './pages/storefront/StoresPage';
import { authService } from './services/authService';

const RequireAdminAuth: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export function App() {
  return (
    <DataProvider>
      <CartProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            {/* 前台路由 */}
            <Route path="/" element={<StorefrontLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="articles" element={<ArticlesPage />} />
              <Route path="articles/:id" element={<ArticleDetailPage />} />
              <Route path="stores" element={<StoresPage />} />
              <Route path="orders/lookup" element={<OrderLookupPage />} />
              <Route path="login" element={<MemberAuthPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="policies/:type" element={<PolicyPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout/payment/:orderId" element={<MockPaymentPage />} />
            </Route>

            {/* 後台登入 */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* 後台管理路由（受 Mock 密碼登入保護） */}
            <Route
              path="/admin"
              element={
                <RequireAdminAuth>
                  <AdminLayout />
                </RequireAdminAuth>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="coupons" element={<AdminCouponsPage />} />
              <Route path="shipping" element={<AdminShippingPage />} />
              <Route path="articles" element={<AdminArticlesPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="content" element={<AdminContentPage />} />
              <Route path="stores" element={<AdminStoresPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* 找不到頁面時導回首頁 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </DataProvider>
  );
}

export default App;
