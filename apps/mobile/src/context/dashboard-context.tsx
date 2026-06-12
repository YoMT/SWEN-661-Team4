import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { TIMINGS } from '@/constants/timings';

// careeName is NOT stored here — read it from ProfileContext via the useDashboard hook.
interface DashboardState {
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, TIMINGS.DASHBOARD_REFRESH_MS));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(() => ({ isLoading, refresh }), [isLoading, refresh]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardContext() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardProvider');
  return ctx;
}
