import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { CommandPalette } from '../components/CommandPalette'

describe('CommandPalette accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(<CommandPalette onClose={jest.fn()} onCommand={jest.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
