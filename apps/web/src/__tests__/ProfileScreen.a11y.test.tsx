import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ProfileScreen } from '../screens/ProfileScreen'

vi.mock('../state/profile-context', () => ({
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

vi.mock('../state/auth-context', () => ({
  useAuthContext: () => ({
    user: {
      name: 'Margaret Johnson'
    },
    logout: vi.fn()
  })
}))

describe('ProfileScreen accessibility', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-density')
    document.documentElement.removeAttribute('data-reduce-motion')
    document.documentElement.removeAttribute('data-high-contrast')
  })

  test('has no axe violations', async () => {
    const { container } = render(<ProfileScreen onEdit={vi.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  test('uses semantic headings and a description list for contact info', () => {
    const { container } = render(<ProfileScreen onEdit={vi.fn()} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Profile' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /margaret johnson/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Settings' })).toBeInTheDocument()
    expect(container.querySelector('dl.info-tiles')).not.toBeNull()
    expect(screen.getByText('Email').tagName).toBe('DT')
    expect(screen.getByText('margaret@example.com').tagName).toBe('DD')
  })
})
