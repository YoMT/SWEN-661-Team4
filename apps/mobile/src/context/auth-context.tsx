import React, { createContext, useContext, useState } from 'react';
import type { User } from '@/models/user';

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

  async function login(email: string, _password: string) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setUser({
        id: '1',
        name: 'Caregiver',
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch {
      setErrorMessage('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  }

  async function signup(name: string, email: string, _password: string) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setUser({
        id: '1',
        name,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch {
      setErrorMessage('Could not create account.');
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setErrorMessage(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: user !== null, isLoading, errorMessage, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
