// Thin API client. On desktop we always use the in-memory mock backend
// (no EXPO_PUBLIC_API_URL equivalent), but the real-fetch branch is kept so a
// live backend can be dropped in later via VITE_API_URL.
import { mockRequest } from './mock-api'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''
const USE_MOCK = !BASE_URL || BASE_URL.includes('example.com')

let _token: string | null = null
let _onError: ((msg: string) => void) | null = null
let _onUnauthorized: (() => void) | null = null

export const setAuthToken = (t: string | null): void => {
  _token = t
}
export const registerErrorHandler = (fn: ((msg: string) => void) | null): void => {
  _onError = fn
}
export const registerUnauthorizedHandler = (fn: (() => void) | null): void => {
  _onUnauthorized = fn
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

async function request<T>(path: string, method: Method = 'GET', body?: unknown): Promise<T> {
  if (USE_MOCK) {
    try {
      return mockRequest<T>(method, path, body)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Request failed'
      _onError?.(msg)
      throw err
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(_token ? { Authorization: `Bearer ${_token}` } : {})
    },
    body: body !== undefined ? JSON.stringify(body) : undefined
  })

  if (!res.ok) {
    if (res.status === 401) _onUnauthorized?.()
    const msg = `Request failed (${res.status})`
    _onError?.(msg)
    throw new Error(msg)
  }

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path, 'GET'),
  post: <T>(path: string, body: unknown) => request<T>(path, 'POST', body),
  patch: <T>(path: string, body: unknown) => request<T>(path, 'PATCH', body),
  delete: <T>(path: string) => request<T>(path, 'DELETE')
}
