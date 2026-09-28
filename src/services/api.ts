/**
 * MarketLink API client
 * Thin wrapper around fetch for the Express + MongoDB backend in /server.
 * - base URL comes from VITE_API_URL (default http://localhost:5000)
 * - JWT from /api/authlogin is kept in localStorage and sent as a Bearer token
 * - every non-2xx response throws an ApiError carrying the backend's `msg`
 */

export const API_BASE_URL = ((import.meta.env.VITE_API_URL as string) || 'http://localhost:5000').replace(/\/+$/, '');
const API_ROOT = `${API_BASE_URL}/api`;

const TOKEN_KEY = 'marketlink_auth_token';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // storage blocked - session lasts until reload
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  },
};

// called when the backend says the token is no longer valid (expired / account deactivated)
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler;
};

type Body = Record<string, unknown> | FormData | undefined;

async function request<T = any>(method: 'GET' | 'POST', path: string, body?: Body): Promise<T> {
  const headers: Record<string, string> = {};
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body; // browser sets the multipart boundary
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(`${API_ROOT}${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError(`Cannot reach the MarketLink server at ${API_BASE_URL}. Is the backend running?`, 0);
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok || (data && data.success === false)) {
    if (res.status === 401 && token && onUnauthorized) onUnauthorized();
    throw new ApiError((data && data.msg) || `Request failed (${res.status})`, res.status);
  }
  return data as T;
}

export const api = {
  get: <T = any>(path: string) => request<T>('GET', path),
  post: <T = any>(path: string, body?: Body) => request<T>('POST', path, body ?? {}),
};

/** URL of an image uploaded through multer (served by GET /api/images/:name) */
export const imageUrl = (fileName?: string | null): string | undefined =>
  fileName ? `${API_ROOT}/images/${encodeURIComponent(fileName)}` : undefined;

/** Turns a plain object into multipart form data (for routes that accept an image upload) */
export const toFormData = (fields: Record<string, unknown>, file?: File | null): FormData => {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    fd.append(key, String(value));
  });
  if (file) fd.append('image', file);
  return fd;
};

export const errorMessage = (err: unknown, fallback = 'Something went wrong'): string =>
  err instanceof Error && err.message ? err.message : fallback;
