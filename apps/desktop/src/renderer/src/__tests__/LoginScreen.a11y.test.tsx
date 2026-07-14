import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { LoginScreen } from '../screens/LoginScreen'

jest.mock('../state/auth-context', () => ({
  useAuthContext: () => ({
    login: jest.fn(),
    isLoading: false,
    errorMessage: null
  })
}))

jest.mock('../services/mock-api', () => ({
  DEMO_EMAIL: 'demo@careconnect.com',
  DEMO_PASSWORD: 'password123'
}))

describe('LoginScreen accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(<LoginScreen />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
