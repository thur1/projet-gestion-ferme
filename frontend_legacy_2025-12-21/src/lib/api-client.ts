/**
 * API Service - Centralized HTTP Client (Django JWT)
 */

import { env } from '@/config/env';
import { getAccessToken } from './auth';

const API_BASE_URL = env.apiUrl || 'http://127.0.0.1:8000/api/';

class APIError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(
    status: number,
    statusText: string,
    message: string,
  ) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.statusText = statusText;
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new APIError(
      response.status,
      response.statusText,
      error.error || 'Une erreur est survenue',
    );
  }

  return response.json();
}

// HTTP Methods
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetchAPI<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data: unknown, options?: RequestInit) =>
    fetchAPI<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown, options?: RequestInit) =>
    fetchAPI<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchAPI<T>(endpoint, { ...options, method: 'DELETE' }),

  patch: <T>(endpoint: string, data: unknown, options?: RequestInit) =>
    fetchAPI<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export { APIError };
