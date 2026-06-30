import React from 'react'
import { useUI } from '@renderer/state/ui-context'
import { useMedicationContext } from '@renderer/state/medication-context'
import type { ActionId } from '@renderer/actions'

const THEME_LABEL = { light: 'Light', dark: 'Dark', system: 'System' } as const
const TEXT_LABEL = { standard: 'A', large: 'A+', largest: 'A++' } as const

/**
 * Bottom status strip (§3.7). It's a contentinfo landmark; display text is not in
 * the tab order, but the actionable "due today" count is Tab-reachable with a
 * label. Sync state uses an icon + text, never color alone (§1.4.1).
 */
export function StatusBar({ run }: { run: (id: ActionId) => void }): React.JSX.Element {
  const { theme, textSize, density } = useUI()
  const { totalDoses, givenDoses, isLoading } = useMedicationContext()
  const due = Math.max(0, totalDoses - givenDoses)

  return (
    <footer className="statusbar" role="contentinfo" aria-label="Status">
      <span className="status-chip">
        <span className="status-dot" aria-hidden="true" />
        {isLoading ? 'Syncing…' : 'Synced just now'}
      </span>
      <span className="spacer" />
      <span aria-hidden="true">All systems normal</span>
      <span className="spacer" />
      {due > 0 ? (
        <button
          type="button"
          onClick={() => run('nav-medications')}
          aria-label={`${due} doses due today, go to Medications`}
        >
          {due} due today
        </button>
      ) : (
        <span>All doses taken</span>
      )}
      <span aria-hidden="true">·</span>
      <span aria-label={`Text size ${textSize}`}>{TEXT_LABEL[textSize]}</span>
      <span aria-hidden="true">·</span>
      <span aria-label={`Theme ${THEME_LABEL[theme]}`}>{THEME_LABEL[theme]}</span>
      {density === 'accessible' && (
        <>
          <span aria-hidden="true">·</span>
          <span aria-label="Tremor accessible mode on">Tremor</span>
        </>
      )}
    </footer>
  )
}
