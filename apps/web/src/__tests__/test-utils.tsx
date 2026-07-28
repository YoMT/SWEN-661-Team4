import React, { useEffect, useRef } from 'react'
import { render } from '@testing-library/react'
import { AppProviders } from '@renderer/state/providers'
import { RouterProvider } from '@renderer/router'
import { useAuthContext } from '@renderer/state/auth-context'
import { DEMO_EMAIL, DEMO_PASSWORD } from '@renderer/services/mock-api'

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

/**
 * Logs in with the demo credentials once on mount, then renders its children.
 * The data contexts gate their fetches on `isLoggedIn`, so subtrees that need
 * loaded data (the app shell, the profile/medication contexts) must render
 * inside this. Children are held back until the login resolves — `login` sets
 * the auth token before flipping `isLoggedIn`, so gating on it guarantees any
 * request the children fire (e.g. saving a symptom) is authenticated rather
 * than racing the login and 401-ing. Assertions still `findBy*`/`waitFor` the
 * asynchronously-loaded data.
 */
function AutoLogin({ children }: { children: React.ReactNode }): React.JSX.Element | null {
  const { login, isLoggedIn } = useAuthContext()
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    void login(DEMO_EMAIL, DEMO_PASSWORD)
  }, [login])
  return isLoggedIn ? <>{children}</> : null
}

/** Providers with an authenticated session — for hook tests that need loaded data. */
export function AuthedProviders({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <AppProviders>
      <AutoLogin>{children}</AutoLogin>
    </AppProviders>
  )
}

/** Authenticated providers plus the router — for rendering the signed-in app shell. */
export function AuthedAllProviders({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <AppProviders>
      <RouterProvider>
        <AutoLogin>{children}</AutoLogin>
      </RouterProvider>
    </AppProviders>
  )
}

/** Like `renderWithProviders`, but signed in with the demo account. */
export function renderAuthed(ui: React.ReactElement): ReturnType<typeof render> {
  return render(ui, { wrapper: AuthedAllProviders })
}

export * from '@testing-library/react'
