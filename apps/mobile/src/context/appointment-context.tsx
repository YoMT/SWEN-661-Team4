import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { Appointment } from '@/models/appointment';
import { APPOINTMENT_SEEDS } from '@/data/seeds';

interface AppointmentState {
  appointments: Appointment[];
  todayAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  addAppointment: (appt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  reschedule: (id: string, dateTime: string) => void;
}

const AppointmentContext = createContext<AppointmentState | null>(null);

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(APPOINTMENT_SEEDS);

  const todayStr = new Date().toDateString();

  const todayAppointments = useMemo(
    () => appointments.filter((a) => new Date(a.dateTime).toDateString() === todayStr),
    [appointments, todayStr],
  );

  const upcomingAppointments = useMemo(
    () => appointments.filter((a) => new Date(a.dateTime).toDateString() !== todayStr && a.status === 'upcoming'),
    [appointments, todayStr],
  );

  const addAppointment = useCallback((appt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setAppointments((prev) => [...prev, { ...appt, id: String(Date.now()), createdAt: now, updatedAt: now }]);
  }, []);

  const reschedule = useCallback((id: string, dateTime: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, dateTime, updatedAt: new Date().toISOString() } : a)),
    );
  }, []);

  const value = useMemo(
    () => ({ appointments, todayAppointments, upcomingAppointments, addAppointment, reschedule }),
    [appointments, todayAppointments, upcomingAppointments, addAppointment, reschedule],
  );

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
}

export function useAppointmentContext() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) throw new Error('useAppointmentContext must be used within AppointmentProvider');
  return ctx;
}
