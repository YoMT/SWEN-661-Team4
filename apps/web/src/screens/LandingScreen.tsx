import React, { useEffect } from 'react'
import { Link } from '@renderer/router'
import heroImg from '../assets/hero.png'

/**
 * Public marketing landing (SEO surface). Two-column hero on desktop that stacks
 * to a single column on mobile. Warm off-white background per the design system.
 */
export function LandingScreen(): React.JSX.Element {
  useEffect(() => {
    document.title = 'CareConnect — A gentle helping hand for caregivers'
  }, [])

  return (
    <div className="landing">
      <header className="landing-top">
        <span className="landing-top-brand">
          <span aria-hidden="true">❤️</span> CareConnect
        </span>
        <Link to="/login" className="landing-top-signin">
          Sign in
        </Link>
      </header>

      <main id="main" className="landing-hero-grid">
        <section className="landing-copy">
          <span className="landing-pill">
            <span aria-hidden="true">❤️</span> Made for caregivers
          </span>
          <h1 className="landing-headline">
            A <span className="landing-accent">gentle helping hand</span> through every day.
          </h1>
          <p className="landing-lede">
            Keep track of medicines, visits, and little moments — without the worry. We&apos;ll
            remember the details so you don&apos;t have to.
          </p>
          <div className="landing-cta">
            <Link to="/signup" className="btn btn-primary landing-cta-btn">
              Get started — it&apos;s free →
            </Link>
            <Link to="/login" className="btn btn-outline landing-cta-btn">
              I already have an account
            </Link>
          </div>
          <Link to="/login" className="ask-pill">
            <span className="ask-text">+ Ask CareConnect</span>
            <span className="live-dot" aria-hidden="true" />
          </Link>
        </section>

        <div className="landing-media">
          <img
            className="landing-hero-image"
            src={heroImg}
            alt="A caregiver and an elderly woman sharing a warm moment"
          />
        </div>
      </main>
    </div>
  )
}
