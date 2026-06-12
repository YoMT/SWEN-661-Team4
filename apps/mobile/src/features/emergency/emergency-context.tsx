import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { EmergencyContact } from '@/features/emergency/emergency-contact';
import { api } from '@/services/api';
import { useRefreshContext } from '@/shared/context/refresh-context';

interface EmergencyState {
  contacts: EmergencyContact[];
  isLoading: boolean;
  error: string | null;
  incidentNote: string;
  incidentSaved: boolean;
  setIncidentNote: (note: string) => void;
  saveIncident: () => Promise<void>;
}

const EmergencyContext = createContext<EmergencyState | null>(null);

export function EmergencyProvider({ children }: { children: React.ReactNode }) {
  const { refreshKey } = useRefreshContext();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [incidentNote, setIncidentNote] = useState('');
  const [incidentSaved, setIncidentSaved] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    api.get<EmergencyContact[]>('/emergency-contacts')
      .then(setContacts)
      .catch(() => setError('Could not load emergency contacts'))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  const saveIncident = useCallback(async () => {
    await api.post('/incidents', { note: incidentNote });
    setIncidentSaved(true);
    setTimeout(() => setIncidentSaved(false), 3000);
  }, [incidentNote]);

  const value = useMemo(
    () => ({ contacts, isLoading, error, incidentNote, incidentSaved, setIncidentNote, saveIncident }),
    [contacts, isLoading, error, incidentNote, incidentSaved, saveIncident],
  );

  return <EmergencyContext.Provider value={value}>{children}</EmergencyContext.Provider>;
}

export function useEmergencyContext() {
  const ctx = useContext(EmergencyContext);
  if (!ctx) throw new Error('useEmergencyContext must be used within EmergencyProvider');
  return ctx;
}
