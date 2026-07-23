import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { RouterProvider } from '../router'
import { LoginScreen } from '../screens/LoginScreen'

vi.mock('../state/auth-context', () => ({
  useAuthContext: () => ({
    login: vi.fn(),
    isLoading: false,
    errorMessage: null
  })
}))

describe('LoginScreen accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(
      <RouterProvider>
        <LoginScreen />
      </RouterProvider>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  test('has a skip link targeting the main region', () => {
    render(
      <RouterProvider>
        <LoginScreen />
      </RouterProvider>
    )
    const skip = screen.getByRole('link', { name: /skip to content/i })
    expect(skip).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
  })
})
