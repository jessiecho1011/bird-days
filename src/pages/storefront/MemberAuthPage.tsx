import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bird,
  CheckCircle2,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateVerifyCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export const MemberAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';
  const fromCheckout = redirectPath === '/cart';

  const {
    member,
    checkEmailRegistered,
    loginWithEmailPassword,
    registerWithEmailPassword,
  } = useData();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'credentials' | 'verify_email'>('credentials');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');

  if (member) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError('請輸入正確的 Email 格式（例如：bird@example.com）');
      return;
    }
    if (password.length < 6) {
      setError('密碼長度至少需 6 個字元');
      return;
    }

    // 判斷此 Email 是否已註冊：已註冊 -> 走登入；未註冊 -> 走註冊＋Email 驗證流程
    if (checkEmailRegistered(normalizedEmail)) {
      const result = loginWithEmailPassword(normalizedEmail, password);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      navigate(redirectPath, { replace: true });
      return;
    }

    // TODO: 未來串接 GCP Firebase Auth / SendGrid 寄送真實 Email 驗證信或驗證連結
    const code = generateVerifyCode();
    setGeneratedCode(code);
    setCodeInput('');
    setStep('verify_email');
  };

  const handleResendCode = () => {
    const code = generateVerifyCode();
    setGeneratedCode(code);
    setCodeInput('');
    setError('');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (codeInput.trim() !== generatedCode) {
      setError('Email 驗證碼不正確，請確認後再試。');
      return;
    }

    registerWithEmailPassword(email.trim().toLowerCase(), password);
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="card-warm p-7 sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-text-on-primary shadow-sm">
            <Bird className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-text-primary">
            {step === 'credentials' ? '鳥友會員登入／註冊' : '驗證您的 Email'}
          </h1>
          <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
            {fromCheckout && step === 'credentials'
              ? '請先登入或完成快速註冊，即可繼續填寫配送地址／超商並結帳！'
              : step === 'credentials'
                ? '輸入 Email 與密碼即可登入；若為新 Email 將自動進入驗證註冊流程。'
                : `此 Email 尚未註冊，我們已發送驗證碼至 ${email.trim().toLowerCase()}`}
          </p>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                電子信箱 (Email) *
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="name@example.com"
                  className="input-warm w-full pl-9 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                密碼（至少 6 碼）*
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  required
                  minLength={6}
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
              登入 / 新帳號驗證註冊
            </button>

            {/* 開發測試帳號提示 */}
            <div className="rounded-xl border border-border-soft bg-brand-soft p-3.5 text-xs text-text-primary">
              <p className="font-semibold">測試說明（Mock 會員系統）：</p>
              <p className="mt-1 text-text-secondary">
                • 既有帳號測試：<code>birdlover@example.com</code> / 密碼{' '}
                <code>password123</code>
                <br />• 若輸入任何未註冊的新 Email，將自動引導進入「Email 驗證註冊」流程。
              </p>
              <button
                type="button"
                onClick={() => {
                  setEmail('birdlover@example.com');
                  setPassword('password123');
                  setError('');
                }}
                className="mt-2 font-semibold text-brand-accent hover:underline"
              >
                一鍵帶入既有帳號測試
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            {/* Mock 模擬收信顯示區 */}
            <div className="rounded-xl border border-border-soft bg-brand-soft p-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-text-primary">
                <CheckCircle2 className="h-4 w-4 text-status-success" />
                模擬 Email 驗證信已寄出
              </div>
              <p className="mt-1 text-text-secondary">
                （正式上線時將透過 GCP / 郵件服務發送真實驗證信）
                <br />
                您的 6 位數驗證碼為：
                <code className="ml-1 rounded bg-bg-card px-2 py-0.5 text-sm font-extrabold tracking-widest text-brand-accent">
                  {generatedCode}
                </code>
              </p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCodeInput(generatedCode);
                    setError('');
                  }}
                  className="font-semibold text-brand-accent hover:underline"
                >
                  一鍵填入驗證碼
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary"
                >
                  <RefreshCw className="h-3 w-3" />
                  重新發送
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                輸入 6 位數 Email 驗證碼 *
              </label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                    setError('');
                  }}
                  placeholder="請輸入 6 位數驗證碼"
                  className="input-warm w-full pl-9 text-sm tracking-widest"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-status-danger-bg px-3.5 py-2.5 text-xs font-medium text-status-danger">
                {error}
              </div>
            )}

            <button type="submit" className="btn-brand-primary w-full py-3 text-sm">
              驗證 Email 並完成註冊
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('credentials');
                setError('');
              }}
              className="btn-brand-outline w-full py-2.5 text-xs"
            >
              返回修改 Email 或密碼
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-brand-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            先繼續逛逛商品（不需登入）
          </Link>
        </div>
      </div>
    </div>
  );
};

