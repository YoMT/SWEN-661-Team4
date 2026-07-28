import React from 'react'
import { useAuthContext } from '@renderer/state/auth-context'
import { useProfileContext } from '@renderer/state/profile-context'
import { Link } from '@renderer/router'
import { NAV, type View } from '@renderer/components/nav'

// Re-export the nav *types* so existing type-only importers keep working. Type
// re-exports are erased at build, so this stays a component-only runtime module
// (Fast Refresh). The NAV value lives in ./nav — import it from there directly.
export type { View, NavItem } from '@renderer/components/nav'

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
