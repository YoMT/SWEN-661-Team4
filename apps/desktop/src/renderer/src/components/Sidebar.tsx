import React from 'react'
import { useAuthContext } from '@renderer/state/auth-context'
import { useProfileContext } from '@renderer/state/profile-context'

export type View = 'dashboard' | 'medications' | 'appointments' | 'symptoms'

const NAV: { id: View; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'medications', label: 'Medications', icon: '💊' },
  { id: 'appointments', label: 'Appointments', icon: '📅' },
  { id: 'symptoms', label: 'Symptoms', icon: '📝' }
]

interface SidebarProps {
  active: View
  onNavigate: (view: View) => void
}

export function Sidebar({ active, onNavigate }: SidebarProps): React.JSX.Element {
  const { user, logout } = useAuthContext()
  const { profile } = useProfileContext()
  const initial = user?.name?.[0]?.toUpperCase() ?? 'C'

  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="sidebar-brand">
        <span aria-hidden="true">❤️</span>
        <span>CareConnect</span>
      </div>

      <div className="sidebar-nav">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item${active === item.id ? ' active' : ''}`}
            aria-current={active === item.id ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar" aria-hidden="true">
            {initial}
          </div>
          <div>
            <div className="sidebar-user-name">{user?.name ?? 'Caregiver'}</div>
            <div className="sidebar-user-sub">
              Caring for {profile?.careeName ?? 'your loved one'}
            </div>
          </div>
        </div>
        <button type="button" className="logout-btn" onClick={() => void logout()}>
          Sign out
        </button>
      </div>
    </nav>
  )
}
