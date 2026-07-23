import React, { useRef } from 'react'
import { useModalFocus } from '@renderer/hooks/use-modal-focus'

interface InfoDialogProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

/** Standard dialog with scrim + focus trap/restore + Esc to dismiss. */
export function InfoDialog({ title, onClose, children }: InfoDialogProps): React.JSX.Element {
  const closeRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useModalFocus(cardRef, { onClose, initialFocusRef: closeRef })

  return (
    <div className="modal-scrim" onMouseDown={onClose}>
      <div
        ref={cardRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2 className="modal-title">{title}</h2>
          <button
            type="button"
            className="peggy-close"
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
