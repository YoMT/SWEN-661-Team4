import React, { useState } from 'react'
import { AppProviders } from '@renderer/state/providers'
import { useAuthContext } from '@renderer/state/auth-context'
import { Sidebar, type View } from '@renderer/components/Sidebar'
import { LoginScreen } from '@renderer/screens/LoginScreen'
import { DashboardScreen } from '@renderer/screens/DashboardScreen'
import { MedicationsScreen } from '@renderer/screens/MedicationsScreen'
import { AppointmentsScreen } from '@renderer/screens/AppointmentsScreen'
import { SymptomsScreen } from '@renderer/screens/SymptomsScreen'

function AuthedApp(): React.JSX.Element {
  const [view, setView] = useState<View>('dashboard')

  return (
    <div className="app-shell">
      <Sidebar active={view} onNavigate={setView} />
      <main className="main">
        {view === 'dashboard' && <DashboardScreen onNavigate={setView} />}
        {view === 'medications' && <MedicationsScreen />}
        {view === 'appointments' && <AppointmentsScreen />}
        {view === 'symptoms' && <SymptomsScreen />}
      </main>
    </div>
  )
}

function Gate(): React.JSX.Element {
  const { isLoggedIn, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <div className="login-page">
        <p className="muted" style={{ marginTop: 80 }}>
          Loading CareConnect…
        </p>
      </div>
    )
  }

  return isLoggedIn ? <AuthedApp /> : <LoginScreen />
}

function App(): React.JSX.Element {
  return (
    <AppProviders>
      <Gate />
    </AppProviders>
  )
}

export default App
