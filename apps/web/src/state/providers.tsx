import React from 'react'
import { RefreshProvider } from '@renderer/state/refresh-context'
import { AuthProvider } from '@renderer/state/auth-context'
import { ProfileProvider } from '@renderer/state/profile-context'
import { MedicationProvider } from '@renderer/state/medication-context'
import { AppointmentProvider } from '@renderer/state/appointment-context'
import { SymptomProvider } from '@renderer/state/symptom-context'
import { AiAssistantProvider } from '@renderer/state/ai-assistant-context'

/**
 * Composes every feature provider in one place so App.tsx stays flat.
 * Order: Refresh (outermost, feeds the data providers) → Auth → data providers.
 */
export function AppProviders({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <RefreshProvider>
      <AuthProvider>
        <ProfileProvider>
          <MedicationProvider>
            <AppointmentProvider>
              <SymptomProvider>
                <AiAssistantProvider>{children}</AiAssistantProvider>
              </SymptomProvider>
            </AppointmentProvider>
          </MedicationProvider>
        </ProfileProvider>
      </AuthProvider>
    </RefreshProvider>
  )
}
