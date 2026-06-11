import React, { createContext, useContext, useState } from 'react';
import type { Medication, DoseTimeSlot } from '@/models/medication';

const SEED: Medication[] = [
  { id: '1', name: 'Levodopa', dosage: '100mg', instruction: 'Take with water', scheduledTime: '8:00 AM', timeSlot: 'morning', status: 'upcoming', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Carbidopa', dosage: '25mg', instruction: 'Take with food', scheduledTime: '12:00 PM', timeSlot: 'afternoon', status: 'upcoming', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: 'Amantadine', dosage: '100mg', instruction: 'Take before bed', scheduledTime: '9:00 PM', timeSlot: 'evening', status: 'given', takenAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

interface MedicationState {
  medications: Medication[];
  isLoading: boolean;
  errorMessage: string | null;
  totalDoses: number;
  givenDoses: number;
  byTimeSlot: (slot: DoseTimeSlot) => Medication[];
  addMedication: (med: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  markTaken: (id: string) => void;
}

const MedicationContext = createContext<MedicationState | null>(null);

export function MedicationProvider({ children }: { children: React.ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>(SEED);
  const [isLoading] = useState(false);
  const [errorMessage] = useState<string | null>(null);

  const totalDoses = medications.length;
  const givenDoses = medications.filter((m) => m.status === 'given').length;

  function byTimeSlot(slot: DoseTimeSlot) {
    return medications.filter((m) => m.timeSlot === slot);
  }

  function addMedication(med: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    setMedications((prev) => [...prev, { ...med, id: String(Date.now()), createdAt: now, updatedAt: now }]);
  }

  function markTaken(id: string) {
    setMedications((prev) =>
      prev.map((m) => m.id === id ? { ...m, status: 'given', takenAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : m)
    );
  }

  return (
    <MedicationContext.Provider value={{ medications, isLoading, errorMessage, totalDoses, givenDoses, byTimeSlot, addMedication, markTaken }}>
      {children}
    </MedicationContext.Provider>
  );
}

export function useMedicationContext() {
  const ctx = useContext(MedicationContext);
  if (!ctx) throw new Error('useMedicationContext must be used within MedicationProvider');
  return ctx;
}
