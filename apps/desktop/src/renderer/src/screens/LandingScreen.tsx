import React from 'react'

interface LandingScreenProps {
  onGetStarted: () => void
}

/**
 * Pre-auth landing window (DESKTOP_DESIGN_SYSTEM.md §3.9): warm hero band with a
 * brown headline accent and a primary "Ask CareConnect" pill carrying a green
 * "AI online" live-dot. Both calls-to-action route to sign-in.
 */
export function LandingScreen({ onGetStarted }: LandingScreenProps): React.JSX.Element {
  return (
    <div className="landing">
      <div className="landing-hero">
        <div className="landing-mark" aria-hidden="true">
          ❤️
        </div>
        <h1 className="landing-headline">
          Care, <span className="landing-accent">organized.</span>
        </h1>
        <p className="landing-lede">
          CareConnect helps caregivers track medications, appointments and symptoms — built for
          keyboard-first use and designed for hands that shake.
        </p>

        <button type="button" className="ask-pill" onClick={onGetStarted}>
          <span className="live-dot" aria-hidden="true" />
          <span className="live-label">AI online</span>
          <span className="ask-text">+ Ask CareConnect</span>
        </button>

        <button type="button" className="landing-signin" onClick={onGetStarted}>
          Sign in to continue →
        </button>

        <div className="landing-features">
          <div className="landing-feature">
            <strong>Medications</strong>
            <span>Doses, adherence, reminders</span>
          </div>
          <div className="landing-feature">
            <strong>Appointments</strong>
            <span>Visits, video calls, schedules</span>
          </div>
          <div className="landing-feature">
            <strong>Peggy assistant</strong>
            <span>Ask about care, any time</span>
          </div>
        </div>
      </div>
    </div>
  )
}
