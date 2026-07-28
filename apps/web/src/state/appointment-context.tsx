import React, { createContext, useContext, useMemo, useCallback } from 'react'
import type { Appointment } from '@renderer/types'
import { api } from '@renderer/services/api'
import { useAuthedResource } from '@renderer/state/use-authed-resource'

interface AppointmentState {
  appointments: Appointment[]
  todayAppointments: Appointment[]
  upcomingAppointments: Appointment[]
  isLoading: boolean
  error: string | null
  addAppointment: (appt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  reschedule: (id: string, dateTime: string) => Promise<void>
}

const AppointmentContext = createContext<AppointmentState | null>(null)

// Stable empty reference for the logged-out / loading states.
const NO_APPOINTMENTS: Appointment[] = []

export function AppointmentProvider({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const {
    data: appointments,
    isLoading,
    error,
    setData: setAppointments
  } = useAuthedResource<Appointment[]>('/appointments', NO_APPOINTMENTS, 'Could not load appointments')

  const todayStr = new Date().toDateString()

  const todayAppointments = useMemo(
    () => appointments.filter((a) => new Date(a.dateTime).toDateString() === todayStr),
    [appointments, todayStr]
  )

  const upcomingAppointments = useMemo(
    () =>
      appointments.filter(
        (a) => new Date(a.dateTime).toDateString() !== todayStr && a.status === 'upcoming'
      ),
    [appointments, todayStr]
  )

  const addAppointment = useCallback(
    async (appt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
      const created = await api.post<Appointment>('/appointments', appt)
      setAppointments((prev) => [...prev, created])
    },
    [setAppointments]
  )

  const reschedule = useCallback(async (id: string, dateTime: string) => {
    await api.patch(`/appointments/${id}`, { dateTime })
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, dateTime, updatedAt: new Date().toISOString() } : a))
    )
  }, [setAppointments])

  const value = useMemo(
    () => ({
      appointments,
      todayAppointments,
      upcomingAppointments,
      isLoading,
      error,
      addAppointment,
      reschedule
    }),
    [
      appointments,
      todayAppointments,
      upcomingAppointments,
      isLoading,
      error,
      addAppointment,
      reschedule
    ]
  )

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>
}

export function useAppointmentContext(): AppointmentState {
  const ctx = useContext(AppointmentContext)
  if (!ctx) throw new Error('useAppointmentContext must be used within AppointmentProvider')
  return ctx
}
