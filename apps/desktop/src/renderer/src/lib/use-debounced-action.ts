import { useCallback, useRef } from 'react'
import { BUTTON_DEBOUNCE_MS } from '@renderer/theme/tokens'

/**
 * Ignores repeat invocations within `ms` — Pillar 3 (Ignore Double-Taps).
 * Wrap care-write handlers (Mark as Taken, Save, Confirm) so a tremor-induced
 * double activation only fires once. Mirrors the mobile BUTTON_DEBOUNCE_MS guard.
 */
export function useDebouncedAction<A extends unknown[]>(
  fn: (...args: A) => void,
  ms: number = BUTTON_DEBOUNCE_MS
): (...args: A) => void {
  const last = useRef(0)
  return useCallback(
    (...args: A) => {
      const now = Date.now()
      if (now - last.current < ms) return
      last.current = now
      fn(...args)
    },
    [fn, ms]
  )
}
