import React, { useEffect, useRef } from 'react'
import { useUI } from '@renderer/state/ui-context'

/**
 * Two-step confirm dialog (§3.6, Pillar 2). Cancel and Confirm are ≥80px apart
 * and each ≥--control-critical; focus is trapped; Esc cancels (never the
 * destructive default); the dialog never auto-closes. Focus opens on the safe
 * default (Cancel).
 */
export function ConfirmDialog(): React.JSX.Element | null {
  const { confirmRequest, resolveConfirm } = useUI()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (confirmRequest) cancelRef.current?.focus()
  }, [confirmRequest])

  if (!confirmRequest) return null
  const { title, body, confirmLabel, cancelLabel, destructive } = confirmRequest

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault()
      resolveConfirm(false)
      return
    }
    if (e.key !== 'Tab') return
    // Trap focus between the two buttons.
    const focusables = [cancelRef.current, confirmRef.current].filter(Boolean) as HTMLElement[]
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      className="scrim"
      onMouseDown={(e) => e.target === e.currentTarget && resolveConfirm(false)}
    >
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        ref={dialogRef}
        onKeyDown={onKeyDown}
      >
        <h2 className="dialog-title" id="confirm-title">
          {title}
        </h2>
        <p className="dialog-body" id="confirm-body">
          {body}
        </p>
        <div className="dialog-actions">
          <button
            type="button"
            className="btn btn-outline critical"
            ref={cancelRef}
            onClick={() => resolveConfirm(false)}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn critical ${destructive ? 'btn-danger' : 'btn-primary'}`}
            ref={confirmRef}
            onClick={() => resolveConfirm(true)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
