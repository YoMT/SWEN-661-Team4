import React, { useEffect, useState } from 'react'
import { useProfileContext } from '@renderer/state/profile-context'
import { useAuthContext } from '@renderer/state/auth-context'
import { useInstallPrompt } from '@renderer/hooks/use-install-prompt'

const LINK_ROWS = [
  'Accessibility settings',
  'Emergency contacts',
  'Caretaker notes',
  'Generate provider report'
]

function Toggle({
  label,
  checked,
  onChange
}: {
  label: string
  checked: boolean
  onChange: (next: boolean) => void
}): React.JSX.Element {
  return (
    <div className="toggle-row">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`switch${checked ? ' on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="switch-knob" aria-hidden="true" />
      </button>
    </div>
  )
}

interface ProfileScreenProps {
  onEdit: () => void
}

export function ProfileScreen({ onEdit }: ProfileScreenProps): React.JSX.Element {
  const { profile, isLoading, error } = useProfileContext()
  const { user, logout } = useAuthContext()
  const { canInstall, promptInstall } = useInstallPrompt()

  const [tremor, setTremor] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  // Reflect accessibility preferences on the document root so global CSS can react.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.density = tremor ? 'accessible' : 'dense'
    root.dataset.reduceMotion = reduceMotion ? 'true' : 'false'
    root.dataset.highContrast = highContrast ? 'true' : 'false'
  }, [tremor, reduceMotion, highContrast])

  const name = profile?.name ?? user?.name ?? 'Caregiver'
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="main-inner">
      <div className="page-header row-between">
        <h1 className="page-title">Profile</h1>
        <button type="button" className="btn-pill" onClick={onEdit}>
          Edit
        </button>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}
      {isLoading && !profile && <p className="muted">Loading profile…</p>}

      {/* Header card */}
      <div className="card profile-head">
        <div className="avatar avatar-lg" aria-hidden="true">
          {initials}
        </div>
        <div>
          <h2 className="profile-name">{name}</h2>
          <p className="profile-role">
            Caregiver · caring for {profile?.careeName ?? 'your loved one'}
          </p>
        </div>
      </div>

      {/* Info tiles — name/value pairs, so a description list */}
      <dl className="info-tiles">
        <div className="info-tile">
          <dt className="info-label">Email</dt>
          <dd className="info-value">{profile?.email ?? '—'}</dd>
        </div>
        <div className="info-tile">
          <dt className="info-label">Phone</dt>
          <dd className="info-value">{profile?.phone ?? '—'}</dd>
        </div>
        <div className="info-tile">
          <dt className="info-label">Blood type</dt>
          <dd className="info-value">{profile?.bloodType ?? '—'}</dd>
        </div>
      </dl>

      <h2 className="section-label">Settings</h2>

      {/* Link rows (targets out of scope). aria-disabled rather than removing them from
          the tab order, so screen reader users can still discover the row and hear that
          it is not available yet. */}
      <div className="card list-card">
        {LINK_ROWS.map((label, i) => (
          <div
            key={label}
            role="button"
            tabIndex={0}
            aria-disabled="true"
            aria-label={`${label} (coming soon)`}
            className={`link-row${i > 0 ? ' bordered' : ''}`}
          >
            <span className="link-icon" aria-hidden="true" />
            <span className="link-label">{label}</span>
            <span className="link-chevron" aria-hidden="true">
              ›
            </span>
          </div>
        ))}
      </div>

      {/* Accessibility toggles */}
      <div className="card list-card">
        <Toggle label="Tremor (Accessible) mode" checked={tremor} onChange={setTremor} />
        <Toggle label="Reduce motion" checked={reduceMotion} onChange={setReduceMotion} />
        <Toggle label="High contrast" checked={highContrast} onChange={setHighContrast} />
      </div>

      {/* PWA install (web-only; renders nothing unless the browser offers install) */}
      {canInstall && (
        <div className="card list-card">
          <button type="button" className="link-row install-row" onClick={promptInstall}>
            <span className="link-icon" aria-hidden="true" />
            <span className="link-label">Install CareConnect app</span>
            <span className="link-chevron" aria-hidden="true">
              ›
            </span>
          </button>
        </div>
      )}

      <button type="button" className="btn btn-outline signout-btn" onClick={() => void logout()}>
        Sign out
      </button>
    </div>
  )
}
