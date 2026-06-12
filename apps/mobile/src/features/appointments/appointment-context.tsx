import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { Appointment } from '@/features/appointments/appointment';
import { api } from '@/services/api';
import { useRefreshContext } from '@/shared/context/refresh-context';

interface AppointmentState {
  appointments: Appointment[];
  todayAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  addAppointment: (appt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  reschedule: (id: string, dateTime: string) => Promise<void>;
}

const AppointmentContext = createContext<AppointmentState | null>(null);

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const { refreshKey } = useRefreshContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    api.get<Appointment[]>('/appointments')
      .then(setAppointments)
      .catch(() => setError('Could not load appointments'))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  const todayStr = new Date().toDateString();

  const todayAppointments = useMemo(
    () => appointments.filter((a) => new Date(a.dateTime).toDateString() === todayStr),
    [appointments, todayStr],
  );

  const upcomingAppointments = useMemo(
    () => appointments.filter((a) => new Date(a.dateTime).toDateString() !== todayStr && a.status === 'upcoming'),
    [appointments, todayStr],
  );

  const addAppointment = useCallback(async (appt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await api.post<Appointment>('/appointments', appt);
    setAppointments((prev) => [...prev, created]);
  }, []);

  const reschedule = useCallback(async (id: string, dateTime: string) => {
    await api.patch(`/appointments/${id}`, { dateTime });
    setAppointments((prev) =>
      prev.map((a) => a.id === id ? { ...a, dateTime, updatedAt: new Date().toISOString() } : a),
    );
  }, []);

  const value = useMemo(
    () => ({ appointments, todayAppointments, upcomingAppointments, isLoading, error, addAppointment, reschedule }),
    [appointments, todayAppointments, upcomingAppointments, isLoading, error, addAppointment, reschedule],
  );

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
}

export function useAppointmentContext() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) throw new Error('useAppointmentContext must be used within AppointmentProvider');
  return ctx;
}
