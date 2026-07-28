import React from 'react'
import { useAuthContext } from '@renderer/state/auth-context'
import { Link } from '@renderer/router'

interface TopBarProps {
  onTogglePeggy: () => void
  onShowShortcuts: () => void
  peggyOpen: boolean
}

/** App banner: brand home link, assistant toggle, shortcuts, account avatar. */
export function TopBar({ onTogglePeggy, onShowShortcuts, peggyOpen }: TopBarProps): React.JSX.Element {
  const { user } = useAuthContext()
  const initial = user?.name?.[0]?.toUpperCase() ?? 'C'

  return (
    <header className="top-bar">
      <Link to="/dashboard" className="top-brand" aria-label="CareConnect home">
        <span aria-hidden="true">❤️</span>
        <span>CareConnect</span>
      </Link>

      <div className="top-spacer" />

      <button
        id="peggy-toggle"
        type="button"
        className="top-action"
        onClick={onTogglePeggy}
        aria-pressed={peggyOpen}
        title="Ask Peggy (Ctrl/⌘ J)"
      >
        <span aria-hidden="true">🤖</span>
        <span className="top-action-label">Ask Peggy</span>
      </button>

      <button
        type="button"
        className="top-icon-btn"
        onClick={onShowShortcuts}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        ?
      </button>

      <Link to="/profile" className="top-avatar" aria-label={`Profile — ${user?.name ?? 'account'}`}>
        {initial}
      </Link>
    </header>
  )
}
