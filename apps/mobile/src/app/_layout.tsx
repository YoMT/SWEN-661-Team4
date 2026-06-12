import { Stack } from 'expo-router';
import { AccessibilityProvider } from '@/features/accessibility/accessibility-context';
import { AuthProvider } from '@/features/auth/auth-context';
import { CareDataProvider } from '@/shared/components/care-data-provider';
import { DashboardProvider } from '@/features/dashboard/dashboard-context';
import { AiAssistantProvider } from '@/features/ai-assistant/ai-assistant-context';

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
