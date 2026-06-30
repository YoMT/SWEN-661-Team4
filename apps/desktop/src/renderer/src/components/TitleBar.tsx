import React, { useEffect, useState } from 'react'

const isMac = navigator.platform.toUpperCase().includes('MAC')

/**
 * Custom frameless title bar (§3.1). The bar is a drag region; the window
 * controls are real, labelled buttons excluded from the drag region. On macOS we
 * defer to the native traffic-light controls and just inset the title.
 */
export function TitleBar(): React.JSX.Element {
  const [maximized, setMaximized] = useState(false)

  useEffect(() => {
    window.api.window.isMaximized().then(setMaximized)
    return window.api.window.onMaximizeChange(setMaximized)
  }, [])

  return (
    <header className="titlebar" role="banner">
      <div
        className="titlebar-title"
        style={isMac ? { paddingLeft: 'var(--space-12)' } : undefined}
      >
        <span aria-hidden="true">❤️</span>
        <span>CareConnect</span>
      </div>
      <div className="titlebar-spacer" />
      {!isMac && (
        <div className="window-controls">
          <button
            type="button"
            className="window-control"
            aria-label="Minimize"
            onClick={() => window.api.window.minimize()}
          >
            <span aria-hidden="true">&#x2014;</span>
          </button>
          <button
            type="button"
            className="window-control"
            aria-label={maximized ? 'Restore' : 'Maximize'}
            onClick={() => window.api.window.toggleMaximize()}
          >
            <span aria-hidden="true">{maximized ? '🗗' : '🗖'}</span>
          </button>
          <button
            type="button"
            className="window-control close"
            aria-label="Close"
            onClick={() => window.api.window.close()}
          >
            <span aria-hidden="true">&#x2715;</span>
          </button>
        </div>
      )}
    </header>
  )
}
