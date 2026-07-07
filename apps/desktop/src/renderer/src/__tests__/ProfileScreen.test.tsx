import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfileScreen } from '../screens/ProfileScreen'

const prefs = {
  theme: 'system',
  setTheme: jest.fn(),
  density: 'dense',
  setDensity: jest.fn(),
  toggleDensity: jest.fn(),
  textSize: 'standard',
  setTextSize: jest.fn(),
  reduceMotion: true,
  setReduceMotion: jest.fn(),
  highContrast: false,
  setHighContrast: jest.fn()
}

jest.mock('../state/preferences-context', () => ({
  usePreferences: () => prefs
}))
jest.mock('../state/profile-context', () => ({
  useProfileContext: () => ({
    profile: {
      name: 'Bobby Washington',
      email: 'b@w.com',
      phone: '(555) 111',
      bloodType: 'O+',
      careeName: 'Margaret'
    },
    isLoading: false,
    error: null
  })
}))
jest.mock('../state/auth-context', () => ({
  useAuthContext: () => ({ user: { name: 'Bobby Washington' }, logout: jest.fn() })
}))

describe('ProfileScreen (accessibility preferences)', () => {
  beforeEach(() => {
    Object.values(prefs).forEach((v) => typeof v === 'function' && (v as jest.Mock).mockClear())
  })

  test('renders the caregiver account details', () => {
    render(<ProfileScreen onEdit={jest.fn()} />)
    expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument()
    expect(screen.getAllByText(/Bobby Washington/).length).toBeGreaterThan(0)
  })

  test('choosing a theme calls setTheme', async () => {
    render(<ProfileScreen onEdit={jest.fn()} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Dark' }))
    expect(prefs.setTheme).toHaveBeenCalledWith('dark')
  })

  test('choosing a text size calls setTextSize', async () => {
    render(<ProfileScreen onEdit={jest.fn()} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Large' }))
    expect(prefs.setTextSize).toHaveBeenCalledWith('large')
  })

  test('toggling Tremor mode switches to accessible density', async () => {
    render(<ProfileScreen onEdit={jest.fn()} />)
    await userEvent.click(screen.getByRole('switch', { name: /tremor/i }))
    expect(prefs.setDensity).toHaveBeenCalledWith('accessible')
  })

  test('Edit button invokes the onEdit callback', async () => {
    const onEdit = jest.fn()
    render(<ProfileScreen onEdit={onEdit} />)
    await userEvent.click(screen.getByRole('button', { name: /^edit$/i }))
    expect(onEdit).toHaveBeenCalled()
  })
})
