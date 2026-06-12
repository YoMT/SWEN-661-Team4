import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { CaretakerNote } from '@/features/caretaker/caretaker-note';
import { api } from '@/services/api';
import { useRefreshContext } from '@/shared/context/refresh-context';

interface CaretakerState {
  notes: CaretakerNote[];
  isLoading: boolean;
  error: string | null;
  addReply: (id: string, reply: string) => Promise<void>;
}

const CaretakerContext = createContext<CaretakerState | null>(null);

export function CaretakerProvider({ children }: { children: React.ReactNode }) {
  const { refreshKey } = useRefreshContext();
  const [notes, setNotes] = useState<CaretakerNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    api.get<CaretakerNote[]>('/caretaker-notes')
      .then(setNotes)
      .catch(() => setError('Could not load caretaker notes'))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  const addReply = useCallback(async (id: string, reply: string) => {
    await api.patch(`/caretaker-notes/${id}/reply`, { reply });
    setNotes((prev) =>
      prev.map((n) => n.id === id ? { ...n, replyContent: reply, updatedAt: new Date().toISOString() } : n),
    );
  }, []);

  const value = useMemo(() => ({ notes, isLoading, error, addReply }), [notes, isLoading, error, addReply]);

  return <CaretakerContext.Provider value={value}>{children}</CaretakerContext.Provider>;
}

export function useCaretakerContext() {
  const ctx = useContext(CaretakerContext);
  if (!ctx) throw new Error('useCaretakerContext must be used within CaretakerProvider');
  return ctx;
}
