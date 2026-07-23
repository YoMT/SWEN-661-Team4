import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../services/mock-api'

/** Sign in through the real login form and wait for the authed shell. */
async function loginToShell(): Promise<void> {
  const user = userEvent.setup()
  window.history.replaceState({}, '', '/login')
  render(<App />)
  await user.type(await screen.findByLabelText(/email address/i), DEMO_EMAIL)
  await user.type(screen.getByLabelText(/^password$/i), DEMO_PASSWORD)
  await user.click(screen.getByRole('button', { name: /sign in/i }))
  await screen.findByRole('button', { name: /ask peggy/i })
}

describe('web app shell integration', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  test('authed shell has skip link, landmarks, and focusable main', async () => {
    await loginToShell()
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main')
    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('id', 'main')
    expect(main).toHaveAttribute('tabindex', '-1')
    expect(screen.getAllByRole('navigation', { name: /primary/i }).length).toBeGreaterThan(0)
  })

  test('Ctrl+2 jumps to Medications and moves focus to main', async () => {
    await loginToShell()
    fireEvent.keyDown(document.body, { key: '2', ctrlKey: true })
    await screen.findByRole('heading', { level: 1, name: 'Medications' })
    expect(window.location.pathname).toBe('/medications')
    expect(screen.getByRole('main')).toHaveFocus()
  })

  test('F6 cycles focus between shell regions', async () => {
    await loginToShell()
    fireEvent.keyDown(document.body, { key: 'F6' })
    const region = document.activeElement?.closest('[data-region]')
    expect(region).not.toBeNull()
  })

  test('? opens the shortcuts dialog and Escape closes it', async () => {
    await loginToShell()
    fireEvent.keyDown(document.body, { key: '?' })
    expect(await screen.findByRole('dialog', { name: /keyboard shortcuts/i })).toBeInTheDocument()
    fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('Ctrl+J opens Peggy focused on the composer; Escape returns focus to the toggle', async () => {
    await loginToShell()
    fireEvent.keyDown(document.body, { key: 'j', ctrlKey: true })
    const composer = await screen.findByLabelText(/message peggy/i)
    expect(composer).toHaveFocus()
    fireEvent.keyDown(composer, { key: 'Escape' })
    expect(screen.queryByLabelText(/message peggy/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ask peggy/i })).toHaveFocus()
  })

  test('pre-auth route change moves focus to the new screen main region', async () => {
    const user = userEvent.setup()
    window.history.replaceState({}, '', '/')
    render(<App />)
    await user.click(await screen.findByRole('link', { name: /create account|get started/i }))
    await screen.findByRole('heading', { level: 1, name: /create account/i })
    expect(screen.getByRole('main')).toHaveFocus()
  })
})
