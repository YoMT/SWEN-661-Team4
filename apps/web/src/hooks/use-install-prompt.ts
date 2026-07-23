import { useCallback, useEffect, useState } from 'react'

/** Chrome's non-standard install event (not in lib.dom). */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Captures `beforeinstallprompt` so the app can offer its own "Install" action
 * (surfaced in ProfileScreen). `canInstall` stays false when the browser never
 * fires the event — e.g. already installed, iOS Safari, or unsupported.
 */
export function useInstallPrompt(): { canInstall: boolean; promptInstall: () => void } {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Already running as an installed app — never offer install.
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const onPrompt = (e: Event): void => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = (): void => setDeferred(null)

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = useCallback((): void => {
    if (!deferred) return
    void deferred.prompt()
    void deferred.userChoice.then(() => setDeferred(null))
  }, [deferred])

  return { canInstall: deferred !== null, promptInstall }
}
