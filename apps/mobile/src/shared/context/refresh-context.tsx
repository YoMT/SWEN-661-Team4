import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface RefreshState {
  refreshKey: number;
  triggerRefresh: () => void;
}

const RefreshContext = createContext<RefreshState | null>(null);

export function RefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);
  const value = useMemo(() => ({ refreshKey, triggerRefresh }), [refreshKey, triggerRefresh]);

  return <RefreshContext.Provider value={value}>{children}</RefreshContext.Provider>;
}

export function useRefreshContext() {
  const ctx = useContext(RefreshContext);
  if (!ctx) throw new Error('useRefreshContext must be used within RefreshProvider');
  return ctx;
}
