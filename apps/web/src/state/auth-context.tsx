import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import type { User } from '@renderer/types'
import { api, setAuthToken, registerUnauthorizedHandler } from '@renderer/services/api'

// Desktop uses the renderer's localStorage for token persistence
// (the mobile app used expo-secure-store).
const TOKEN_KEY = 'auth_token'

const saveStoredToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token)
const deleteStoredToken = (): void => localStorage.removeItem(TOKEN_KEY)

interface AuthState {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  errorMessage: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  // Cold-started sessions always start logged out (`user` null) on the landing
  // page, and there is no async session restore, so nothing is "loading" up
  // front — login()/signup() flip isLoading around their own requests.
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Discard any persisted token rather than restoring it (side effect only —
  // the logged-out state above is already the initial render).
  useEffect(() => {
    setAuthToken(null)
    deleteStoredToken()
  }, [])

  const logout = useCallback(async () => {
    setAuthToken(null)
    deleteStoredToken()
    setUser(null)
    setErrorMessage(null)
  }, [])

  // Auto-logout on 401. `logout` is a stable (empty-dep) callback, so this
  // registers once and always invokes the current handler.
  useEffect(() => {
    registerUnauthorizedHandler(() => logout())
    return () => registerUnauthorizedHandler(null)
  }, [logout])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const { token, user: me } = await api.post<{ token: string; user: User }>('/auth/login', {
        email,
        password
      })
      setAuthToken(token)
      saveStoredToken(token)
      setUser(me)
    } catch {
      setErrorMessage('Invalid email or password.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const { token, user: me } = await api.post<{ token: string; user: User }>('/auth/signup', {
        name,
        email,
        password
      })
      setAuthToken(token)
      saveStoredToken(token)
      setUser(me)
    } catch {
      setErrorMessage('Could not create account.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: user !== null,
      isLoading,
      errorMessage,
      login,
      signup,
      logout
    }),
    [user, isLoading, errorMessage, login, signup, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
