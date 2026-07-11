import './assets/theme.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Dev-only accessibility auditing: axe-core scans the rendered tree and logs any
// WCAG violations to the DevTools console (F12) on every render. Guarded to dev so
// it never ships in production and stays out of the Jest build.
if (import.meta.env.DEV) {
  void (async (): Promise<void> => {
    const React = await import('react')
    const ReactDOM = await import('react-dom')
    const axe = (await import('@axe-core/react')).default
    axe(React, ReactDOM, 1000)
  })()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
