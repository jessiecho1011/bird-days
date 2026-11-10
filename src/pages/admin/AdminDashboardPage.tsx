import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  DollarSign,
  Package,
  TrendingUp,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminDashboardPage: React.FC = () => {
  const { orders, products, reviews } = useData();

  const stats = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== '已取消');
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingCount = orders.filter((o) => o.status === '待處理').length;
    const shippingCount = orders.filter((o) => o.status === '備貨中').length;

    // 統計熱銷商品
    const salesMap = new Map<string, { name: string; qty: number; revenue: number }>();
    for (const order of validOrders) {
      for (const item of order.items) {
        const prev = salesMap.get(item.productId) || {
          name: item.name,
          qty: 0,
          revenue: 0,
        };
        salesMap.set(item.productId, {
          name: item.name,
          qty: prev.qty + item.quantity,
          revenue: prev.revenue + item.price * item.quantity,
        });
      }
    }
    const topProducts = Array.from(salesMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // 低庫存警示（<= 5 件）
    const lowStockProducts = products.filter((p) => {
      if (p.variants && p.variants.length > 0) {
        return p.variants.some((v) => v.stock <= 5);
      }
      return p.stock <= 5;
    });

    return {
      totalRevenue,
      validOrderCount: validOrders.length,
      pendingCount,
      shippingCount,
      topProducts,
      lowStockProducts,
    };
  }, [orders, products]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-text-primary">營運總覽 Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          即時掌握「好個鳥日子」銷售業績、待處理訂單與商品庫存警示
        </p>
      </div>

      {/* 核心指標卡片 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-warm p-5">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold">有效累計營業額</span>
            <DollarSign className="h-4 w-4 text-brand-accent" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-brand-accent">
            NT$ {stats.totalRevenue.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            共 {stats.validOrderCount} 筆有效訂單
          </p>
        </div>

        <div className="card-warm p-5">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold">待處理訂單</span>
            <ClipboardList className="h-4 w-4 text-brand-accent" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-text-primary">
            {stats.pendingCount} 筆
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            另有 {stats.shippingCount} 筆備貨中
          </p>
        </div>

        <div className="card-warm p-5">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold">低庫存警示商品</span>
            <AlertTriangle className="h-4 w-4 text-status-warning" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-status-warning">
            {stats.lowStockProducts.length} 項
          </p>
          <p className="mt-1 text-[11px] text-text-muted">庫存少於或等於 5 件</p>
        </div>

        <div className="card-warm p-5">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold">上架商品與評價</span>
            <Package className="h-4 w-4 text-brand-accent" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-text-primary">
            {products.filter((p) => p.isActive).length} 項
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            累計 {reviews.length} 則鳥友實測評價
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 低庫存警示列表 */}
        <section className="card-warm p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-text-primary">
              <AlertTriangle className="h-4 w-4 text-status-warning" />
              低庫存補貨提醒
            </h2>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-accent hover:underline"
            >
              前往補貨
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stats.lowStockProducts.length === 0 ? (
            <p className="rounded-xl bg-bg-surface p-4 text-sm text-text-muted">
              目前所有商品庫存充足！
            </p>
          ) : (
            <ul className="space-y-2.5">
              {stats.lowStockProducts.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col gap-1 rounded-xl border border-border-soft bg-status-warning-bg px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-semibold text-text-primary">{p.name}</span>
                  <span className="shrink-0 font-bold text-status-warning">
                    剩餘 {p.stock} 件
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 熱銷商品排行 */}
        <section className="card-warm p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-text-primary">
              <TrendingUp className="h-4 w-4 text-brand-accent" />
              熱銷商品排行
            </h2>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-accent hover:underline"
            >
              檢視訂單明細
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stats.topProducts.length === 0 ? (
            <p className="rounded-xl bg-bg-surface p-4 text-sm text-text-muted">
              尚無銷售紀錄
            </p>
          ) : (
            <ul className="space-y-2.5">
              {stats.topProducts.map((item, idx) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-1.5 rounded-xl border border-border-soft bg-bg-surface px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-extrabold text-text-on-primary">
                      {idx + 1}
                    </span>
                    <span className="truncate font-semibold text-text-primary">
                      {item.name}
                    </span>
                  </div>
                  <span className="shrink-0 pl-8 text-xs font-bold text-brand-accent sm:pl-0">
                    售出 {item.qty} 件（NT$ {item.revenue.toLocaleString()}）
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

