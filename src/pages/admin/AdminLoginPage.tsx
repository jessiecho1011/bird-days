import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bird, Lock } from 'lucide-react';
import { authService, MOCK_ADMIN_PASSWORD } from '../../services/authService';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (authService.isAuthenticated()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authService.login(password)) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('密碼不正確，請確認後再試。');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-surface px-4 py-12">
      <div className="card-warm w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-text-on-primary shadow-sm">
            <Bird className="h-8 w-8" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-text-primary">
            好個鳥日子・後台登入
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            請輸入管理密碼以進入商品與品牌內容管理
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
              管理員密碼
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="請輸入密碼"
                className="input-warm w-full pl-9 text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-status-danger-bg px-3.5 py-2.5 text-xs font-medium text-status-danger">
              {error}
            </div>
          )}

          <button type="submit" className="btn-brand-primary w-full py-3 text-sm">
            登入管理後台
          </button>
        </form>

        {/* 開發階段提示框 */}
        <div className="mt-5 rounded-xl border border-border-soft bg-brand-soft p-3.5 text-xs text-text-primary">
          <p className="font-semibold">開發測試提示（Mock Auth）：</p>
          <p className="mt-1 text-text-secondary">
            目前預設管理密碼為：
            <code className="mx-1 rounded bg-bg-card px-1.5 py-0.5 font-bold text-brand-accent">
              {MOCK_ADMIN_PASSWORD}
            </code>
          </p>
          <button
            type="button"
            onClick={() => {
              setPassword(MOCK_ADMIN_PASSWORD);
              setError('');
            }}
            className="mt-2 font-semibold text-brand-accent hover:underline"
          >
            一鍵帶入測試密碼
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-brand-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回「好個鳥日子」前台首頁
          </Link>
        </div>
      </div>
    </div>
  );
};

