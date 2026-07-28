import React, { useEffect, useRef, useState } from 'react'
import { useAiAssistantContext } from '@renderer/state/ai-assistant-context'

interface PeggyPanelProps {
  open: boolean
  onClose: () => void
}

export function PeggyPanel({ open, onClose }: PeggyPanelProps): React.JSX.Element | null {
  const { messages, isTyping, errorMessage, sendMessage } = useAiAssistantContext()
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)

  // ⌘/Ctrl J opens the panel and lands focus in the composer (design-system §3.8).
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight })
  }, [messages, isTyping])

  if (!open) return null

  const submit = (): void => {
    const content = draft.trim()
    if (!content || isTyping) return
    setDraft('')
    void sendMessage(content)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <aside
      className="peggy-panel"
      aria-label="Peggy assistant"
      onKeyDown={(e) => {
        // Non-modal panel: Esc from anywhere inside it closes (no focus trap).
        if (e.key === 'Escape') onClose()
      }}
    >
      <div className="peggy-head">
        <span className="peggy-title">
          <span aria-hidden="true">🤖</span> Peggy
        </span>
        <button
          type="button"
          className="peggy-close"
          onClick={onClose}
          aria-label="Close assistant"
        >
          ✕
        </button>
      </div>

      <div className="peggy-transcript" ref={transcriptRef} role="log" aria-live="polite">
        {messages.length === 0 && !isTyping && (
          <p className="peggy-empty">
            Hi, I&apos;m Peggy! How can I help with Margaret&apos;s care?
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`bubble bubble-${m.role}`}>
            {m.content}
          </div>
        ))}
        {isTyping && <div className="bubble bubble-assistant typing">Peggy is typing…</div>}
        {errorMessage && (
          <div className="error-banner" role="alert">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="peggy-composer">
        <textarea
          ref={inputRef}
          className="peggy-input"
          rows={1}
          placeholder="Ask Peggy…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Message Peggy"
        />
        <button
          type="button"
          className="btn btn-primary peggy-send"
          onClick={submit}
          disabled={!draft.trim() || isTyping}
        >
          Send
        </button>
      </div>
    </aside>
  )
}
