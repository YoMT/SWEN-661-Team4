import React, { createContext, useContext, useState } from 'react';
import type { EmergencyContact } from '@/models/emergency-contact';

const SEED: EmergencyContact[] = [
  { id: '1', name: 'James Washington', phone: '+1 (555) 234-5678', relationship: 'Spouse', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Dr. Sarah Chen', phone: '+1 (555) 987-6543', relationship: 'Primary Physician', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

interface EmergencyState {
  contacts: EmergencyContact[];
  isLoading: boolean;
  errorMessage: string | null;
  incidentNote: string;
  incidentSaved: boolean;
  setIncidentNote: (note: string) => void;
  saveIncident: () => Promise<void>;
}

const EmergencyContext = createContext<EmergencyState | null>(null);

export function EmergencyProvider({ children }: { children: React.ReactNode }) {
  const [contacts] = useState<EmergencyContact[]>(SEED);
  const [isLoading] = useState(false);
  const [errorMessage] = useState<string | null>(null);
  const [incidentNote, setIncidentNote] = useState('');
  const [incidentSaved, setIncidentSaved] = useState(false);

  async function saveIncident() {
    await new Promise((r) => setTimeout(r, 500));
    setIncidentSaved(true);
    setTimeout(() => setIncidentSaved(false), 3000);
  }

  return (
    <EmergencyContext.Provider value={{ contacts, isLoading, errorMessage, incidentNote, incidentSaved, setIncidentNote, saveIncident }}>
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergencyContext() {
  const ctx = useContext(EmergencyContext);
  if (!ctx) throw new Error('useEmergencyContext must be used within EmergencyProvider');
  return ctx;
}
