import React, { createContext, useContext, useMemo, useCallback } from 'react'
import type { Medication, DoseTimeSlot } from '@renderer/types'
import { api } from '@renderer/services/api'
import { useAuthedResource } from '@renderer/state/use-authed-resource'

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

// Stable empty reference for the logged-out / loading states.
const NO_MEDICATIONS: Medication[] = []

export function MedicationProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const {
    data: medications,
    isLoading,
    error,
    setData: setMedications
  } = useAuthedResource<Medication[]>('/medications', NO_MEDICATIONS, 'Could not load medications')

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
    [setMedications]
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
  }, [setMedications])

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
