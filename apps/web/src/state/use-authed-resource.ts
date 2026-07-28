import { useCallback, useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { api } from '@renderer/services/api'
import { useAuthContext } from '@renderer/state/auth-context'
import { useRefreshContext } from '@renderer/state/refresh-context'

export interface AuthedResource<T> {
  data: T
  isLoading: boolean
  error: string | null
  /** Replace the loaded data — for optimistic mutations. Same shape as a useState setter. */
  setData: Dispatch<SetStateAction<T>>
}

interface Loaded<T> {
  /** Identity of the data currently held (see `keyFor`). */
  key: string
  data: T
  error: string | null
}

/** A load is needed on login/logout and on every manual refresh. */
const keyFor = (isLoggedIn: boolean, refreshKey: number): string =>
  isLoggedIn ? `auth:${refreshKey}` : 'anon'

/**
 * Loads a protected resource from `path` and exposes it with loading/error
 * state. Refetches whenever the session or the global refresh key changes.
 * Fetching runs only while authenticated — logged-out consumers see `emptyValue`
 * and no request fires (the pre-auth pages must not 401).
 *
 * Every state transition happens inside the fetch's async callbacks; nothing is
 * set synchronously in the effect. Loading and the logged-out reset are
 * *derived* from whether the held data matches the key we should be showing, so
 * the effect stays a pure external-sync with no cascading renders.
 *
 * Pass a *stable* `emptyValue` (a primitive, or a module-level constant for
 * arrays/objects) — it's returned by identity while logged out or loading.
 */
export function useAuthedResource<T>(
  path: string,
  emptyValue: T,
  errorMessage: string
): AuthedResource<T> {
  const { isLoggedIn } = useAuthContext()
  const { refreshKey } = useRefreshContext()

  const key = keyFor(isLoggedIn, refreshKey)
  const [loaded, setLoaded] = useState<Loaded<T>>(() => ({
    key: isLoggedIn ? '' : keyFor(false, refreshKey),
    data: emptyValue,
    error: null
  }))

  useEffect(() => {
    if (!isLoggedIn) return
    let active = true
    api
      .get<T>(path)
      .then((data) => {
        if (active) setLoaded({ key, data, error: null })
      })
      .catch(() => {
        if (active) setLoaded((prev) => ({ key, data: prev.data, error: errorMessage }))
      })
    return () => {
      active = false
    }
  }, [isLoggedIn, key, path, errorMessage])

  const setData = useCallback<Dispatch<SetStateAction<T>>>((update) => {
    setLoaded((prev) => ({
      ...prev,
      data: typeof update === 'function' ? (update as (prev: T) => T)(prev.data) : update
    }))
  }, [])

  const settled = isLoggedIn && loaded.key === key
  return {
    data: settled ? loaded.data : emptyValue,
    isLoading: isLoggedIn && loaded.key !== key,
    error: settled ? loaded.error : null,
    setData
  }
}
