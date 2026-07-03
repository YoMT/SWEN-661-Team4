// Integration tests: render the real <App/> with its real provider tree
// (AppProviders → all feature contexts → services/api → mock-api) and drive it
// through jsdom the way a user would. Unlike the component tests, nothing here is
// mocked, so these exercise the shell (App.tsx), every context, use-dashboard,
// and EditProfileModal end to end.
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../services/mock-api'

/** Render the app and sign in with the demo account; resolves on the dashboard. */
async function renderAndLogin(): Promise<ReturnType<typeof userEvent.setup>> {
  const user = userEvent.setup()
  render(<App />)

  // Landing → sign in
  await user.click(await screen.findByRole('button', { name: /sign in to continue/i }))

  // Login form → submit demo credentials
  await user.type(await screen.findByLabelText(/email address/i), DEMO_EMAIL)
  await user.type(screen.getByLabelText(/password/i), DEMO_PASSWORD)
  await user.click(screen.getByRole('button', { name: /^sign in$/i }))

  // Authenticated shell is up once the sidebar renders
  await screen.findByRole('navigation', { name: /main navigation/i })
  return user
}

describe('authentication flow', () => {
  test('starts on the landing page when cold-started', async () => {
    render(<App />)
    expect(await screen.findByRole('button', { name: /sign in to continue/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /care, organized/i })).toBeInTheDocument()
  })

  test('rejects invalid credentials with an error banner', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(await screen.findByRole('button', { name: /sign in to continue/i }))
    await user.type(await screen.findByLabelText(/email address/i), 'wrong@example.com')
    await user.type(screen.getByLabelText(/password/i), 'badpass')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid email or password/i)
  })

  test('signs in with the demo account and reaches the dashboard', async () => {
    await renderAndLogin()
    // Sidebar user + dashboard caree name come from the real profile context
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: /margaret johnson/i })).toBeInTheDocument()
  })

  test('signs out and returns to the signed-out view', async () => {
    const user = await renderAndLogin()
    await user.click(screen.getAllByRole('button', { name: /sign out/i })[0])
    // Gate keeps showLogin=true after a session, so it lands on the sign-in form.
    expect(await screen.findByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: /main navigation/i })).toBeNull()
  })
})

describe('navigation', () => {
  test('moves between all sections via the sidebar', async () => {
    const user = await renderAndLogin()
    const nav = screen.getByRole('navigation', { name: /main navigation/i })

    await user.click(within(nav).getByRole('button', { name: /medications/i }))
    expect(await screen.findByRole('heading', { name: /^medications$/i })).toBeInTheDocument()

    await user.click(within(nav).getByRole('button', { name: /appointments/i }))
    expect(await screen.findByRole('heading', { name: /^appointments$/i })).toBeInTheDocument()

    await user.click(within(nav).getByRole('button', { name: /symptoms/i }))
    expect(await screen.findByRole('heading', { name: /^symptoms$/i })).toBeInTheDocument()

    await user.click(within(nav).getByRole('button', { name: /profile/i }))
    expect(await screen.findByRole('heading', { name: /^profile$/i })).toBeInTheDocument()

    await user.click(within(nav).getByRole('button', { name: /dashboard/i }))
    expect(await screen.findByRole('heading', { name: /margaret johnson/i })).toBeInTheDocument()
  })
})

describe('feature interactions', () => {
  test('marks a due medication as taken', async () => {
    const user = await renderAndLogin()
    await user.click(
      within(screen.getByRole('navigation', { name: /main navigation/i })).getByRole('button', {
        name: /medications/i
      })
    )
    const takeBtn = await screen.findByRole('button', { name: /mark lisinopril as taken/i })
    await user.click(takeBtn)
    // After marking, the "mark as taken" control for that med disappears.
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /mark lisinopril as taken/i })).toBeNull()
    )
  })

  test('logs a symptom and shows a confirmation toast', async () => {
    const user = await renderAndLogin()
    await user.click(
      within(screen.getByRole('navigation', { name: /main navigation/i })).getByRole('button', {
        name: /symptoms/i
      })
    )
    await screen.findByRole('heading', { name: /^symptoms$/i })

    fireEvent.click(screen.getByRole('button', { name: /nausea/i }))
    fireEvent.click(screen.getByRole('button', { name: /severity 5/i }))
    fireEvent.change(screen.getByLabelText(/note/i), {
      target: { value: 'Felt sick after lunch' }
    })
    fireEvent.click(screen.getByRole('button', { name: /save to log/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/symptom logged/i)
  })

  test('opens Peggy and receives a contextual reply', async () => {
    const user = await renderAndLogin()
    await user.click(screen.getByRole('button', { name: /ask peggy/i }))

    const composer = await screen.findByRole('textbox', { name: /message peggy/i })
    await user.type(composer, 'What medication is due?')
    await user.click(screen.getByRole('button', { name: /^send$/i }))

    // The mock AI replies contextually about medications.
    expect(await screen.findByText(/metoprolol/i)).toBeInTheDocument()
  })

  test('edits the profile through the modal', async () => {
    const user = await renderAndLogin()
    await user.click(
      within(screen.getByRole('navigation', { name: /main navigation/i })).getByRole('button', {
        name: /profile/i
      })
    )
    // The profile screen's own Edit button (scoped to <main>) opens the modal.
    const main = await screen.findByRole('main')
    await user.click(within(main).getByRole('button', { name: /^edit$/i }))

    const dialog = await screen.findByRole('dialog', { name: /edit profile/i })
    const nameField = within(dialog).getByLabelText(/full name/i)
    await user.clear(nameField)
    await user.type(nameField, 'Alexandra Johnson')
    await user.click(within(dialog).getByRole('button', { name: /save changes/i }))

    // Modal closes on a successful save.
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /edit profile/i })).toBeNull())
  })
})
