import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from '@renderer/router'
import { SideNav, RailNav, BottomTabs, NAV, type View } from '@renderer/components/Sidebar'
import { TopBar } from '@renderer/components/TopBar'
import { PeggyPanel } from '@renderer/components/PeggyPanel'
import { EditProfileModal } from '@renderer/components/EditProfileModal'
import { InfoDialog } from '@renderer/components/InfoDialog'
import { DashboardScreen } from '@renderer/screens/DashboardScreen'
import { MedicationsScreen } from '@renderer/screens/MedicationsScreen'
import { AppointmentsScreen } from '@renderer/screens/AppointmentsScreen'
import { SymptomsScreen } from '@renderer/screens/SymptomsScreen'
import { ProfileScreen } from '@renderer/screens/ProfileScreen'

const TITLES: Record<View, string> = {
  dashboard: 'Dashboard',
  medications: 'Medications',
  appointments: 'Appointments',
  symptoms: 'Symptoms',
  profile: 'Profile'
}

/** Cycle focus between the shell's landmark regions with F6 / Shift+F6. */
function cycleRegion(dir: 1 | -1): void {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-region]'))
  if (nodes.length === 0) return
  const current = (document.activeElement as HTMLElement | null)?.closest('[data-region]')
  const idx = current ? nodes.indexOf(current as HTMLElement) : -1
  const next = nodes[(idx + dir + nodes.length) % nodes.length]
  const focusable = next.querySelector<HTMLElement>(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  )
  ;(focusable ?? next).focus()
}

export function AppShell({ view }: { view: View }): React.JSX.Element {
  const { navigate } = useRouter()
  const [peggyOpen, setPeggyOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  useEffect(() => {
    document.title = `${TITLES[view]} · CareConnect`
  }, [view])

  const goto = useCallback((v: View) => navigate(NAV.find((n) => n.id === v)!.path), [navigate])

  // Keyboard-first model: number jumps, assistant toggle, shortcuts, Esc.
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const mod = e.metaKey || e.ctrlKey
      const target = e.target as HTMLElement
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable

      if (e.key === 'F6') {
        e.preventDefault()
        cycleRegion(e.shiftKey ? -1 : 1)
        return
      }
      if (mod && e.key.toLowerCase() === 'j') {
        e.preventDefault()
        setPeggyOpen((p) => !p)
        return
      }
      if (mod && ['1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault()
        goto(NAV[Number(e.key) - 1].id)
        return
      }
      if (e.key === '?' && !typing) {
        e.preventDefault()
        setShortcutsOpen(true)
        return
      }
      if (e.key === 'Escape') {
        setShortcutsOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goto])

  return (
    <div className="web-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <TopBar
        onTogglePeggy={() => setPeggyOpen((p) => !p)}
        onShowShortcuts={() => setShortcutsOpen(true)}
        peggyOpen={peggyOpen}
      />

      <div className="web-body">
        <div className="nav-left" data-region="navigation">
          <SideNav active={view} />
          <RailNav active={view} />
        </div>

        <main id="main" className="main" data-region="main" tabIndex={-1}>
          {view === 'dashboard' && <DashboardScreen onNavigate={goto} />}
          {view === 'medications' && <MedicationsScreen />}
          {view === 'appointments' && <AppointmentsScreen />}
          {view === 'symptoms' && <SymptomsScreen />}
          {view === 'profile' && <ProfileScreen onEdit={() => setEditOpen(true)} />}
        </main>

        {peggyOpen && (
          <div className="peggy-dock" data-region="assistant">
            <PeggyPanel open onClose={() => setPeggyOpen(false)} />
          </div>
        )}
      </div>

      <BottomTabs active={view} />

      <footer className="status-strip" data-region="contentinfo">
        <span aria-hidden="true">●</span> Synced just now
        <span className="status-spacer" />
        <span className="muted">CareConnect · demo data</span>
      </footer>

      {editOpen && <EditProfileModal onClose={() => setEditOpen(false)} />}

      {shortcutsOpen && (
        <InfoDialog title="Keyboard Shortcuts" onClose={() => setShortcutsOpen(false)}>
          <ul className="shortcut-list">
            <li>
              <span>Go to Dashboard … Profile</span>
              <kbd>Ctrl/⌘ 1 … 5</kbd>
            </li>
            <li>
              <span>Toggle Peggy assistant</span>
              <kbd>Ctrl/⌘ J</kbd>
            </li>
            <li>
              <span>Cycle shell regions</span>
              <kbd>F6 / ⇧ F6</kbd>
            </li>
            <li>
              <span>Mark a dose taken (on Medications)</span>
              <kbd>Enter</kbd>
            </li>
            <li>
              <span>Open this help</span>
              <kbd>?</kbd>
            </li>
            <li>
              <span>Close overlay</span>
              <kbd>Esc</kbd>
            </li>
          </ul>
        </InfoDialog>
      )}
    </div>
  )
}
