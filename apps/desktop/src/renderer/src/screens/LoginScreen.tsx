import React, { useState, useCallback } from 'react'
import { useAuthContext } from '@renderer/state/auth-context'
import { validate } from '@renderer/services/validation'
import { DEMO_EMAIL, DEMO_PASSWORD } from '@renderer/services/mock-api'

export function LoginScreen(): React.JSX.Element {
  const { login, isLoading, errorMessage } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

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
    <div className="login-page">
      <header className="login-hero">
        <div className="login-hero-icon" aria-hidden="true">
          ❤️
        </div>
        <h1 className="login-brand">CareConnect</h1>
        <p className="login-tagline">Care management built for caregivers with tremors</p>
      </header>

      <form className="login-card" onSubmit={handleLogin}>
        <h2 className="login-card-title">Sign in</h2>

        {displayError && (
          <div className="error-banner" role="alert">
            ⚠️ {displayError}
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

        <p className="login-hint">
          Demo account — <code>{DEMO_EMAIL}</code> / <code>{DEMO_PASSWORD}</code>
        </p>
      </form>
    </div>
  )
}
