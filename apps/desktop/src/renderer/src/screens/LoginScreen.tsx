import React, { useState, useCallback } from 'react'
import { useAuthContext } from '@renderer/state/auth-context'
import { validate } from '@renderer/services/validation'
import { DEMO_EMAIL, DEMO_PASSWORD } from '@renderer/services/mock-api'

/**
 * Pre-auth split-screen sign-in (§3.10). Left form pane + right hero pane (hidden
 * below bp-sm). Focus starts in Email; Enter submits; errors announce via a
 * role="alert" live region. The hero uses a primary gradient (no external asset).
 */
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
    <div className="auth">
      <div className="auth-form-pane">
        <form onSubmit={handleLogin} style={{ maxWidth: 360, width: '100%', margin: '0 auto' }}>
          <div className="auth-brand">
            <span aria-hidden="true">❤️</span>
            <span>CareConnect</span>
          </div>
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-tagline">Care management built for caregivers with tremors</p>

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
              autoFocus
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

          <button type="submit" className="btn btn-primary block critical" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="auth-hint">
            Demo — <code>{DEMO_EMAIL}</code> / <code>{DEMO_PASSWORD}</code>
          </p>
        </form>
      </div>

      <div className="auth-hero" aria-hidden="true">
        <p className="auth-hero-quote">A gentle helping hand through every day.</p>
      </div>
    </div>
  )
}
