import React from 'react'
import { useAuthContext } from '@renderer/state/auth-context'
import { useProfileContext } from '@renderer/state/profile-context'
import { Link } from '@renderer/router'

export type View = 'dashboard' | 'medications' | 'appointments' | 'symptoms' | 'profile'

export interface NavItem {
  id: View
  label: string
  short: string
  icon: string
  path: string
}

export const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', short: 'Home', icon: '🏠', path: '/dashboard' },
  { id: 'medications', label: 'Medications', short: 'Meds', icon: '💊', path: '/medications' },
  { id: 'appointments', label: 'Appointments', short: 'Appts', icon: '📅', path: '/appointments' },
  { id: 'symptoms', label: 'Symptoms', short: 'Sympt.', icon: '📝', path: '/symptoms' },
  { id: 'profile', label: 'Profile', short: 'Profile', icon: '👤', path: '/profile' }
]

/** Desktop (≥1200px): persistent labelled sidebar with an account footer. */
export function SideNav({ active }: { active: View }): React.JSX.Element {
  const { user, logout } = useAuthContext()
  const { profile } = useProfileContext()
  const initial = user?.name?.[0]?.toUpperCase() ?? 'C'

  return (
    <nav className="side-nav" aria-label="Primary">
      <div className="side-nav-list">
        {NAV.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-item${active === item.id ? ' active' : ''}`}
            aria-current={active === item.id ? 'page' : undefined}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="side-nav-footer">
        <div className="side-nav-user">
          <div className="avatar" aria-hidden="true">
            {initial}
          </div>
          <div>
            <div className="side-nav-user-name">{user?.name ?? 'Caregiver'}</div>
            <div className="side-nav-user-sub">
              Caring for {profile?.careeName ?? 'your loved one'}
            </div>
          </div>
        </div>
        <button type="button" className="btn btn-outline signout-inline" onClick={() => void logout()}>
          Sign out
        </button>
      </div>
    </nav>
  )
}

/** Tablet (768–1199px): compact icon rail with micro-labels. */
export function RailNav({ active }: { active: View }): React.JSX.Element {
  return (
    <nav className="rail-nav" aria-label="Primary">
      {NAV.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          className={`rail-item${active === item.id ? ' active' : ''}`}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <span className="rail-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="rail-label">{item.short}</span>
        </Link>
      ))}
    </nav>
  )
}

/** Mobile (<768px): fixed bottom tab bar (thumb-reach). */
export function BottomTabs({ active }: { active: View }): React.JSX.Element {
  return (
    <nav className="bottom-tabs" aria-label="Primary">
      {NAV.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          className={`tab-item${active === item.id ? ' active' : ''}`}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <span className="tab-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="tab-label">{item.short}</span>
        </Link>
      ))}
    </nav>
  )
}
