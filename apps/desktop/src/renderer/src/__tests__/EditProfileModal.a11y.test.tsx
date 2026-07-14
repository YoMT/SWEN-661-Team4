import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { EditProfileModal } from '../components/EditProfileModal'

jest.mock('../state/profile-context', () => ({
  useProfileContext: () => ({
    profile: {
      name: 'Margaret Johnson',
      careeName: 'Thomas Johnson',
      email: 'margaret@example.com',
      phone: '555-123-4567',
      bloodType: 'O+'
    },
    update: jest.fn()
  })
}))

describe('EditProfileModal accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(<EditProfileModal onClose={jest.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
