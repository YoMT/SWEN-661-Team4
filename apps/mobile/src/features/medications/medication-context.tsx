import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { Medication, DoseTimeSlot } from '@/features/medications/medication';
import { MEDICATION_SEEDS } from '@/data/seeds';

interface MedicationState {
  medications: Medication[];
  totalDoses: number;
  givenDoses: number;
  byTimeSlot: (slot: DoseTimeSlot) => Medication[];
  addMedication: (med: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  markTaken: (id: string) => void;
}

const MedicationContext = createContext<MedicationState | null>(null);

export function MedicationProvider({ children }: { children: React.ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>(MEDICATION_SEEDS);

  const totalDoses = medications.length;
  const givenDoses = useMemo(() => medications.filter((m) => m.status === 'given').length, [medications]);

  const byTimeSlot = useCallback(
    (slot: DoseTimeSlot) => medications.filter((m) => m.timeSlot === slot),
    [medications],
  );

  const addMedication = useCallback((med: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setMedications((prev) => [...prev, { ...med, id: String(Date.now()), createdAt: now, updatedAt: now }]);
  }, []);

  const markTaken = useCallback((id: string) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: 'given', takenAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : m,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ medications, totalDoses, givenDoses, byTimeSlot, addMedication, markTaken }),
    [medications, totalDoses, givenDoses, byTimeSlot, addMedication, markTaken],
  );

  return <MedicationContext.Provider value={value}>{children}</MedicationContext.Provider>;
}

export function useMedicationContext() {
  const ctx = useContext(MedicationContext);
  if (!ctx) throw new Error('useMedicationContext must be used within MedicationProvider');
  return ctx;
}
