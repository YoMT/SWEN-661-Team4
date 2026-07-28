import React, { useEffect, useRef } from 'react'
import { AppProviders } from '@renderer/state/providers'
import { RouterProvider, useRouter } from '@renderer/router'
import { useAuthContext } from '@renderer/state/auth-context'
import { AppShell } from '@renderer/components/AppShell'
import { UpdateToast } from '@renderer/components/UpdateToast'
import { LandingScreen } from '@renderer/screens/LandingScreen'
import { LoginScreen } from '@renderer/screens/LoginScreen'
import { SignupScreen } from '@renderer/screens/SignupScreen'
import type { View } from '@renderer/components/Sidebar'

const ROUTE_BY_PATH: Record<string, View> = {
  '/dashboard': 'dashboard',
  '/medications': 'medications',
  '/appointments': 'appointments',
  '/symptoms': 'symptoms',
  '/profile': 'profile'
}

// Where a logged-out deep link was headed, stashed across the landing → login
// flow so we can return there once the visitor authenticates. sessionStorage
// (not a ref) so it survives the page reload a direct URL / refresh triggers.
const REDIRECT_KEY = 'cc:redirectTo'

function Routes(): React.JSX.Element {
  const { isLoggedIn, isLoading } = useAuthContext()
  const { path, navigate } = useRouter()
  const view = ROUTE_BY_PATH[path]

  // Redirects: gate protected routes and bounce authed users off pre-auth pages.
  useEffect(() => {
    if (isLoading) return
    if (isLoggedIn) {
      // If a logged-out deep link was bounced to the landing page, return the
      // now-authenticated visitor to where they were originally headed.
      const pending = sessionStorage.getItem(REDIRECT_KEY)
      if (pending) {
        sessionStorage.removeItem(REDIRECT_KEY)
        navigate(pending, { replace: true })
        return
      }
      if (path === '/' || path === '/login' || path === '/signup' || !view) {
        navigate('/dashboard', { replace: true })
      }
    } else if (view) {
      // Protected route hit while logged out (direct URL or refresh): remember
      // the intended destination, then send the visitor to the landing page.
      sessionStorage.setItem(REDIRECT_KEY, path)
      navigate('/', { replace: true })
    }
  }, [isLoggedIn, isLoading, path, view, navigate])

  // Pre-auth route changes: move focus to the new screen's main region so
  // keyboard/SR users don't stay stranded on the old page's link. (The authed
  // shell does the same per-view inside AppShell.)
  const firstPath = useRef(true)
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false
      return
    }
    if (!isLoggedIn) document.getElementById('main')?.focus({ preventScroll: true })
  }, [path, isLoggedIn])

  if (isLoading) {
    return (
      <div className="boot">
        <p className="muted">Loading CareConnect…</p>
      </div>
    )
  }

  if (isLoggedIn) {
    if (view) return <AppShell view={view} />
    return (
      <div className="boot">
        <p className="muted">Redirecting…</p>
      </div>
    )
  }

  if (path === '/login') return <LoginScreen />
  if (path === '/signup') return <SignupScreen />
  return <LandingScreen />
}

export default function App(): React.JSX.Element {
  return (
    <AppProviders>
      <RouterProvider>
        <Routes />
        <UpdateToast />
      </RouterProvider>
    </AppProviders>
  )
}
