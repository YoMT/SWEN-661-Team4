import React, { useId, useRef } from 'react'
import { useDialogFocus } from '@renderer/hooks/useDialogFocus'

interface InfoDialogProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export function InfoDialog({
  title,
  onClose,
  children
}: InfoDialogProps): React.JSX.Element {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useDialogFocus(dialogRef, closeButtonRef)

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ): void => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      onClose()
    }
  }

  return (
    <div
      className="modal-scrim"
      onMouseDown={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id={titleId} className="modal-title">
            {title}
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            className="peggy-close"
            onClick={onClose}
            aria-label={`Close ${title}`}
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}