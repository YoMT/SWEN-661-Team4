import { Stack } from 'expo-router';
import { AccessibilityProvider } from '@/features/accessibility/accessibility-context';
import { AuthProvider } from '@/features/auth/auth-context';
import { CareDataProvider } from '@/shared/components/care-data-provider';
import { DashboardProvider } from '@/features/dashboard/dashboard-context';
import { AiAssistantProvider } from '@/features/ai-assistant/ai-assistant-context';
import { ErrorBoundary } from '@/shared/components/error-boundary';
import { ErrorProvider } from '@/shared/context/error-context';
import { RefreshProvider } from '@/shared/context/refresh-context';
import { GlobalErrorToast } from '@/shared/components/global-error-toast';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <ErrorProvider>
          <AuthProvider>
            <RefreshProvider>
              <CareDataProvider>
                <DashboardProvider>
                  <AiAssistantProvider>
                    <GlobalErrorToast />
                    <Stack screenOptions={{ headerShown: false }} />
                  </AiAssistantProvider>
                </DashboardProvider>
              </CareDataProvider>
            </RefreshProvider>
          </AuthProvider>
        </ErrorProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}
