import { API_CONFIG } from '../config';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  authToken?: string;
}

export interface ApiError extends Error {
  status?: number;
  payload?: unknown;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
};

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const base = API_CONFIG.baseUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const url = `${base}/${cleanPath}`;
    const headers: Record<string, string> = { ...defaultHeaders, ...options.headers };

    const token = options.authToken || localStorage.getItem('auth_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal || controller.signal,
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await res.json().catch(() => undefined) : undefined;

    if (!res.ok) {
      const err: ApiError = new Error('API error');
      err.status = res.status;
      err.payload = payload;
      throw err;
    }

    return (payload as T) ?? (undefined as unknown as T);
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  get: <T>(path: string, opts: ApiRequestOptions = {}) => apiFetch<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts: ApiRequestOptions = {}) => apiFetch<T>(path, { ...opts, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, opts: ApiRequestOptions = {}) => apiFetch<T>(path, { ...opts, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, opts: ApiRequestOptions = {}) => apiFetch<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts: ApiRequestOptions = {}) => apiFetch<T>(path, { ...opts, method: 'DELETE' }),
};
