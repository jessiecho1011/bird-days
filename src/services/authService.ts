/**
 * 後台簡易 Mock 密碼驗證服務
 * 未來架設 GCP 時，可替換為 Firebase Authentication / Identity Platform / 後端 JWT 驗證。
 */
const AUTH_SESSION_KEY = 'birddays_admin_authenticated_v1';

// 開發階段預設密碼（可在環境變數 VITE_ADMIN_PASSWORD 覆寫，或未來改為後端驗證）
export const MOCK_ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD || 'birddays2026';

export const authService = {
  isAuthenticated(): boolean {
    try {
      return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  },

  login(password: string): boolean {
    if (password.trim() === MOCK_ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      return true;
    }
    return false;
  },

  logout(): void {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  },
};

