import { STORAGE_KEYS } from '@/config/constants';

export type StoredUser = {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
};

const ACCESS_TOKEN_KEY = STORAGE_KEYS.auth.token;
const REFRESH_TOKEN_KEY = STORAGE_KEYS.auth.session;
const USER_KEY = STORAGE_KEYS.auth.user;

export function saveSession(params: {
  access?: string;
  refresh?: string;
  user?: StoredUser | null;
}): void {
  const { access, refresh, user } = params;
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch (error) {
    console.warn('Failed to parse stored user', error);
    return null;
  }
}
