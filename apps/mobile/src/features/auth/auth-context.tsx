import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import type { User } from '@/features/auth/user';
import { api, setAuthToken, registerUnauthorizedHandler } from '@/services/api';

const TOKEN_KEY = 'auth_token';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Restore session on cold start
  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          setAuthToken(token);
          const me = await api.get<User>('/auth/me');
          setUser(me);
        }
      } catch {
        setAuthToken(null);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const logout = useCallback(async () => {
    setAuthToken(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setUser(null);
    setErrorMessage(null);
  }, []);

  // Auto-logout on 401
  useEffect(() => {
    registerUnauthorizedHandler(logout);
    return () => registerUnauthorizedHandler(null);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { token, user: me } = await api.post<{ token: string; user: User }>(
        '/auth/login', { email, password },
      );
      setAuthToken(token);
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      setUser(me);
    } catch {
      setErrorMessage('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { token, user: me } = await api.post<{ token: string; user: User }>(
        '/auth/signup', { name, email, password },
      );
      setAuthToken(token);
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      setUser(me);
    } catch {
      setErrorMessage('Could not create account.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoggedIn: user !== null, isLoading, errorMessage, login, signup, logout }),
    [user, isLoading, errorMessage, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
