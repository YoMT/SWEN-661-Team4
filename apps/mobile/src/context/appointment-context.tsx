import React, { createContext, useContext, useState } from 'react';
import type { Appointment } from '@/models/appointment';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

const SEED: Appointment[] = [
  { id: '1', doctorName: 'Dr. Sarah Chen', specialty: 'Neurology', location: 'City Medical Center', dateTime: today.toISOString(), type: 'inPerson', status: 'upcoming', createdAt: today.toISOString(), updatedAt: today.toISOString() },
  { id: '2', doctorName: 'Dr. Michael Torres', specialty: 'Physical Therapy', location: 'Virtual Visit', dateTime: nextWeek.toISOString(), type: 'video', status: 'upcoming', createdAt: today.toISOString(), updatedAt: today.toISOString() },
];

interface AppointmentState {
  appointments: Appointment[];
  todayAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  isLoading: boolean;
  errorMessage: string | null;
  addAppointment: (appt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  reschedule: (id: string, dateTime: string) => void;
}

const AppointmentContext = createContext<AppointmentState | null>(null);

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(SEED);
  const [isLoading] = useState(false);
  const [errorMessage] = useState<string | null>(null);

  const todayStr = new Date().toDateString();
  const todayAppointments = appointments.filter((a) => new Date(a.dateTime).toDateString() === todayStr);
  const upcomingAppointments = appointments.filter((a) => new Date(a.dateTime).toDateString() !== todayStr && a.status === 'upcoming');

  function addAppointment(appt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    setAppointments((prev) => [...prev, { ...appt, id: String(Date.now()), createdAt: now, updatedAt: now }]);
  }

  function reschedule(id: string, dateTime: string) {
    setAppointments((prev) =>
      prev.map((a) => a.id === id ? { ...a, dateTime, updatedAt: new Date().toISOString() } : a)
    );
  }

  return (
    <AppointmentContext.Provider value={{ appointments, todayAppointments, upcomingAppointments, isLoading, errorMessage, addAppointment, reschedule }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointmentContext() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) throw new Error('useAppointmentContext must be used within AppointmentProvider');
  return ctx;
}
