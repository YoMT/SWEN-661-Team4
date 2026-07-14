import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { InfoDialog } from '../components/InfoDialog'

describe('InfoDialog accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(
      <InfoDialog title="Help Information" onClose={jest.fn()}>
        <p>This is helpful content.</p>
      </InfoDialog>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
