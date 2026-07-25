import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import type { Medication, DoseTimeSlot } from '@renderer/types'
import { api } from '@renderer/services/api'
import { useRefreshContext } from '@renderer/state/refresh-context'
import { useAuthContext } from '@renderer/state/auth-context'

interface MedicationState {
  medications: Medication[]
  totalDoses: number
  givenDoses: number
  isLoading: boolean
  error: string | null
  byTimeSlot: (slot: DoseTimeSlot) => Medication[]
  addMedication: (med: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  markTaken: (id: string) => Promise<void>
}

const MedicationContext = createContext<MedicationState | null>(null)

export function MedicationProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { refreshKey } = useRefreshContext()
  const { isLoggedIn } = useAuthContext()
  const [medications, setMedications] = useState<Medication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Protected endpoint — don't fetch until authenticated, or the pre-auth
    // landing/login pages would fire requests that 401.
    if (!isLoggedIn) {
      setMedications([])
      setError(null)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    api
      .get<Medication[]>('/medications')
      .then(setMedications)
      .catch(() => setError('Could not load medications'))
      .finally(() => setIsLoading(false))
  }, [refreshKey, isLoggedIn])

  const totalDoses = medications.length
  const givenDoses = useMemo(
    () => medications.filter((m) => m.status === 'given').length,
    [medications]
  )
  const byTimeSlot = useCallback(
    (slot: DoseTimeSlot) => medications.filter((m) => m.timeSlot === slot),
    [medications]
  )

  const addMedication = useCallback(
    async (med: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
      const created = await api.post<Medication>('/medications', med)
      setMedications((prev) => [...prev, created])
    },
    []
  )

  const markTaken = useCallback(async (id: string) => {
    // Optimistic update
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'given',
              takenAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : m
      )
    )
    try {
      await api.patch(`/medications/${id}/taken`, {})
    } catch {
      // Revert on failure
      setMedications((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'upcoming', takenAt: undefined } : m))
      )
    }
  }, [])

  const value = useMemo(
    () => ({
      medications,
      totalDoses,
      givenDoses,
      isLoading,
      error,
      byTimeSlot,
      addMedication,
      markTaken
    }),
    [medications, totalDoses, givenDoses, isLoading, error, byTimeSlot, addMedication, markTaken]
  )

  return <MedicationContext.Provider value={value}>{children}</MedicationContext.Provider>
}

export function useMedicationContext(): MedicationState {
  const ctx = useContext(MedicationContext)
  if (!ctx) throw new Error('useMedicationContext must be used within MedicationProvider')
  return ctx
}
