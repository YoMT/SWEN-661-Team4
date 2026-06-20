import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { ErrorBoundary } from '../../../shared/components/error-boundary';
import { AccessibilityProvider } from '../../../features/accessibility/accessibility-context';
import { ErrorProvider } from '../../../shared/context/error-context';
import { AuthProvider } from '../../../features/auth/auth-context';
import { RefreshProvider } from '../../../shared/context/refresh-context';
import { CareDataProvider } from '../../../shared/components/care-data-provider';
import { DashboardProvider } from '../../../features/dashboard/dashboard-context';
import { AiAssistantProvider } from '../../../features/ai-assistant/ai-assistant-context';

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <ErrorProvider>
          <AuthProvider>
            <RefreshProvider>
              <CareDataProvider>
                <DashboardProvider>
                  <AiAssistantProvider>
                    {children}
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

export async function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}
