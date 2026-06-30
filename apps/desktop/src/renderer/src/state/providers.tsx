import React from 'react'
import { UIProvider } from '@renderer/state/ui-context'
import { RefreshProvider } from '@renderer/state/refresh-context'
import { AuthProvider } from '@renderer/state/auth-context'
import { ProfileProvider } from '@renderer/state/profile-context'
import { MedicationProvider } from '@renderer/state/medication-context'
import { AppointmentProvider } from '@renderer/state/appointment-context'
import { SymptomProvider } from '@renderer/state/symptom-context'

/**
 * Composes every provider in one place so App.tsx stays flat.
 * Order: UI (prefs/chrome) → Refresh (feeds data providers) → Auth → data.
 */
export function AppProviders({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <UIProvider>
      <RefreshProvider>
        <AuthProvider>
          <ProfileProvider>
            <MedicationProvider>
              <AppointmentProvider>
                <SymptomProvider>{children}</SymptomProvider>
              </AppointmentProvider>
            </MedicationProvider>
          </ProfileProvider>
        </AuthProvider>
      </RefreshProvider>
    </UIProvider>
  )
}
