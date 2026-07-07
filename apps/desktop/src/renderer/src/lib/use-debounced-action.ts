import { useCallback, useRef } from 'react'

/** Care-write debounce window — Pillar 3 (Ignore Double-Taps). Mirrors the
 * mobile BUTTON_DEBOUNCE_MS guard. */
export const BUTTON_DEBOUNCE_MS = 600

/**
 * Ignores repeat invocations within `ms`. Wrap care-write handlers (Mark as
 * Taken, Save, Confirm) so a tremor-induced double activation fires only once.
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
