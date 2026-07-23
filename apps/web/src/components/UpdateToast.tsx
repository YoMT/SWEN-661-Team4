import React, { useEffect, useState } from 'react'

/**
 * Listens for the service worker's "new version installed" signal (dispatched
 * from main.tsx as `cc:sw-updated`) and offers a one-click refresh. The new
 * worker already called skipWaiting + clients.claim, so a reload picks it up.
 */
export function UpdateToast(): React.JSX.Element | null {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = (): void => setVisible(true)
    window.addEventListener('cc:sw-updated', show)
    return () => window.removeEventListener('cc:sw-updated', show)
  }, [])

  if (!visible) return null

  return (
    <div className="toast" role="status" aria-live="polite">
      <span>A new version of CareConnect is available.</span>
      <button type="button" className="toast-action" onClick={() => window.location.reload()}>
        Refresh
      </button>
      <button
        type="button"
        className="toast-dismiss"
        onClick={() => setVisible(false)}
        aria-label="Dismiss update notice"
      >
        ✕
      </button>
    </div>
  )
}
