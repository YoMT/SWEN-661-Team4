import { renderHook } from '@testing-library/react'
import { useDebouncedAction, BUTTON_DEBOUNCE_MS } from '../lib/use-debounced-action'

describe('useDebouncedAction (Pillar 3 — Ignore Double-Taps)', () => {
  afterEach(() => jest.restoreAllMocks())

  test('ignores repeat invocations within the debounce window', () => {
    const now = jest.spyOn(Date, 'now')
    const fn = jest.fn()
    const { result } = renderHook(() => useDebouncedAction(fn))

    now.mockReturnValue(1000)
    result.current('first')
    now.mockReturnValue(1000 + BUTTON_DEBOUNCE_MS - 1) // still inside the window
    result.current('ignored')

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('first')
  })

  test('fires again once the window has elapsed', () => {
    const now = jest.spyOn(Date, 'now')
    const fn = jest.fn()
    const { result } = renderHook(() => useDebouncedAction(fn))

    now.mockReturnValue(1000)
    result.current('a')
    now.mockReturnValue(1000 + BUTTON_DEBOUNCE_MS + 1) // past the window
    result.current('b')

    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('b')
  })

  test('the default window is 600ms', () => {
    expect(BUTTON_DEBOUNCE_MS).toBe(600)
  })
})
