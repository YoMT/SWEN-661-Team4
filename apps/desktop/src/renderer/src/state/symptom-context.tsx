import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import type { SymptomLog } from '@renderer/types'
import { api } from '@renderer/services/api'
import { useRefreshContext } from '@renderer/state/refresh-context'

interface SymptomState {
  logs: SymptomLog[]
  isLoading: boolean
  error: string | null
  addLog: (log: Omit<SymptomLog, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
}

const SymptomContext = createContext<SymptomState | null>(null)

export function SymptomProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { refreshKey } = useRefreshContext()
  const [logs, setLogs] = useState<SymptomLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    api
      .get<SymptomLog[]>('/symptoms')
      .then(setLogs)
      .catch(() => setError('Could not load symptom logs'))
      .finally(() => setIsLoading(false))
  }, [refreshKey])

  const addLog = useCallback(async (log: Omit<SymptomLog, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await api.post<SymptomLog>('/symptoms', log)
    setLogs((prev) => [created, ...prev])
  }, [])

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
