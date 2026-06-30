import React, { useRef } from 'react'
import { useUI } from '@renderer/state/ui-context'
import type { ActionId, NavView } from '@renderer/actions'

interface TBtn {
  action: ActionId
  label: string
  icon: string
  critical?: boolean // care-write → ≥44px (Pillar 1)
  primary?: boolean
}

// Contextual toolbar actions per screen (§3.3), limited to wired actions.
const PER_VIEW: Record<NavView, TBtn[]> = {
  dashboard: [
    { action: 'refresh', label: 'Refresh', icon: '↻' },
    { action: 'export-report', label: 'Export Report', icon: '📋' }
  ],
  medications: [
    { action: 'new-medication', label: 'Medication', icon: '＋', critical: true, primary: true }
  ],
  appointments: [
    { action: 'new-appointment', label: 'Appointment', icon: '＋', critical: true, primary: true }
  ],
  symptoms: [
    { action: 'log-symptom', label: 'Log Symptom', icon: '＋', critical: true, primary: true }
  ],
  profile: [{ action: 'edit-profile', label: 'Edit Profile', icon: '✎' }]
}

const TITLES: Record<NavView, string> = {
  dashboard: 'Dashboard',
  medications: 'Medications',
  appointments: 'Appointments',
  symptoms: 'Symptoms',
  profile: 'Profile'
}

const mod = navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'

/**
 * Contextual action strip (§3.3). The whole toolbar is one tab stop with roving
 * focus (←/→, Home/End); every icon button has a tooltip + aria-label that show
 * on hover *and* keyboard focus, so icon-only buttons are discoverable (§4.5).
 */
export function Toolbar({ run }: { run: (id: ActionId) => void }): React.JSX.Element {
  const { view, setPaletteOpen, assistantOpen, toggleAssistant } = useUI()
  const left = PER_VIEW[view]
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  // total focusable buttons = left actions + 2 right-aligned (search, assistant)
  const count = left.length + 2

  const onKeyDown = (e: React.KeyboardEvent, index: number): void => {
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % count
    else if (e.key === 'ArrowLeft') next = (index - 1 + count) % count
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = count - 1
    else return
    e.preventDefault()
    btnRefs.current[next]?.focus()
  }

  return (
    <div className="toolbar" role="toolbar" aria-label={`${TITLES[view]} actions`}>
      {left.map((b, i) => (
        <button
          key={b.action}
          ref={(el) => {
            btnRefs.current[i] = el
          }}
          type="button"
          className={`tbtn${b.primary ? ' primary' : ''}${b.critical ? ' critical' : ''}`}
          aria-label={b.label}
          title={b.label}
          tabIndex={i === 0 ? 0 : -1}
          onKeyDown={(e) => onKeyDown(e, i)}
          onClick={() => run(b.action)}
        >
          <span aria-hidden="true">{b.icon}</span>
          <span>{b.label}</span>
        </button>
      ))}

      <div className="toolbar-spacer" />

      <button
        ref={(el) => {
          btnRefs.current[left.length] = el
        }}
        type="button"
        className="tbtn"
        aria-label={`Search and commands (${mod}+K)`}
        title={`Search & commands · ${mod}+K`}
        tabIndex={left.length === 0 ? 0 : -1}
        onKeyDown={(e) => onKeyDown(e, left.length)}
        onClick={() => setPaletteOpen(true)}
      >
        <span aria-hidden="true">🔍</span>
        <span>{mod}+K</span>
      </button>
      <button
        ref={(el) => {
          btnRefs.current[left.length + 1] = el
        }}
        type="button"
        className="tbtn"
        aria-label="Toggle assistant panel"
        aria-pressed={assistantOpen}
        title={`Assistant (Peggy) · ${mod}+J`}
        tabIndex={-1}
        onKeyDown={(e) => onKeyDown(e, left.length + 1)}
        onClick={toggleAssistant}
      >
        <span aria-hidden="true">💬</span>
        <span>Peggy</span>
      </button>
    </div>
  )
}
