import React, { useCallback, useEffect, useState } from 'react'
import { AppProviders } from '@renderer/state/providers'
import { useAuthContext } from '@renderer/state/auth-context'
import { useRefreshContext } from '@renderer/state/refresh-context'
import { Sidebar, type View } from '@renderer/components/Sidebar'
import { TitleBar } from '@renderer/components/TitleBar'
import { MenuBar } from '@renderer/components/MenuBar'
import { Toolbar, type ToolbarAction } from '@renderer/components/Toolbar'
import { StatusBar } from '@renderer/components/StatusBar'
import { CommandPalette } from '@renderer/components/CommandPalette'
import { InfoDialog } from '@renderer/components/InfoDialog'
import { LoginScreen } from '@renderer/screens/LoginScreen'
import { LandingScreen } from '@renderer/screens/LandingScreen'
import { DashboardScreen } from '@renderer/screens/DashboardScreen'
import { MedicationsScreen } from '@renderer/screens/MedicationsScreen'
import { AppointmentsScreen } from '@renderer/screens/AppointmentsScreen'
import { SymptomsScreen } from '@renderer/screens/SymptomsScreen'
import { ProfileScreen } from '@renderer/screens/ProfileScreen'
import { EditProfileModal } from '@renderer/components/EditProfileModal'
import { PeggyPanel } from '@renderer/components/PeggyPanel'

const TITLES: Record<View, string> = {
  dashboard: 'Dashboard',
  medications: 'Medications',
  appointments: 'Appointments',
  symptoms: 'Symptoms',
  profile: 'Profile'
}

const TOOLBARS: Record<View, ToolbarAction[]> = {
  dashboard: [
    { label: 'Export Report', action: 'export-report', primary: true },
    { label: 'Refresh', action: 'refresh' }
  ],
  medications: [
    { label: '+ Medication', action: 'new-medication', primary: true },
    { label: 'Refresh', action: 'refresh' }
  ],
  appointments: [{ label: '+ Appointment', action: 'new-appointment', primary: true }],
  symptoms: [{ label: '+ Log Symptom', action: 'log-symptom', primary: true }],
  profile: [
    { label: 'Edit', action: 'edit-profile', primary: true },
    { label: 'Generate Report', action: 'export-report' }
  ]
}

function cycleRegion(dir: 1 | -1): void {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-region]'))
  if (nodes.length === 0) return
  const current = (document.activeElement as HTMLElement | null)?.closest('[data-region]')
  const idx = current ? nodes.indexOf(current as HTMLElement) : -1
  const next = nodes[(idx + dir + nodes.length) % nodes.length]
  const focusable = next.querySelector<HTMLElement>(
    'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  )
  ;(focusable ?? next).focus()
}

function AuthedApp(): React.JSX.Element {
  const { logout } = useAuthContext()
  const { triggerRefresh } = useRefreshContext()
  const [view, setView] = useState<View>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [peggyOpen, setPeggyOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [dialog, setDialog] = useState<'help' | 'shortcuts' | 'about' | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const flash = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }, [])

  const runCommand = useCallback(
    (action: string) => {
      switch (action) {
        case 'nav-dashboard':
          setView('dashboard')
          break
        case 'nav-medications':
          setView('medications')
          break
        case 'nav-appointments':
          setView('appointments')
          break
        case 'nav-symptoms':
          setView('symptoms')
          break
        case 'nav-profile':
        case 'settings':
          setView('profile')
          break
        case 'toggle-sidebar':
          setSidebarOpen((p) => !p)
          break
        case 'toggle-assistant':
          setPeggyOpen((p) => !p)
          break
        case 'command-palette':
          setPaletteOpen(true)
          break
        case 'edit-profile':
          setView('profile')
          setEditOpen(true)
          break
        case 'refresh':
          triggerRefresh()
          flash('Refreshed')
          break
        case 'new-medication':
          setView('medications')
          flash('Add a medication from the Medications screen')
          break
        case 'new-appointment':
          setView('appointments')
          flash('Add an appointment from the Appointments screen')
          break
        case 'log-symptom':
          setView('symptoms')
          break
        case 'export-report':
          flash('Provider report generated (demo)')
          break
        case 'emergency-contacts':
        case 'caretaker-notes':
          flash('Coming soon')
          break
        case 'sign-out':
          void logout()
          break
        case 'help':
          setDialog('help')
          break
        case 'keyboard-shortcuts':
          setDialog('shortcuts')
          break
        case 'about':
          setDialog('about')
          break
      }
    },
    [logout, triggerRefresh, flash]
  )

  // Native menu accelerators forward here (the authoritative keyboard layer).
  useEffect(() => window.api?.onMenuAction(runCommand), [runCommand])

  // F6 / Shift+F6 cycle focus between shell regions (keyboard-first).
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'F6') {
        e.preventDefault()
        cycleRegion(e.shiftKey ? -1 : 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="window">
      <TitleBar title={TITLES[view]} />
      <MenuBar onCommand={runCommand} />

      <div className="app-body">
        {sidebarOpen && (
          <div data-region="sidebar" tabIndex={-1}>
            <Sidebar
              active={view}
              onNavigate={setView}
              onTogglePeggy={() => setPeggyOpen((p) => !p)}
            />
          </div>
        )}

        <div className="main-area">
          <div data-region="toolbar" tabIndex={-1}>
            <Toolbar actions={TOOLBARS[view]} onCommand={runCommand} />
          </div>
          <main className="main" data-region="main" tabIndex={-1}>
            {view === 'dashboard' && <DashboardScreen onNavigate={setView} />}
            {view === 'medications' && <MedicationsScreen />}
            {view === 'appointments' && <AppointmentsScreen />}
            {view === 'symptoms' && <SymptomsScreen />}
            {view === 'profile' && <ProfileScreen onEdit={() => setEditOpen(true)} />}
          </main>
        </div>

        {peggyOpen && (
          <div data-region="assistant" tabIndex={-1}>
            <PeggyPanel open onClose={() => setPeggyOpen(false)} />
          </div>
        )}
      </div>

      <StatusBar />

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}

      {editOpen && <EditProfileModal onClose={() => setEditOpen(false)} />}
      {paletteOpen && (
        <CommandPalette onClose={() => setPaletteOpen(false)} onCommand={runCommand} />
      )}
      {dialog === 'help' && (
        <InfoDialog title="User Guide" onClose={() => setDialog(null)}>
          <p className="muted">
            CareConnect helps you track medications, appointments and symptoms for the person in
            your care. Use the sidebar or <kbd>Ctrl/⌘ 1–5</kbd> to move between screens, and{' '}
            <kbd>Ctrl/⌘ J</kbd> to ask Peggy for help.
          </p>
        </InfoDialog>
      )}
      {dialog === 'shortcuts' && (
        <InfoDialog title="Keyboard Shortcuts" onClose={() => setDialog(null)}>
          <ul className="shortcut-list">
            <li>
              <span>New Medication / Appointment</span>
              <kbd>Ctrl/⌘ N · Ctrl/⌘ ⇧ N</kbd>
            </li>
            <li>
              <span>Go to Dashboard … Profile</span>
              <kbd>Ctrl/⌘ 1 … 5</kbd>
            </li>
            <li>
              <span>Toggle Sidebar / Assistant</span>
              <kbd>Ctrl/⌘ B · Ctrl/⌘ J</kbd>
            </li>
            <li>
              <span>Command palette</span>
              <kbd>Ctrl/⌘ K</kbd>
            </li>
            <li>
              <span>Export report</span>
              <kbd>Ctrl/⌘ E</kbd>
            </li>
            <li>
              <span>Cycle regions</span>
              <kbd>F6 / ⇧ F6</kbd>
            </li>
            <li>
              <span>Close overlay</span>
              <kbd>Esc</kbd>
            </li>
          </ul>
        </InfoDialog>
      )}
      {dialog === 'about' && (
        <InfoDialog title="About CareConnect" onClose={() => setDialog(null)}>
          <p className="muted">
            CareConnect Desktop — a keyboard-first, accessible care-management client. SWEN 661,
            Team 4.
          </p>
        </InfoDialog>
      )}
    </div>
  )
}

function Gate(): React.JSX.Element {
  const { isLoggedIn, isLoading } = useAuthContext()
  const [showLogin, setShowLogin] = useState(false)

  if (isLoading) {
    return (
      <div className="window">
        <TitleBar title="Loading" />
        <div className="boot">
          <p className="muted">Loading CareConnect…</p>
        </div>
      </div>
    )
  }

  if (isLoggedIn) return <AuthedApp />

  return (
    <div className="window">
      <TitleBar title={showLogin ? 'Sign in' : 'Welcome'} />
      {showLogin ? <LoginScreen /> : <LandingScreen onGetStarted={() => setShowLogin(true)} />}
    </div>
  )
}

function App(): React.JSX.Element {
  return (
    <AppProviders>
      <Gate />
    </AppProviders>
  )
}

export default App
