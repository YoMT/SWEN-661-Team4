import { Stack } from 'expo-router';
import { AccessibilityProvider } from '@/context/accessibility-context';
import { AuthProvider } from '@/context/auth-context';
import { CareDataProvider } from '@/context/care-data-provider';
import { DashboardProvider } from '@/context/dashboard-context';
import { AiAssistantProvider } from '@/context/ai-assistant-context';

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <CareDataProvider>
          <DashboardProvider>
            <AiAssistantProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </AiAssistantProvider>
          </DashboardProvider>
        </CareDataProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}
