import React, { useRef } from 'react'
import { useUI } from '@renderer/state/ui-context'
import { useAuthContext } from '@renderer/state/auth-context'
import { useProfileContext } from '@renderer/state/profile-context'
import { useMedicationContext } from '@renderer/state/medication-context'
import { useAppointmentContext } from '@renderer/state/appointment-context'
import type { NavView } from '@renderer/actions'

interface NavDef {
  id: NavView
  label: string
  icon: string
  badge?: number
}

/**
 * Primary navigation (§3.4) — replaces the mobile bottom tab bar. The list is a
 * single tab stop with roving focus (↑/↓/Home/End), Enter/Space activates, and
 * the active item carries aria-current="page". ⌘1…5 jump here from anywhere.
 */
export function Sidebar(): React.JSX.Element {
  const { view, setView, sidebarCollapsed } = useUI()
  const { user } = useAuthContext()
  const { profile } = useProfileContext()
  const { totalDoses, givenDoses } = useMedicationContext()
  const { todayAppointments } = useAppointmentContext()

  const dueDoses = Math.max(0, totalDoses - givenDoses)

  const items: NavDef[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'medications', label: 'Medications', icon: '💊', badge: dueDoses || undefined },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: '📅',
      badge: todayAppointments.length || undefined
    },
    { id: 'symptoms', label: 'Symptoms', icon: '📝' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ]

  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const activeIndex = items.findIndex((i) => i.id === view)

  const onKeyDown = (e: React.KeyboardEvent, index: number): void => {
    let next = index
    if (e.key === 'ArrowDown') next = (index + 1) % items.length
    else if (e.key === 'ArrowUp') next = (index - 1 + items.length) % items.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = items.length - 1
    else return
    e.preventDefault()
    btnRefs.current[next]?.focus()
  }

  const initial = user?.name?.[0]?.toUpperCase() ?? 'C'

  return (
    <nav className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}`} aria-label="Primary">
      <ul className="sidebar-section" role="list" style={{ flex: '0 0 auto' }}>
        {items.map((item, i) => {
          const active = item.id === view
          return (
            <li key={item.id} role="listitem">
              <button
                ref={(el) => {
                  btnRefs.current[i] = el
                }}
                type="button"
                className={`nav-item${active ? ' active' : ''}`}
                aria-current={active ? 'page' : undefined}
                tabIndex={activeIndex === -1 ? (i === 0 ? 0 : -1) : active ? 0 : -1}
                title={sidebarCollapsed ? item.label : undefined}
                onClick={() => setView(item.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="nav-label">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="nav-badge" aria-label={`${item.badge} items`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="avatar" aria-hidden="true">
            {initial}
          </span>
          <div className="sidebar-user-meta">
            <div className="sidebar-user-name">{user?.name ?? 'Caregiver'}</div>
            <div className="sidebar-user-sub">
              Caring for {profile?.careeName ?? 'your loved one'}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
