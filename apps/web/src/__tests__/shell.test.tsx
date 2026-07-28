import { renderAuthed, screen, fireEvent, waitFor } from './test-utils'
import { AppShell } from '@renderer/components/AppShell'

// AppShell is driven by its `view` prop (the real App re-derives it from the route),
// so in isolation we assert navigation by the URL the router pushes.
beforeEach(() => {
  window.history.pushState({}, '', '/')
})

describe('AppShell — screens', () => {
  test('dashboard shows the caree and stat tiles', async () => {
    renderAuthed(<AppShell view="dashboard" />)
    expect(await screen.findByRole('heading', { name: 'Margaret Johnson' })).toBeInTheDocument()
    expect(screen.getByText('Doses today')).toBeInTheDocument()
    // Quick-action button pushes the medications route.
    fireEvent.click(screen.getByRole('button', { name: 'Medications' }))
    await waitFor(() => expect(window.location.pathname).toBe('/medications'))
  })

  test('medications list renders and a dose can be marked taken', async () => {
    renderAuthed(<AppShell view="medications" />)
    expect(await screen.findByText(/Metoprolol/)).toBeInTheDocument()

    const markButtons = await screen.findAllByRole('button', { name: /Mark .* as taken/ })
    fireEvent.click(markButtons[0])
    await waitFor(() =>
      expect(screen.getAllByText('Taken').length).toBeGreaterThan(0)
    )
  })

  test('appointments render today + upcoming sections', async () => {
    renderAuthed(<AppShell view="appointments" />)
    expect(await screen.findByRole('heading', { name: 'Appointments' })).toBeInTheDocument()
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
  })

  test('symptoms: pick a symptom/severity, add a note, and save', async () => {
    renderAuthed(<AppShell view="symptoms" />)
    expect(await screen.findByRole('heading', { name: 'Symptoms' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Pain/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Severity 5' }))
    fireEvent.change(screen.getByLabelText('Note (optional)'), {
      target: { value: 'sharp pain in the morning' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save to log' }))

    // The ✓ lives in an aria-hidden span, so match the visible label text
    // (RTL's default matcher only sees the element's direct text node).
    expect(await screen.findByText(/Symptom logged/)).toBeInTheDocument()
  })

  test('profile: toggles flip and Edit opens the modal', async () => {
    renderAuthed(<AppShell view="profile" />)
    expect(await screen.findByRole('heading', { name: 'Profile' })).toBeInTheDocument()

    const tremor = screen.getByRole('switch', { name: 'Tremor (Accessible) mode' })
    expect(tremor).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(tremor)
    expect(tremor).toHaveAttribute('aria-checked', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(await screen.findByRole('dialog', { name: 'Edit Profile' })).toBeInTheDocument()
  })
})

describe('AppShell — overlays and keyboard', () => {
  test('Ask Peggy button opens the assistant panel', async () => {
    renderAuthed(<AppShell view="dashboard" />)
    await screen.findByRole('heading', { name: 'Margaret Johnson' })

    fireEvent.click(screen.getByRole('button', { name: /Ask Peggy/ }))
    expect(await screen.findByRole('complementary', { name: 'Peggy assistant' })).toBeInTheDocument()
  })

  test('shortcuts button opens the help dialog', async () => {
    renderAuthed(<AppShell view="dashboard" />)
    await screen.findByRole('heading', { name: 'Margaret Johnson' })

    fireEvent.click(screen.getByRole('button', { name: 'Keyboard shortcuts' }))
    expect(await screen.findByRole('dialog', { name: 'Keyboard Shortcuts' })).toBeInTheDocument()
  })

  test('keyboard shortcuts: "?" opens help, Escape closes, Ctrl+J toggles Peggy, Ctrl+2 navigates', async () => {
    renderAuthed(<AppShell view="dashboard" />)
    await screen.findByRole('heading', { name: 'Margaret Johnson' })

    fireEvent.keyDown(window, { key: '?' })
    expect(await screen.findByRole('dialog', { name: 'Keyboard Shortcuts' })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Keyboard Shortcuts' })).not.toBeInTheDocument()
    )

    fireEvent.keyDown(window, { key: 'j', ctrlKey: true })
    expect(await screen.findByRole('complementary', { name: 'Peggy assistant' })).toBeInTheDocument()

    fireEvent.keyDown(window, { key: '2', ctrlKey: true })
    await waitFor(() => expect(window.location.pathname).toBe('/medications'))
  })
})
