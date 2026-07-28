import React from 'react'
import { render } from '@testing-library/react'
import { AppProviders } from '@renderer/state/providers'
import { RouterProvider } from '@renderer/router'

/** Wraps a subtree in every feature provider plus the router, as the real app does. */
export function AllProviders({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <AppProviders>
      <RouterProvider>{children}</RouterProvider>
    </AppProviders>
  )
}

export function renderWithProviders(ui: React.ReactElement): ReturnType<typeof render> {
  return render(ui, { wrapper: AllProviders })
}

export * from '@testing-library/react'
