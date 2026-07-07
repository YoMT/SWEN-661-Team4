import React from 'react'
import { useProfileContext } from '@renderer/state/profile-context'
import { useAuthContext } from '@renderer/state/auth-context'
import { usePreferences, type ThemeMode, type TextSize } from '@renderer/state/preferences-context'

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

function Segmented<T extends string>({
  legend,
  value,
  options,
  onChange
}: {
  legend: string
  value: T
  options: { id: T; label: string }[]
  onChange: (v: T) => void
}): React.JSX.Element {
  return (
    <div className="toggle-row" role="radiogroup" aria-label={legend}>
      <span>{legend}</span>
      <div style={{ display: 'flex', gap: 8 }}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={value === o.id}
            className="btn-pill"
            aria-pressed={value === o.id}
            style={
              value === o.id
                ? undefined
                : {
                    background: 'transparent',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border-strong)'
                  }
            }
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface ProfileScreenProps {
  onEdit: () => void
}

export function ProfileScreen({ onEdit }: ProfileScreenProps): React.JSX.Element {
  const { profile, isLoading, error } = useProfileContext()
  const { user, logout } = useAuthContext()
  const {
    theme,
    setTheme,
    textSize,
    setTextSize,
    density,
    setDensity,
    reduceMotion,
    setReduceMotion,
    highContrast,
    setHighContrast
  } = usePreferences()

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

      {/* Display preferences */}
      <div className="card list-card">
        <Segmented<ThemeMode>
          legend="Theme"
          value={theme}
          onChange={setTheme}
          options={[
            { id: 'light', label: 'Light' },
            { id: 'dark', label: 'Dark' },
            { id: 'system', label: 'System' }
          ]}
        />
        <Segmented<TextSize>
          legend="Text size"
          value={textSize}
          onChange={setTextSize}
          options={[
            { id: 'standard', label: 'Standard' },
            { id: 'large', label: 'Large' },
            { id: 'largest', label: 'Largest' }
          ]}
        />
      </div>

      {/* Accessibility toggles */}
      <div className="card list-card">
        <Toggle
          label="Tremor (Accessible) mode"
          checked={density === 'accessible'}
          onChange={(on) => setDensity(on ? 'accessible' : 'dense')}
        />
        <Toggle label="Reduce motion" checked={reduceMotion} onChange={setReduceMotion} />
        <Toggle label="High contrast" checked={highContrast} onChange={setHighContrast} />
      </div>

      <button type="button" className="btn btn-outline signout-btn" onClick={() => void logout()}>
        Sign out
      </button>
    </div>
  )
}
