import React, { createContext, useContext, useMemo, useCallback } from 'react'
import type { SymptomLog } from '@renderer/types'
import { api } from '@renderer/services/api'
import { useAuthedResource } from '@renderer/state/use-authed-resource'

interface SymptomState {
  logs: SymptomLog[]
  isLoading: boolean
  error: string | null
  addLog: (log: Omit<SymptomLog, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
}

const SymptomContext = createContext<SymptomState | null>(null)

// Stable empty reference for the logged-out / loading states.
const NO_LOGS: SymptomLog[] = []

export function SymptomProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const {
    data: logs,
    isLoading,
    error,
    setData: setLogs
  } = useAuthedResource<SymptomLog[]>('/symptoms', NO_LOGS, 'Could not load symptom logs')

  const addLog = useCallback(
    async (log: Omit<SymptomLog, 'id' | 'createdAt' | 'updatedAt'>) => {
      const created = await api.post<SymptomLog>('/symptoms', log)
      setLogs((prev) => [created, ...prev])
    },
    [setLogs]
  )

  const value = useMemo(
    () => ({ logs, isLoading, error, addLog }),
    [logs, isLoading, error, addLog]
  )

  return <SymptomContext.Provider value={value}>{children}</SymptomContext.Provider>
}

export function useSymptomContext(): SymptomState {
  const ctx = useContext(SymptomContext)
  if (!ctx) throw new Error('useSymptomContext must be used within SymptomProvider')
  return ctx
}
