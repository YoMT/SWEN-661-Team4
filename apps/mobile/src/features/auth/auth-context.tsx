import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { User } from '@/features/auth/user';
import { TIMINGS } from '@/constants/timings';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await new Promise((r) => setTimeout(r, TIMINGS.AUTH_DELAY_MS));
      setUser({ id: '1', name: 'Caregiver', email, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    } catch {
      setErrorMessage('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, _password: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await new Promise((r) => setTimeout(r, TIMINGS.AUTH_DELAY_MS));
      setUser({ id: '1', name, email, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    } catch {
      setErrorMessage('Could not create account.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setErrorMessage(null);
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
