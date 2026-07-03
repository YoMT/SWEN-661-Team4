import { fireEvent, render, screen } from '@testing-library/react'
import { ProfileScreen } from '../screens/ProfileScreen'

const logoutMock = jest.fn()
const onEditMock = jest.fn()

jest.mock('../state/profile-context', () => ({
  useProfileContext: () => ({
    profile: {
      name: 'Margaret Johnson',
      careeName: 'Thomas Johnson',
      email: 'margaret@example.com',
      phone: '555-123-4567',
      bloodType: 'O+'
    },
    isLoading: false,
    error: null
  })
}))

jest.mock('../state/auth-context', () => ({
  useAuthContext: () => ({
    user: {
      name: 'Margaret Johnson'
    },
    logout: logoutMock
  })
}))

describe('ProfileScreen', () => {
  beforeEach(() => {
    logoutMock.mockClear()
    onEditMock.mockClear()
    document.documentElement.removeAttribute('data-density')
    document.documentElement.removeAttribute('data-reduce-motion')
    document.documentElement.removeAttribute('data-high-contrast')
  })

  test('renders profile details', () => {
    render(<ProfileScreen onEdit={onEditMock} />)

    expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument()
    expect(screen.getByText(/margaret johnson/i)).toBeInTheDocument()
    expect(screen.getByText(/caregiver · caring for thomas johnson/i)).toBeInTheDocument()
    expect(screen.getByText(/margaret@example\.com/i)).toBeInTheDocument()
    expect(screen.getByText(/555-123-4567/i)).toBeInTheDocument()
    expect(screen.getByText(/o\+/i)).toBeInTheDocument()
  })

  test('renders settings links', () => {
    render(<ProfileScreen onEdit={onEditMock} />)

    expect(screen.getByText(/accessibility settings/i)).toBeInTheDocument()
    expect(screen.getByText(/emergency contacts/i)).toBeInTheDocument()
    expect(screen.getByText(/caretaker notes/i)).toBeInTheDocument()
    expect(screen.getByText(/generate provider report/i)).toBeInTheDocument()
  })

  test('calls onEdit when edit button is clicked', () => {
    render(<ProfileScreen onEdit={onEditMock} />)

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))

    expect(onEditMock).toHaveBeenCalledTimes(1)
  })

  test('toggles accessibility settings on the document root', () => {
    render(<ProfileScreen onEdit={onEditMock} />)

    fireEvent.click(screen.getByRole('switch', { name: /tremor/i }))
    fireEvent.click(screen.getByRole('switch', { name: /reduce motion/i }))
    fireEvent.click(screen.getByRole('switch', { name: /high contrast/i }))

    expect(document.documentElement.dataset.density).toBe('accessible')
    expect(document.documentElement.dataset.reduceMotion).toBe('true')
    expect(document.documentElement.dataset.highContrast).toBe('true')
  })

  test('calls logout when sign out button is clicked', () => {
    render(<ProfileScreen onEdit={onEditMock} />)

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))

    expect(logoutMock).toHaveBeenCalledTimes(1)
  })
})