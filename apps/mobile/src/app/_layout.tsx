import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/auth-context';
import { DashboardProvider } from '@/context/dashboard-context';
import { MedicationProvider } from '@/context/medication-context';
import { AppointmentProvider } from '@/context/appointment-context';
import { SymptomProvider } from '@/context/symptom-context';
import { AccessibilityProvider } from '@/context/accessibility-context';
import { EmergencyProvider } from '@/context/emergency-context';
import { CaretakerProvider } from '@/context/caretaker-context';
import { ProfileProvider } from '@/context/profile-context';
import { AiAssistantProvider } from '@/context/ai-assistant-context';

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <DashboardProvider>
          <MedicationProvider>
            <AppointmentProvider>
              <SymptomProvider>
                <EmergencyProvider>
                  <CaretakerProvider>
                    <ProfileProvider>
                      <AiAssistantProvider>
                        <Stack screenOptions={{ headerShown: false }} />
                      </AiAssistantProvider>
                    </ProfileProvider>
                  </CaretakerProvider>
                </EmergencyProvider>
              </SymptomProvider>
            </AppointmentProvider>
          </MedicationProvider>
        </DashboardProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}
