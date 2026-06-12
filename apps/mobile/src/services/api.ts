const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

let _token: string | null = null;
let _onError: ((msg: string) => void) | null = null;
let _onUnauthorized: (() => void) | null = null;

export const setAuthToken = (t: string | null) => { _token = t; };
export const registerErrorHandler = (fn: ((msg: string) => void) | null) => { _onError = fn; };
export const registerUnauthorizedHandler = (fn: (() => void) | null) => { _onUnauthorized = fn; };

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function request<T>(path: string, method: Method = 'GET', body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(_token ? { Authorization: `Bearer ${_token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401) _onUnauthorized?.();
    const msg = `Request failed (${res.status})`;
    _onError?.(msg);
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string) => request<T>(path, 'GET'),
  post:   <T>(path: string, body: unknown) => request<T>(path, 'POST', body),
  patch:  <T>(path: string, body: unknown) => request<T>(path, 'PATCH', body),
  delete: <T>(path: string) => request<T>(path, 'DELETE'),
};
