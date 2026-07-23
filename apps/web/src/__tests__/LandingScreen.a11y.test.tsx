import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { RouterProvider } from '../router'
import { LandingScreen } from '../screens/LandingScreen'

describe('LandingScreen accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(
      <RouterProvider>
        <LandingScreen />
      </RouterProvider>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  test('has a skip link and a single h1', () => {
    render(
      <RouterProvider>
        <LandingScreen />
      </RouterProvider>
    )
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
})
