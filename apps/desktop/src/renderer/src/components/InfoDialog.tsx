import React, { useEffect, useRef } from 'react'

interface InfoDialogProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

/** Standard dialog with scrim + focus on close button + Esc to dismiss. */
export function InfoDialog({ title, onClose, children }: InfoDialogProps): React.JSX.Element {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  return (
    <div
      className="modal-scrim"
      onMouseDown={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
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
