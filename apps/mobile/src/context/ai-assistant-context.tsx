import React, { createContext, useContext, useState } from 'react';
import type { ChatMessage } from '@/models/chat-message';

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

  async function sendMessage(content: string) {
    setErrorMessage(null);
    const now = new Date().toISOString();
    const userMsg: ChatMessage = { id: `${Date.now()}_user`, role: 'user', content, timestamp: now };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
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
  }

  function clearMessages() {
    setMessages([]);
    setErrorMessage(null);
  }

  return (
    <AiAssistantContext.Provider value={{ messages, isTyping, errorMessage, sendMessage, clearMessages }}>
      {children}
    </AiAssistantContext.Provider>
  );
}

export function useAiAssistantContext() {
  const ctx = useContext(AiAssistantContext);
  if (!ctx) throw new Error('useAiAssistantContext must be used within AiAssistantProvider');
  return ctx;
}
