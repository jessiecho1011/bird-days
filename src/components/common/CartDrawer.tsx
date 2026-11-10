import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';

export const CartDrawer: React.FC = () => {
  const { shippingConfig, member } = useData();
  const {
    hydratedItems,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalCount,
  } = useCart();

  if (!isDrawerOpen) return null;

  const { baseFee, enableFreeShipping, freeShippingThreshold } = shippingConfig;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* 半透明遮罩 */}
      <div
        className="fixed inset-0 bg-bg-dark/45 backdrop-blur-[2px]"
        onClick={closeDrawer}
      />

      {/* 抽屜主體 */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-bg-base shadow-2xl border-l border-border-soft">
        <div className="flex items-center justify-between border-b border-border-soft bg-bg-surface px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-brand-accent" />
            <h2 className="text-lg font-bold text-text-primary">
              購物籃（{totalCount}）
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-brand-soft"
            aria-label="關閉購物車"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 免運進度提示 */}
        <div className="border-b border-border-soft bg-brand-soft px-5 py-2.5 text-xs font-medium text-text-primary">
          {enableFreeShipping ? (
            remainingForFreeShipping > 0 ? (
              <span>
                再買{' '}
                <strong className="text-brand-accent">
                  NT$ {remainingForFreeShipping.toLocaleString()}
                </strong>{' '}
                即可享有全館免運優惠（門檻 NT$ {freeShippingThreshold.toLocaleString()}）！
              </span>
            ) : (
              <span className="text-status-success font-semibold">
                已達 NT$ {freeShippingThreshold.toLocaleString()} 免運門檻！
              </span>
            )
          ) : (
            <span>目前全館基本運費為 NT$ {baseFee.toLocaleString()}</span>
          )}
        </div>

        {/* 商品列表 */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {hydratedItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-bg-surface text-brand-accent">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="text-base font-semibold text-text-primary">
                購物籃目前空空的
              </p>
              <p className="mt-1 text-sm text-text-muted">
                快去為家裡的鳥寶挑選天然美食或啃咬玩具吧！
              </p>
              <Link
                to="/products"
                onClick={closeDrawer}
                className="btn-brand-primary mt-5 inline-flex items-center px-5 py-2.5 text-sm"
              >
                逛逛產品目錄
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {hydratedItems.map(({ itemKey, product, variant, quantity, lineTotal }) => (
                <li
                  key={itemKey}
                  className="card-warm flex gap-3 p-3"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-20 w-20 shrink-0 rounded-xl border border-border-soft object-cover bg-bg-surface"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to={`/products/${product.id}`}
                          onClick={closeDrawer}
                          className="line-clamp-2 text-sm font-semibold text-text-primary hover:text-brand-accent"
                        >
                          {product.name}
                        </Link>
                        {variant && (
                          <span className="mt-0.5 inline-block text-[11px] font-medium text-text-muted">
                            規格：{variant.label}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id, variant?.id)}
                        className="text-text-muted hover:text-status-danger p-1"
                        title="移除商品"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-lg border border-border-soft bg-bg-surface">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1, variant?.id)}
                          className="p-1.5 text-text-secondary hover:text-text-primary"
                          aria-label="減少數量"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[2rem] text-center text-xs font-semibold text-text-primary">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1, variant?.id)}
                          className="p-1.5 text-text-secondary hover:text-text-primary"
                          aria-label="增加數量"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-brand-accent">
                        NT$ {lineTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 底部結帳區 */}
        {hydratedItems.length > 0 && (
          <div className="border-t border-border-soft bg-bg-surface px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-text-secondary">商品小計</span>
              <span className="text-lg font-bold text-text-primary">
                NT$ {subtotal.toLocaleString()}
              </span>
            </div>
            <Link
              to={member ? '/cart' : '/login?redirect=/cart'}
              onClick={closeDrawer}
              className="btn-brand-primary flex w-full items-center justify-center py-3 text-sm"
            >
              {member ? '前往購物車與結帳' : '前往結帳（需登入會員）'}
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
};

