import { getToken } from '@/lib/authStorage';
import type { JsonRecord } from '@/lib/apiTypes';

// Uses Vercel-friendly backend URL.
// - In production you can set VITE_API_BASE_URL to override.
// - Otherwise it defaults to your deployed backend.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://hostelbackend-lake.vercel.app/v1/api';

function withAuthHeaders(headers: Record<string, string> = {}) {
  const token = getToken();
  if (!token) return headers;
  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
}

type RequestOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: withAuthHeaders(options.headers || {
      'Content-Type': 'application/json',
    }),
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  const body: unknown = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      (body && typeof body === 'object' && 'message' in body
        ? String((body as { message?: unknown }).message ?? '')
        : '') || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return body as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, data: JsonRecord) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  patch: <T>(path: string, data: JsonRecord) =>
    request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  postForm: async <T>(path: string, form: FormData) =>
    request<T>(path, {
      method: 'POST',
      body: form,
      headers: {},
    }),
};


