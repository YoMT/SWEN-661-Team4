import React, { useState, useCallback, useEffect } from 'react'
import { useAuthContext } from '@renderer/state/auth-context'
import { validate } from '@renderer/services/validation'
import { DEMO_EMAIL, DEMO_PASSWORD } from '@renderer/services/mock-api'
import { Link } from '@renderer/router'
import heroImg from '../assets/hero.png'

export function LoginScreen(): React.JSX.Element {
  const { login, isLoading, errorMessage } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Sign in · CareConnect'
  }, [])

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const err = validate.loginForm(email, password)
      if (err) {
        setLocalError(err)
        return
      }
      setLocalError(null)
      await login(email, password)
    },
    [email, password, login]
  )

  const displayError = localError ?? errorMessage

  return (
    <div className="auth-split">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <main id="main" className="auth-panel" tabIndex={-1}>
        <div className="auth-form">
          <span className="auth-brand">
            <span aria-hidden="true">❤️</span> CareConnect
          </span>
          <p className="auth-tagline">Care management built for caregivers with tremors</p>
          <h1 className="auth-title">Sign in</h1>

          <form onSubmit={handleLogin} noValidate>
            {displayError && (
              <div className="error-banner" role="alert">
                <span aria-hidden="true">⚠️</span> {displayError}
              </div>
            )}

            <div className="field">
              <label className="field-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                className="field-input"
                type="email"
                autoComplete="username"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="field-input"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="login-hint">
            Demo account — <code>{DEMO_EMAIL}</code> / <code>{DEMO_PASSWORD}</code>
          </p>
          <p className="auth-switch">
            Don&apos;t have an account? <Link to="/signup">Create account</Link>
          </p>
        </div>
      </main>

      <aside
        className="auth-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
        aria-hidden="true"
      >
        <p className="auth-hero-tagline">Care management built for caregivers with tremors.</p>
      </aside>
    </div>
  )
}
