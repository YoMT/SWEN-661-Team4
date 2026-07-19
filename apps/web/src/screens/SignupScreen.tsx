import React, { useState, useCallback, useEffect } from 'react'
import { useAuthContext } from '@renderer/state/auth-context'
import { validate } from '@renderer/services/validation'
import { Link } from '@renderer/router'
import heroImg from '../assets/hero.png'

export function SignupScreen(): React.JSX.Element {
  const { signup, isLoading, errorMessage } = useAuthContext()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Create account · CareConnect'
  }, [])

  const handleSignup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const err = validate.signupForm(name, email, password)
      if (err) {
        setLocalError(err)
        return
      }
      setLocalError(null)
      await signup(name, email, password)
    },
    [name, email, password, signup]
  )

  const displayError = localError ?? errorMessage

  return (
    <div className="auth-split">
      <main id="main" className="auth-panel">
        <div className="auth-form">
          <span className="auth-brand">
            <span aria-hidden="true">❤️</span> CareConnect
          </span>
          <p className="auth-tagline">Care management built for caregivers with tremors</p>
          <h1 className="auth-title">Create account</h1>

          <form onSubmit={handleSignup} noValidate>
            {displayError && (
              <div className="error-banner" role="alert">
                ⚠️ {displayError}
              </div>
            )}

            <div className="field">
              <label className="field-label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                className="field-input"
                autoComplete="name"
                placeholder="Bobby Washington"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="su-email">
                Email address
              </label>
              <input
                id="su-email"
                className="field-input"
                type="email"
                autoComplete="username"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="su-password">
                Password
              </label>
              <input
                id="su-password"
                className="field-input"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
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
