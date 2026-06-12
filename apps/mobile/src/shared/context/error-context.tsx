import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { registerErrorHandler } from '@/services/api';

interface ErrorState {
  errors: string[];
  pushError: (msg: string) => void;
  dismissError: () => void;
}

const ErrorContext = createContext<ErrorState | null>(null);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = useState<string[]>([]);

  const pushError = useCallback((msg: string) => {
    setErrors((prev) => [...prev, msg]);
  }, []);

  const dismissError = useCallback(() => {
    setErrors((prev) => prev.slice(1));
  }, []);

  useEffect(() => {
    registerErrorHandler(pushError);
    return () => registerErrorHandler(null);
  }, [pushError]);

  return (
    <ErrorContext.Provider value={{ errors, pushError, dismissError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useErrorContext() {
  const ctx = useContext(ErrorContext);
  if (!ctx) throw new Error('useErrorContext must be used within ErrorProvider');
  return ctx;
}
