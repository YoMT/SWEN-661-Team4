import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { ChatMessage } from '@/models/chat-message';
import { TIMINGS } from '@/constants/timings';

interface AiAssistantState {
  messages: ChatMessage[];
  isTyping: boolean;
  errorMessage: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const AiAssistantContext = createContext<AiAssistantState | null>(null);

export function AiAssistantProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    setErrorMessage(null);
    const now = new Date().toISOString();
    const userMsg: ChatMessage = { id: `${Date.now()}_user`, role: 'user', content, timestamp: now };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    try {
      await new Promise((r) => setTimeout(r, TIMINGS.AI_RESPONSE_MS));
      const reply: ChatMessage = {
        id: `${Date.now()}_assistant`,
        role: 'assistant',
        content: 'I received your message. AI integration coming soon.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, reply]);
    } catch {
      setErrorMessage('Failed to get a response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setErrorMessage(null);
  }, []);

  const value = useMemo(
    () => ({ messages, isTyping, errorMessage, sendMessage, clearMessages }),
    [messages, isTyping, errorMessage, sendMessage, clearMessages],
  );

  return <AiAssistantContext.Provider value={value}>{children}</AiAssistantContext.Provider>;
}

export function useAiAssistantContext() {
  const ctx = useContext(AiAssistantContext);
  if (!ctx) throw new Error('useAiAssistantContext must be used within AiAssistantProvider');
  return ctx;
}
