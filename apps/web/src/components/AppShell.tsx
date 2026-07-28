import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from '@renderer/router'
import { SideNav, RailNav, BottomTabs } from '@renderer/components/Sidebar'
import { NAV, type View } from '@renderer/components/nav'
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

/**
 * Cycles keyboard focus between the shell's landmark regions
 * using F6 and Shift + F6.
 */
function cycleRegion(direction: 1 | -1): void {
  const regions = Array.from(
    document.querySelectorAll<HTMLElement>('[data-region]')
  )

  if (regions.length === 0) return

  const activeElement = document.activeElement as HTMLElement | null
  const currentRegion = activeElement?.closest<HTMLElement>('[data-region]')
  const currentIndex = currentRegion ? regions.indexOf(currentRegion) : -1

  const nextIndex =
    (currentIndex + direction + regions.length) % regions.length

  const nextRegion = regions[nextIndex]

  const focusableElement = nextRegion.querySelector<HTMLElement>(
    [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',')
  )

  ;(focusableElement ?? nextRegion).focus()
}

export function AppShell({
  view
}: {
  view: View
}): React.JSX.Element {
  const { navigate } = useRouter()

  const [peggyOpen, setPeggyOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [online, setOnline] = useState(() => navigator.onLine)

  // Reflect connectivity in the status strip (the SW serves cached data offline).
  useEffect(() => {
    const up = (): void => setOnline(true)
    const down = (): void => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  // Title + focus per route: move focus to the main region on navigation so
  // keyboard/SR users land on the new content (skip the initial mount).
  const firstView = useRef(true)
  useEffect(() => {
    document.title = `${TITLES[view]} · CareConnect`
    if (firstView.current) {
      firstView.current = false
      return
    }
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [view])

  // When the Peggy panel closes while focus was inside it, the browser drops
  // focus on <body>; hand it back to the toggle in the top bar instead.
  const prevPeggy = useRef(false)
  useEffect(() => {
    if (prevPeggy.current && !peggyOpen && document.activeElement === document.body) {
      document.getElementById('peggy-toggle')?.focus()
    }
    prevPeggy.current = peggyOpen
  }, [peggyOpen])

  const goto = useCallback(
    (nextView: View): void => {
      const destination = NAV.find((item) => item.id === nextView)

      if (destination) {
        navigate(destination.path)
      }
    },
    [navigate]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const modifierPressed = event.metaKey || event.ctrlKey
      const target = event.target as HTMLElement | null

      const userIsTyping =
        target !== null &&
        (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) ||
          target.isContentEditable)

      if (event.key === 'F6') {
        event.preventDefault()
        cycleRegion(event.shiftKey ? -1 : 1)
        return
      }

      if (
        modifierPressed &&
        event.key.toLowerCase() === 'j' &&
        !userIsTyping
      ) {
        event.preventDefault()
        setPeggyOpen((currentValue) => !currentValue)
        return
      }

      if (
        modifierPressed &&
        ['1', '2', '3', '4', '5'].includes(event.key) &&
        !userIsTyping
      ) {
        event.preventDefault()

        const navigationItem = NAV[Number(event.key) - 1]

        if (navigationItem) {
          goto(navigationItem.id)
        }

        return
      }

      const questionMarkPressed =
        event.key === '?' ||
        (event.code === 'Slash' && event.shiftKey)

      if (questionMarkPressed && !userIsTyping) {
        event.preventDefault()
        setShortcutsOpen(true)
        return
      }

      if (event.key === 'Escape') {
        setShortcutsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [goto])

  return (
    <div className="web-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <TopBar
        onTogglePeggy={() => setPeggyOpen((currentValue) => !currentValue)}
        onShowShortcuts={() => setShortcutsOpen(true)}
        peggyOpen={peggyOpen}
      />

      <div className="web-body">
        <div className="nav-left" data-region="navigation">
          <SideNav active={view} />
          <RailNav active={view} />
        </div>

        <main
          id="main"
          className="main"
          data-region="main"
          tabIndex={-1}
        >
          {view === 'dashboard' && (
            <DashboardScreen onNavigate={goto} />
          )}

          {view === 'medications' && <MedicationsScreen />}

          {view === 'appointments' && <AppointmentsScreen />}

          {view === 'symptoms' && <SymptomsScreen />}

          {view === 'profile' && (
            <ProfileScreen onEdit={() => setEditOpen(true)} />
          )}
        </main>

        {peggyOpen && (
          <div className="peggy-dock" data-region="assistant">
            <PeggyPanel
              open
              onClose={() => setPeggyOpen(false)}
            />
          </div>
        )}
      </div>

      <BottomTabs active={view} />

      <footer className="status-strip" data-region="contentinfo">
        <span aria-hidden="true">●</span>{' '}
        {online ? (
          <span>Synced just now</span>
        ) : (
          <span className="status-offline">Offline — showing cached data</span>
        )}
        <span className="status-spacer" />

        <span className="muted">
          CareConnect · demo data
        </span>
      </footer>

      {editOpen && (
        <EditProfileModal
          onClose={() => setEditOpen(false)}
        />
      )}

      {shortcutsOpen && (
        <InfoDialog
          title="Keyboard Shortcuts"
          onClose={() => setShortcutsOpen(false)}
        >
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
              <span>Mark a dose taken on Medications</span>
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