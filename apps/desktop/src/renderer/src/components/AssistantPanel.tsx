import React, { useEffect, useRef, useState } from 'react'
import { useUI } from '@renderer/state/ui-context'
import { api } from '@renderer/services/api'

interface ChatMessage {
  id: number
  role: 'user' | 'peggy'
  text: string
}

const GREETING: ChatMessage = {
  id: 0,
  role: 'peggy',
  text: "Hi, I'm Peggy. Ask me about today's medications, appointments, or recent symptoms."
}

/**
 * Dockable assistant panel (§3.8) — replaces the mobile floating FAB. Opens with
 * ⌘J and focus lands in the input; the transcript is a role="log" /
 * aria-live="polite" region so replies are announced (§6). Enter sends,
 * Shift+Enter inserts a newline; Esc closes the panel.
 */
export function AssistantPanel(): React.JSX.Element {
  const { setAssistantOpen } = useUI()
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages, pending])

  const send = async (): Promise<void> => {
    const text = draft.trim()
    if (!text || pending) return
    const userMsg: ChatMessage = { id: nextId.current++, role: 'user', text }
    setMessages((m) => [...m, userMsg])
    setDraft('')
    setPending(true)
    try {
      const { reply } = await api.post<{ reply: string }>('/ai/chat', { message: text })
      setMessages((m) => [...m, { id: nextId.current++, role: 'peggy', text: reply }])
    } catch {
      setMessages((m) => [
        ...m,
        { id: nextId.current++, role: 'peggy', text: 'Sorry, I could not respond just now.' }
      ])
    } finally {
      setPending(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setAssistantOpen(false)
    }
  }

  return (
    <aside className="assistant" role="complementary" aria-label="Assistant">
      <div className="assistant-head">
        <span>💬 Peggy</span>
        <button
          type="button"
          className="icon-btn"
          aria-label="Close assistant"
          onClick={() => setAssistantOpen(false)}
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div
        className="assistant-log"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        ref={logRef}
      >
        {messages.map((m) => (
          <div key={m.id} className={`bubble ${m.role}`}>
            {m.text}
          </div>
        ))}
        {pending && (
          <div className="bubble peggy" aria-hidden="true">
            Peggy is typing…
          </div>
        )}
      </div>

      <div className="assistant-composer">
        <textarea
          ref={inputRef}
          className="field-input"
          rows={1}
          placeholder="Ask Peggy…"
          aria-label="Message Peggy"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className="btn btn-primary"
          aria-label="Send message"
          disabled={pending || !draft.trim()}
          onClick={() => void send()}
        >
          Send
        </button>
      </div>
    </aside>
  )
}
