import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginScreen } from '../screens/LoginScreen'

const loginMock = jest.fn()

jest.mock('../state/auth-context', () => ({
  useAuthContext: () => ({
    login: loginMock,
    isLoading: false,
    errorMessage: null
  })
}))

jest.mock('../services/mock-api', () => ({
  DEMO_EMAIL: 'demo@careconnect.com',
  DEMO_PASSWORD: 'password123'
}))

describe('LoginScreen', () => {
  beforeEach(() => {
    loginMock.mockClear()
  })

  test('renders login form and demo account hint', () => {
    render(<LoginScreen />)

    expect(screen.getByRole('heading', { name: /careconnect/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByText(/demo@careconnect.com/i)).toBeInTheDocument()
    expect(screen.getByText(/password123/i)).toBeInTheDocument()
  })

  test('shows validation error when form is submitted empty', async () => {
    const user = userEvent.setup()

    render(<LoginScreen />)

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(loginMock).not.toHaveBeenCalled()
  })

  test('calls login with email and password when form is valid', async () => {
    const user = userEvent.setup()

    render(<LoginScreen />)

    await user.type(screen.getByLabelText(/email address/i), 'demo@careconnect.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(loginMock).toHaveBeenCalledWith('demo@careconnect.com', 'password123')
  })
})