import React, { createContext, useContext, useState } from 'react';

interface DashboardState {
  careeName: string;
  errorMessage: string | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const careeName = 'Gloria Washington';

  async function refresh() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await new Promise((r) => setTimeout(r, 600));
    } catch {
      setErrorMessage('Could not refresh dashboard.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DashboardContext.Provider value={{ careeName, errorMessage, isLoading, refresh }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardProvider');
  return ctx;
}
