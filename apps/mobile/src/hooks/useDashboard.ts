import { useMemo } from 'react';
import { useProfileContext } from '@/context/profile-context';
import { useMedicationContext } from '@/context/medication-context';
import { useAppointmentContext } from '@/context/appointment-context';
import { useSymptomContext } from '@/context/symptom-context';
import { useDashboardContext } from '@/context/dashboard-context';
import { useAuthContext } from '@/context/auth-context';

export function useDashboard() {
  const { user } = useAuthContext();
  const { profile } = useProfileContext();
  const { medications, givenDoses, totalDoses } = useMedicationContext();
  const { todayAppointments } = useAppointmentContext();
  const { logs } = useSymptomContext();
  const { isLoading, refresh } = useDashboardContext();

  const nextMed = useMemo(
    () => medications.find((m) => m.status === 'upcoming' || m.status === 'dueNow'),
    [medications],
  );

  const nextAppt = todayAppointments[0] ?? null;

  return {
    user,
    careeName: profile.careeName ?? 'your loved one',
    isLoading,
    refresh,
    givenDoses,
    totalDoses,
    todayAppointmentsCount: todayAppointments.length,
    logsCount: logs.length,
    nextMed,
    nextAppt,
    todayAppointments,
  };
}
