import type { MemberAccount } from '../types';

/**
 * 預設 Mock 已註冊會員帳號清單
 * 未來串接 GCP Firebase Auth / Identity Platform 時可改由後端與雲端認證接管。
 */
export const INITIAL_MOCK_ACCOUNTS: MemberAccount[] = [
  {
    id: 'mem-demo-1',
    email: 'birdlover@example.com',
    password: 'password123',
    emailVerified: true,
    name: '林羽晴',
    phone: '0912-345-678',
    defaultAddress: '',
    birdNames: '玄鳳「麻糬」',
    createdAt: '2026-11-01T08:00:00.000Z',
  },
];

