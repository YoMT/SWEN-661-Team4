import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { CaretakerNote } from '@/features/caretaker/caretaker-note';
import { CARETAKER_NOTE_SEEDS } from '@/data/seeds';

interface CaretakerState {
  notes: CaretakerNote[];
  addReply: (id: string, reply: string) => void;
}

const CaretakerContext = createContext<CaretakerState | null>(null);

export function CaretakerProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<CaretakerNote[]>(CARETAKER_NOTE_SEEDS);

  const addReply = useCallback((id: string, reply: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, replyContent: reply, updatedAt: new Date().toISOString() } : n)),
    );
  }, []);

  const value = useMemo(() => ({ notes, addReply }), [notes, addReply]);

  return <CaretakerContext.Provider value={value}>{children}</CaretakerContext.Provider>;
}

export function useCaretakerContext() {
  const ctx = useContext(CaretakerContext);
  if (!ctx) throw new Error('useCaretakerContext must be used within CaretakerProvider');
  return ctx;
}
