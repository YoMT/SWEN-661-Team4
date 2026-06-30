import React, { useEffect, useState } from 'react'

interface TitleBarProps {
  title: string
}

/**
 * Custom window chrome for the frameless window. The bar is a drag region;
 * the controls opt out via `no-drag`. Window actions go through the preload
 * `window.api.window` IPC bridge.
 */
export function TitleBar({ title }: TitleBarProps): React.JSX.Element {
  const isMac = window.api?.platform === 'darwin'
  const [maximized, setMaximized] = useState(false)

  useEffect(() => {
    window.api?.window.isMaximized().then(setMaximized)
    return window.api?.window.onMaximizedChange(setMaximized)
  }, [])

  return (
    <div className={`titlebar${isMac ? ' titlebar-mac' : ''}`}>
      <span className="titlebar-title">CareConnect — {title}</span>
      <div className="titlebar-spacer" />
      {!isMac && (
        <div className="titlebar-controls">
          <button
            type="button"
            className="win-btn"
            aria-label="Minimize"
            onClick={() => void window.api?.window.minimize()}
          >
            —
          </button>
          <button
            type="button"
            className="win-btn"
            aria-label={maximized ? 'Restore' : 'Maximize'}
            onClick={() => void window.api?.window.maximize()}
          >
            ▢
          </button>
          <button
            type="button"
            className="win-btn win-close"
            aria-label="Close"
            onClick={() => void window.api?.window.close()}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
