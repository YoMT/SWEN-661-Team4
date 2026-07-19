import { useMemo } from 'react'
import type { User, Medication, Appointment } from '@renderer/types'
import { useProfileContext } from '@renderer/state/profile-context'
import { useMedicationContext } from '@renderer/state/medication-context'
import { useAppointmentContext } from '@renderer/state/appointment-context'
import { useSymptomContext } from '@renderer/state/symptom-context'
import { useAuthContext } from '@renderer/state/auth-context'
import { useRefreshContext } from '@renderer/state/refresh-context'

interface DashboardData {
  user: User | null
  careeName: string
  isLoading: boolean
  refresh: () => void
  givenDoses: number
  totalDoses: number
  todayAppointmentsCount: number
  logsCount: number
  nextMed: Medication | undefined
  nextAppt: Appointment | null
  todayAppointments: Appointment[]
}

/**
 * Aggregates the cross-feature state the dashboard needs. Mirrors
 * apps/mobile/src/features/dashboard/use-dashboard.ts.
 */
export function useDashboard(): DashboardData {
  const { user } = useAuthContext()
  const { profile } = useProfileContext()
  const { medications, givenDoses, totalDoses, isLoading: medsLoading } = useMedicationContext()
  const { todayAppointments } = useAppointmentContext()
  const { logs } = useSymptomContext()
  const { triggerRefresh } = useRefreshContext()

  const nextMed = useMemo(
    () => medications.find((m) => m.status === 'upcoming' || m.status === 'dueNow'),
    [medications]
  )

  const nextAppt = todayAppointments[0] ?? null

  return {
    user,
    careeName: profile?.careeName ?? 'your loved one',
    isLoading: medsLoading,
    refresh: triggerRefresh,
    givenDoses,
    totalDoses,
    todayAppointmentsCount: todayAppointments.length,
    logsCount: logs.length,
    nextMed,
    nextAppt,
    todayAppointments
  }
}
