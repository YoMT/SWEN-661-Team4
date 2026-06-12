import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { SymptomLog } from '@/models/symptom-log';

interface SymptomState {
  logs: SymptomLog[];
  addLog: (log: Omit<SymptomLog, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const SymptomContext = createContext<SymptomState | null>(null);

export function SymptomProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<SymptomLog[]>([]);

  const addLog = useCallback((log: Omit<SymptomLog, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setLogs((prev) => [{ ...log, id: String(Date.now()), createdAt: now, updatedAt: now }, ...prev]);
  }, []);

  const value = useMemo(() => ({ logs, addLog }), [logs, addLog]);

  return <SymptomContext.Provider value={value}>{children}</SymptomContext.Provider>;
}

export function useSymptomContext() {
  const ctx = useContext(SymptomContext);
  if (!ctx) throw new Error('useSymptomContext must be used within SymptomProvider');
  return ctx;
}
