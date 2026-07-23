import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { RouterProvider } from '../router'
import { SignupScreen } from '../screens/SignupScreen'

vi.mock('../state/auth-context', () => ({
  useAuthContext: () => ({
    signup: vi.fn(),
    isLoading: false,
    errorMessage: null
  })
}))

describe('SignupScreen accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(
      <RouterProvider>
        <SignupScreen />
      </RouterProvider>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  test('has a skip link targeting the main region', () => {
    render(
      <RouterProvider>
        <SignupScreen />
      </RouterProvider>
    )
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
  })
})
