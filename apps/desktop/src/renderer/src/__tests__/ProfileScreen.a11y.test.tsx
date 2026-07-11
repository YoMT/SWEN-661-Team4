import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ProfileScreen } from '../screens/ProfileScreen'

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
    logout: jest.fn()
  })
}))

describe('ProfileScreen accessibility', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-density')
    document.documentElement.removeAttribute('data-reduce-motion')
    document.documentElement.removeAttribute('data-high-contrast')
  })

  test('has no axe violations', async () => {
    const { container } = render(<ProfileScreen onEdit={jest.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
