import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface ModalFocusOptions {
  /** Called on Escape — pass the dialog's close/confirm-close handler. */
  onClose: () => void
  /** Element to focus on open; defaults to the first focusable in the container. */
  initialFocusRef?: RefObject<HTMLElement | null>
}

/**
 * Modal focus management: focuses the dialog on open, traps Tab inside it,
 * closes on Escape (document-level, so it still works if focus somehow leaves
 * the dialog), and restores focus to the opener on unmount.
 *
 * Mount the dialog only while open (both web dialogs already do) and pass a ref
 * to its container element.
 */
export function useModalFocus(
  containerRef: RefObject<HTMLElement | null>,
  { onClose, initialFocusRef }: ModalFocusOptions
): void {
  // Keep the latest close handler without re-running the trap effect (it
  // captures dirty-state checks in EditProfileModal).
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Snapshot the opener. Under StrictMode's double-mount the second run fires
    // after cleanup restored focus, so activeElement is the opener again; only
    // guard against focus already being inside the dialog.
    const opener = container.contains(document.activeElement)
      ? null
      : (document.activeElement as HTMLElement | null)

    const initial = initialFocusRef?.current ?? container.querySelector<HTMLElement>(FOCUSABLE)
    initial?.focus()

    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      if (e.shiftKey) {
        if (active === first || !container.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last || !container.contains(active)) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return (): void => {
      document.removeEventListener('keydown', onKeyDown, true)
      // Restore focus to whatever opened the dialog, if it's still around.
      if (opener && opener.isConnected) opener.focus()
    }
  }, [containerRef, initialFocusRef])
}
