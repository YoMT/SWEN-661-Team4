import React, { createContext, useContext, useState } from 'react';
import type { CaretakerNote } from '@/models/caretaker-note';

const SEED: CaretakerNote[] = [
  { id: '1', authorName: 'Dr. Sarah Chen', content: 'Patient showed improvement in fine motor skills during today\'s session. Continue current medication regimen.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', authorName: 'Physical Therapist', content: 'Tremors slightly worse in the morning. Suggest scheduling therapy after medication peak.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

interface CaretakerState {
  notes: CaretakerNote[];
  isLoading: boolean;
  errorMessage: string | null;
  addReply: (id: string, reply: string) => void;
}

const CaretakerContext = createContext<CaretakerState | null>(null);

export function CaretakerProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<CaretakerNote[]>(SEED);
  const [isLoading] = useState(false);
  const [errorMessage] = useState<string | null>(null);

  function addReply(id: string, reply: string) {
    setNotes((prev) =>
      prev.map((n) => n.id === id ? { ...n, replyContent: reply, updatedAt: new Date().toISOString() } : n)
    );
  }

  return (
    <CaretakerContext.Provider value={{ notes, isLoading, errorMessage, addReply }}>
      {children}
    </CaretakerContext.Provider>
  );
}

export function useCaretakerContext() {
  const ctx = useContext(CaretakerContext);
  if (!ctx) throw new Error('useCaretakerContext must be used within CaretakerProvider');
  return ctx;
}
