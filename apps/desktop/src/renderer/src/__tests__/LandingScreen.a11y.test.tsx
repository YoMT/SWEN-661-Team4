import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { LandingScreen } from '../screens/LandingScreen'

describe('LandingScreen accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(<LandingScreen onGetStarted={jest.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
