import React, { useEffect, useState } from 'react'
import { useProfileContext } from '@renderer/state/profile-context'
import { useAuthContext } from '@renderer/state/auth-context'

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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 className="page-title">Profile</h1>
        <button type="button" className="btn-pill" onClick={onEdit}>
          Edit
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {isLoading && !profile && <p className="muted">Loading profile…</p>}

      {/* Header card */}
      <div className="card profile-head">
        <div className="avatar avatar-lg" aria-hidden="true">
          {initials}
        </div>
        <div>
          <div className="profile-name">{name}</div>
          <div className="profile-role">
            Caregiver · caring for {profile?.careeName ?? 'your loved one'}
          </div>
        </div>
      </div>

      {/* Info tiles */}
      <div className="info-tiles">
        <div className="info-tile">
          <div className="info-label">Email</div>
          <div className="info-value">{profile?.email ?? '—'}</div>
        </div>
        <div className="info-tile">
          <div className="info-label">Phone</div>
          <div className="info-value">{profile?.phone ?? '—'}</div>
        </div>
        <div className="info-tile">
          <div className="info-label">Blood type</div>
          <div className="info-value">{profile?.bloodType ?? '—'}</div>
        </div>
      </div>

      <p className="section-label">Settings</p>

      {/* Link rows (targets out of scope — present but inert for now) */}
      <div className="card list-card">
        {LINK_ROWS.map((label, i) => (
          <div key={label} className={`link-row${i > 0 ? ' bordered' : ''}`}>
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

      <button type="button" className="btn btn-outline signout-btn" onClick={() => void logout()}>
        Sign out
      </button>
    </div>
  )
}
