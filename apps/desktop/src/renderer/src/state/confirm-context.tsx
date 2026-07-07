import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

// Two-step confirmation for destructive / care-critical actions (Pillar 2,
// DESKTOP_DESIGN_SYSTEM §3.6). Exposed as a promise so callers can `await` a
// yes/no. The dialog is focus-trapped, opens on the safe default (Cancel),
// never auto-closes, and Esc cancels. Reuses the app's modal styling.
export interface ConfirmOptions {
  title: string
  body: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

interface ConfirmRequest extends Required<Omit<ConfirmOptions, 'destructive'>> {
  destructive: boolean
  resolve: (ok: boolean) => void
  returnFocus: HTMLElement | null
}

interface ConfirmState {
  confirm: (opts: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmState | null>(null)

export function ConfirmProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [request, setRequest] = useState<ConfirmRequest | null>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  const confirm = useCallback(
    (opts: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setRequest({
          title: opts.title,
          body: opts.body,
          confirmLabel: opts.confirmLabel ?? 'Confirm',
          cancelLabel: opts.cancelLabel ?? 'Cancel',
          destructive: opts.destructive ?? false,
          resolve,
          returnFocus: document.activeElement as HTMLElement | null
        })
      }),
    []
  )

  const settle = useCallback((ok: boolean) => {
    setRequest((prev) => {
      prev?.resolve(ok)
      prev?.returnFocus?.focus?.()
      return null
    })
  }, [])

  // Open focus on the safe default (Cancel).
  useEffect(() => {
    if (request) cancelRef.current?.focus()
  }, [request])

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault()
      settle(false)
      return
    }
    if (e.key !== 'Tab') return
    const nodes = [cancelRef.current, confirmRef.current].filter(Boolean) as HTMLElement[]
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {request && (
        <div
          className="modal-scrim confirm-scrim"
          onMouseDown={(e) => e.target === e.currentTarget && settle(false)}
        >
          <div
            className="modal-card"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-body"
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
          >
            <div className="modal-head">
              <h2 className="modal-title" id="confirm-title">
                {request.title}
              </h2>
            </div>
            <p id="confirm-body" style={{ margin: '0 0 20px', lineHeight: 1.5 }}>
              {request.body}
            </p>
            <div className="modal-actions confirm-actions">
              <button
                type="button"
                className="btn btn-outline modal-btn"
                ref={cancelRef}
                onClick={() => settle(false)}
              >
                {request.cancelLabel}
              </button>
              <button
                type="button"
                className={`btn modal-btn ${request.destructive ? 'btn-danger' : 'btn-primary'}`}
                ref={confirmRef}
                onClick={() => settle(true)}
              >
                {request.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm(): ConfirmState {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider')
  return ctx
}
