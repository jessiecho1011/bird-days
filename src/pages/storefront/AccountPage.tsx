import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Heart,
  LogIn,
  LogOut,
  ShoppingBag,
  Trash2,
  User,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';

export const AccountPage: React.FC = () => {
  const {
    products,
    wishlistIds,
    toggleWishlist,
    member,
    updateMemberProfile,
    logoutMember,
    orders,
  } = useData();
  const { addToCart } = useCart();

  const [name, setName] = useState(member?.name || '');
  const [phone, setPhone] = useState(member?.phone || '');
  const [defaultAddress, setDefaultAddress] = useState(member?.defaultAddress || '');
  const [birdNames, setBirdNames] = useState(member?.birdNames || '');
  const [savedToast, setSavedToast] = useState(false);

  const wishlistedProducts = products.filter(
    (p) => p.isActive && wishlistIds.includes(p.id)
  );

  const memberOrders = member
    ? orders.filter(
        (o) =>
          o.email.toLowerCase() === member.email.toLowerCase() ||
          (member.phone &&
            o.phone.replace(/[-\s]/g, '') === member.phone.replace(/[-\s]/g, ''))
      )
    : [];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateMemberProfile({
      name: name.trim(),
      phone: phone.trim(),
      defaultAddress: defaultAddress.trim(),
      birdNames: birdNames.trim(),
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="text-xs font-bold tracking-wider text-brand-accent">
          MEMBER & WISHLIST
        </span>
        <h1 className="mt-1 text-3xl font-extrabold text-text-primary">
          鳥友會員與我的收藏清單
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          瀏覽商品與收藏好物無需登入；結帳與發表評價前需登入鳥友會員。
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 左側會員卡片 */}
        <section className="card-warm h-fit p-6">
          {!member ? (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-accent">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">尚未登入會員</h2>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  只需 Email 與密碼即可登入或快速驗證註冊，管理常用收件資料與歷史訂單。
                </p>
              </div>
              <Link
                to="/login?redirect=/account"
                className="btn-brand-primary inline-flex w-full items-center justify-center gap-2 py-2.5 text-sm"
              >
                <LogIn className="h-4 w-4" />
                前往會員登入／註冊
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-brand-accent" />
                  <h2 className="text-base font-bold text-text-primary">
                    你好，{member.name || '鳥友'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={logoutMember}
                  className="inline-flex items-center gap-1 text-xs font-medium text-text-muted hover:text-status-danger"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  登出
                </button>
              </div>

              <div className="mb-4 rounded-xl bg-bg-surface px-3 py-2 text-xs">
                <p className="text-text-muted">登入信箱：</p>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="truncate font-semibold text-text-primary">
                    {member.email}
                  </span>
                  {member.emailVerified && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-status-success">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      已驗證
                    </span>
                  )}
                </div>
              </div>

              {savedToast && (
                <div className="mb-3 rounded-lg bg-status-success-bg px-3 py-2 text-xs font-medium text-status-success">
                  已更新會員資料！
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-text-secondary">
                    預設收件稱呼
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="選填，結帳時會自動帶入"
                    className="input-warm w-full text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-text-secondary">
                    聯絡手機
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="選填，結帳時會自動帶入"
                    className="input-warm w-full text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-text-secondary">
                    常用配送地址
                  </label>
                  <input
                    type="text"
                    value={defaultAddress}
                    onChange={(e) => setDefaultAddress(e.target.value)}
                    placeholder="選填，結帳時也可填寫或選超商"
                    className="input-warm w-full text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-text-secondary">
                    家中鳥寶名字與品種
                  </label>
                  <input
                    type="text"
                    value={birdNames}
                    onChange={(e) => setBirdNames(e.target.value)}
                    placeholder="例如：玄鳳「布丁」"
                    className="input-warm w-full text-sm"
                  />
                </div>

                <button type="submit" className="btn-brand-primary w-full py-2.5 text-sm">
                  儲存會員備忘資料
                </button>
              </form>
            </div>
          )}
        </section>

        {/* 右側收藏清單與歷史訂單 */}
        <div className="space-y-8 lg:col-span-2">
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 fill-brand-accent text-brand-accent" />
              <h2 className="text-xl font-extrabold text-text-primary">
                我的常買收藏清單（{wishlistedProducts.length}）
              </h2>
            </div>

            {wishlistedProducts.length === 0 ? (
              <div className="surface-warm p-8 text-center">
                <p className="text-sm font-semibold text-text-primary">
                  尚未收藏任何商品
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  逛商品時點擊愛心圖示，就可以存起來方便下次快速回購！
                </p>
                <Link
                  to="/products"
                  className="btn-brand-primary mt-4 inline-block px-5 py-2 text-xs"
                >
                  逛逛商品目錄
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {wishlistedProducts.map((product) => (
                  <div key={product.id} className="card-warm flex gap-3 p-3.5">
                    <Link
                      to={`/products/${product.id}`}
                      className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-bg-surface"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/products/${product.id}`}
                          className="line-clamp-2 text-sm font-bold text-text-primary hover:text-brand-accent"
                        >
                          {product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          className="p-1 text-text-muted hover:text-status-danger"
                          title="移除收藏"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-brand-accent">
                          NT$ {product.price.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => addToCart(product.id, 1, e.currentTarget)}
                          className="btn-brand-primary inline-flex items-center gap-1 px-3 py-1.5 text-xs"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          加入
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {member && (
            <section>
              <h2 className="mb-4 text-xl font-extrabold text-text-primary">
                我的歷史訂單（{memberOrders.length}）
              </h2>
              {memberOrders.length === 0 ? (
                <div className="surface-warm p-6 text-sm text-text-muted">
                  目前尚無符合您信箱或手機的訂單紀錄。
                </div>
              ) : (
                <div className="space-y-3">
                  {memberOrders.map((ord) => (
                    <div key={ord.id} className="card-warm p-4 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-brand-accent">{ord.id}</span>
                        <div className="flex items-center gap-2">
                          <span className="badge-warm">{ord.status}</span>
                          <span className="text-xs text-text-muted">
                            {new Date(ord.createdAt).toLocaleDateString('zh-TW')}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-text-secondary">
                        共 {ord.items.reduce((s, i) => s + i.quantity, 0)} 件商品 ｜ 實付 NT${' '}
                        {ord.totalAmount.toLocaleString()}（{ord.paymentStatus}）
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
