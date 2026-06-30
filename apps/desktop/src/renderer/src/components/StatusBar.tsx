import React from 'react'
import { useDashboard } from '@renderer/state/use-dashboard'

/**
 * Bottom info strip. A `contentinfo` landmark with non-interactive text
 * (DESKTOP_DESIGN_SYSTEM.md §3.7). Sync state uses icon + text, never color alone.
 */
export function StatusBar(): React.JSX.Element {
  const { givenDoses, totalDoses } = useDashboard()
  const due = Math.max(0, totalDoses - givenDoses)

  return (
    <footer className="statusbar" role="contentinfo" aria-label="Status">
      <span className="status-item">● Synced just now</span>
      <div className="status-spacer" />
      <span className="status-item">{due} due today</span>
    </footer>
  )
}
