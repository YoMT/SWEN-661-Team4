import React, { useCallback, useEffect } from 'react'
import { AppProviders } from '@renderer/state/providers'
import { useUI } from '@renderer/state/ui-context'
import { useAuthContext } from '@renderer/state/auth-context'
import { useRefreshContext } from '@renderer/state/refresh-context'
import { NAV_OF_ACTION, type ActionId } from '@renderer/actions'
import { TitleBar } from '@renderer/components/TitleBar'
import { MenuBar } from '@renderer/components/MenuBar'
import { Toolbar } from '@renderer/components/Toolbar'
import { Sidebar } from '@renderer/components/Sidebar'
import { StatusBar } from '@renderer/components/StatusBar'
import { AssistantPanel } from '@renderer/components/AssistantPanel'
import { ConfirmDialog } from '@renderer/components/ConfirmDialog'
import { CommandPalette } from '@renderer/components/CommandPalette'
import { LoginScreen } from '@renderer/screens/LoginScreen'
import { DashboardScreen } from '@renderer/screens/DashboardScreen'
import { MedicationsScreen } from '@renderer/screens/MedicationsScreen'
import { AppointmentsScreen } from '@renderer/screens/AppointmentsScreen'
import { SymptomsScreen } from '@renderer/screens/SymptomsScreen'
import { ProfileScreen } from '@renderer/screens/ProfileScreen'

const REGIONS = ['.menubar', '.toolbar', '.sidebar', '.content', '.assistant', '.statusbar']

function focusLater(selector: string): void {
  requestAnimationFrame(() => (document.querySelector(selector) as HTMLElement | null)?.focus())
}

function CurrentScreen(): React.JSX.Element {
  const { view } = useUI()
  switch (view) {
    case 'medications':
      return <MedicationsScreen />
    case 'appointments':
      return <AppointmentsScreen />
    case 'symptoms':
      return <SymptomsScreen />
    case 'profile':
      return <ProfileScreen />
    default:
      return <DashboardScreen />
  }
}

function Shell(): React.JSX.Element {
  const ui = useUI()
  const { logout } = useAuthContext()
  const { triggerRefresh } = useRefreshContext()

  // Single dispatcher for every action source: native menu, in-window MenuBar,
  // toolbar, command palette and status bar.
  const run = useCallback(
    (id: ActionId) => {
      const nav = NAV_OF_ACTION[id]
      if (nav) {
        ui.setView(nav)
        if (nav === 'symptoms') focusLater('#log-symptom-first')
        return
      }
      switch (id) {
        case 'toggle-sidebar':
          ui.toggleSidebar()
          break
        case 'toggle-assistant':
          ui.toggleAssistant()
          break
        case 'text-standard':
          ui.setTextSize('standard')
          break
        case 'text-large':
          ui.setTextSize('large')
          break
        case 'text-largest':
          ui.setTextSize('largest')
          break
        case 'toggle-density':
          ui.toggleDensity()
          break
        case 'toggle-motion':
          ui.toggleReduceMotion()
          break
        case 'theme-light':
          ui.setTheme('light')
          break
        case 'theme-dark':
          ui.setTheme('dark')
          break
        case 'theme-system':
          ui.setTheme('system')
          break
        case 'command-palette':
          ui.setPaletteOpen(true)
          break
        case 'refresh':
          triggerRefresh()
          ui.announce('Refreshing data')
          break
        case 'sign-out':
          void logout()
          break
        case 'log-symptom':
          ui.setView('symptoms')
          focusLater('#log-symptom-first')
          break
        case 'new-medication':
          ui.setView('medications')
          ui.announce('New medication form is coming soon')
          break
        case 'new-appointment':
          ui.setView('appointments')
          ui.announce('New appointment form is coming soon')
          break
        case 'edit-profile':
          ui.setView('profile')
          ui.announce('Edit profile is coming soon')
          break
        case 'emergency-contacts':
        case 'caretaker-notes':
          ui.setView('profile')
          ui.announce('This section is coming soon')
          break
        case 'export-report':
          ui.announce('Export report is coming soon')
          break
        case 'shortcuts':
          ui.setPaletteOpen(true)
          break
        case 'user-guide':
        case 'about':
          ui.announce('Coming soon')
          break
      }
    },
    [ui, logout, triggerRefresh]
  )

  // Native-menu accelerators (§3.2) forward here.
  useEffect(() => window.api.onMenuAction((a) => run(a as ActionId)), [run])

  // Renderer-owned shortcuts not covered by the native menu (§4.1): ⌘K palette,
  // ⌘, settings, F6 region cycling, Esc precedence.
  useEffect(() => {
    const cycleRegion = (dir: number): void => {
      const els = REGIONS.map((s) => document.querySelector(s)).filter(Boolean) as HTMLElement[]
      if (els.length === 0) return
      const active = document.activeElement
      let idx = els.findIndex((r) => r.contains(active))
      if (idx === -1) idx = 0
      for (let k = 0; k < els.length; k++) {
        const nextIdx = (idx + dir * (k + 1) + els.length * (k + 1)) % els.length
        const region = els[nextIdx]
        const focusable = region.querySelector<HTMLElement>(
          'button:not([disabled]), a[href], input, textarea, [tabindex="0"]'
        )
        if (focusable) {
          focusable.focus()
          return
        }
      }
    }

    const onKey = (e: KeyboardEvent): void => {
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        ui.setPaletteOpen(true)
      } else if (mod && e.key === ',') {
        e.preventDefault()
        ui.setView('profile')
      } else if (e.key === 'F6') {
        e.preventDefault()
        cycleRegion(e.shiftKey ? -1 : 1)
      } else if (e.key === 'Escape') {
        if (ui.paletteOpen) ui.setPaletteOpen(false)
        else if (ui.assistantOpen) ui.setAssistantOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ui])

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TitleBar />
      <MenuBar run={run} />
      <Toolbar run={run} />

      <div className="app-body">
        <Sidebar />
        <main className="content" id="main" tabIndex={-1} aria-label="Main content">
          <CurrentScreen />
        </main>
        {ui.assistantOpen && <AssistantPanel />}
      </div>

      <StatusBar run={run} />

      <ConfirmDialog />
      {ui.paletteOpen && <CommandPalette run={run} />}

      {/* Live regions (§4.6) */}
      <div className="visually-hidden" aria-live="polite" role="status">
        {ui.live.assertive ? '' : ui.live.text}
      </div>
      <div className="visually-hidden" aria-live="assertive" role="alert">
        {ui.live.assertive ? ui.live.text : ''}
      </div>
    </div>
  )
}

function Gate(): React.JSX.Element {
  const { isLoggedIn, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <p className="muted">Loading CareConnect…</p>
      </div>
    )
  }

  return isLoggedIn ? <Shell /> : <LoginScreen />
}

function App(): React.JSX.Element {
  return (
    <AppProviders>
      <Gate />
    </AppProviders>
  )
}

export default App
