import { act, renderHook } from '@testing-library/react'
import { useInstallPrompt } from '../hooks/use-install-prompt'

interface FakeInstallEvent extends Event {
  prompt: ReturnType<typeof vi.fn>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function makeInstallEvent(): FakeInstallEvent {
  const evt = new Event('beforeinstallprompt', { cancelable: true }) as FakeInstallEvent
  evt.prompt = vi.fn().mockResolvedValue(undefined)
  evt.userChoice = Promise.resolve({ outcome: 'accepted' as const })
  return evt
}

describe('useInstallPrompt', () => {
  test('canInstall is false until the browser fires beforeinstallprompt', () => {
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.canInstall).toBe(false)
  })

  test('captures the event and forwards promptInstall to it', async () => {
    const { result } = renderHook(() => useInstallPrompt())
    const evt = makeInstallEvent()

    act(() => {
      window.dispatchEvent(evt)
    })
    expect(evt.defaultPrevented).toBe(true)
    expect(result.current.canInstall).toBe(true)

    await act(async () => {
      result.current.promptInstall()
      await evt.userChoice
    })
    expect(evt.prompt).toHaveBeenCalledTimes(1)
    expect(result.current.canInstall).toBe(false)
  })

  test('appinstalled clears the offer', () => {
    const { result } = renderHook(() => useInstallPrompt())
    act(() => {
      window.dispatchEvent(makeInstallEvent())
    })
    expect(result.current.canInstall).toBe(true)
    act(() => {
      window.dispatchEvent(new Event('appinstalled'))
    })
    expect(result.current.canInstall).toBe(false)
  })
})
