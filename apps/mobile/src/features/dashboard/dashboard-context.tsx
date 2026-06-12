import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useRefreshContext } from '@/shared/context/refresh-context';

interface DashboardState {
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { triggerRefresh } = useRefreshContext();
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    triggerRefresh();
    // Loading state clears once individual contexts finish their own fetches.
    // Give a brief visual pulse so the RefreshControl spinner is visible.
    await new Promise((r) => setTimeout(r, 300));
    setIsLoading(false);
  }, [triggerRefresh]);

  const value = useMemo(() => ({ isLoading, refresh }), [isLoading, refresh]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardContext() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardProvider');
  return ctx;
}
