import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { EmergencyContact } from '@/features/emergency/emergency-contact';
import { EMERGENCY_CONTACT_SEEDS } from '@/data/seeds';
import { TIMINGS } from '@/constants/timings';

interface EmergencyState {
  contacts: EmergencyContact[];
  incidentNote: string;
  incidentSaved: boolean;
  setIncidentNote: (note: string) => void;
  saveIncident: () => Promise<void>;
}

const EmergencyContext = createContext<EmergencyState | null>(null);

export function EmergencyProvider({ children }: { children: React.ReactNode }) {
  const [contacts] = useState<EmergencyContact[]>(EMERGENCY_CONTACT_SEEDS);
  const [incidentNote, setIncidentNote] = useState('');
  const [incidentSaved, setIncidentSaved] = useState(false);

  const saveIncident = useCallback(async () => {
    await new Promise((r) => setTimeout(r, TIMINGS.INCIDENT_SAVE_MS));
    setIncidentSaved(true);
    setTimeout(() => setIncidentSaved(false), TIMINGS.INCIDENT_SAVED_RESET_MS);
  }, []);

  const value = useMemo(
    () => ({ contacts, incidentNote, incidentSaved, setIncidentNote, saveIncident }),
    [contacts, incidentNote, incidentSaved, saveIncident],
  );

  return <EmergencyContext.Provider value={value}>{children}</EmergencyContext.Provider>;
}

export function useEmergencyContext() {
  const ctx = useContext(EmergencyContext);
  if (!ctx) throw new Error('useEmergencyContext must be used within EmergencyProvider');
  return ctx;
}
