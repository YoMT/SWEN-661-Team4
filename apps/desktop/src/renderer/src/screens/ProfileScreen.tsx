import React from 'react'
import { useUI, type ThemeMode, type TextSize } from '@renderer/state/ui-context'
import { useProfileContext } from '@renderer/state/profile-context'
import { useAuthContext } from '@renderer/state/auth-context'

function Switch({
  label,
  checked,
  onChange
}: {
  label: string
  checked: boolean
  onChange: () => void
}): React.JSX.Element {
  return (
    <div
      className="list-row"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-2) 0'
      }}
    >
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`btn ${checked ? 'btn-primary' : 'btn-outline'}`}
        onClick={onChange}
      >
        {checked ? 'On' : 'Off'}
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
    <fieldset
      style={{ border: 0, padding: 0, margin: '0 0 var(--space-3)' }}
      role="radiogroup"
      aria-label={legend}
    >
      <legend className="field-label">{legend}</legend>
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={value === o.id}
            className="quick-btn"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function ProfileScreen(): React.JSX.Element {
  const {
    theme,
    setTheme,
    textSize,
    setTextSize,
    density,
    toggleDensity,
    reduceMotion,
    toggleReduceMotion,
    announce
  } = useUI()
  const { profile } = useProfileContext()
  const { logout } = useAuthContext()

  const comingSoon = (what: string): void => announce(`${what} is coming soon`, false)

  return (
    <div className="content-inner">
      <h1 className="page-title">Profile</h1>
      <p className="page-sub">Caregiver account and accessibility settings</p>

      <div className="card">
        <p className="card-eyebrow">Account</p>
        <p className="card-main">{profile?.name ?? 'Caregiver'}</p>
        <p className="card-sub">{profile?.email}</p>
        {profile?.phone && <p className="card-sub">{profile.phone}</p>}
        <p className="card-sub" style={{ marginTop: 'var(--space-2)' }}>
          Caring for <strong>{profile?.careeName ?? 'your loved one'}</strong>
          {profile?.bloodType ? ` · Blood type ${profile.bloodType}` : ''}
        </p>
      </div>

      <p className="section-label">Accessibility</p>
      <div className="card">
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
        <Switch
          label="Tremor (Accessible) mode — larger controls and rows"
          checked={density === 'accessible'}
          onChange={toggleDensity}
        />
        <Switch label="Reduce motion" checked={reduceMotion} onChange={toggleReduceMotion} />
      </div>

      <p className="section-label">More</p>
      <div className="card">
        {['Emergency Contacts', 'Caretaker Notes', 'Generate Report'].map((label) => (
          <button
            key={label}
            type="button"
            className="list-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              border: 0,
              background: 'transparent',
              padding: 'var(--space-3) 0',
              color: 'var(--color-text)',
              font: 'var(--type-body-md)'
            }}
            onClick={() => comingSoon(label)}
          >
            <span>{label}</span>
            <span className="muted" aria-hidden="true">
              ›
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-outline critical"
        style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
        onClick={() => void logout()}
      >
        Sign out
      </button>
    </div>
  )
}
