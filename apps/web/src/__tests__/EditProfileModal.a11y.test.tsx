import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { EditProfileModal } from '../components/EditProfileModal'

vi.mock('../state/profile-context', () => ({
  useProfileContext: () => ({
    profile: {
      name: 'Margaret Johnson',
      careeName: 'Thomas Johnson',
      email: 'margaret@example.com',
      phone: '555-123-4567',
      bloodType: 'O+'
    },
    update: vi.fn()
  })
}))

describe('EditProfileModal accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(<EditProfileModal onClose={vi.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  test('focuses the first field on open', () => {
    render(<EditProfileModal onClose={vi.fn()} />)
    expect(screen.getByLabelText('Full name')).toHaveFocus()
  })

  test('Escape closes via a document-level handler', () => {
    const onClose = vi.fn()
    render(<EditProfileModal onClose={onClose} />)
    fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('Escape with dirty form asks for confirmation', () => {
    const onClose = vi.fn()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<EditProfileModal onClose={onClose} />)
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'New Name' } })
    fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(confirmSpy).toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
    confirmSpy.mockRestore()
  })

  test('Tab wraps focus inside the dialog', async () => {
    const user = userEvent.setup()
    render(<EditProfileModal onClose={vi.fn()} />)
    // Shift+Tab from the first focusable wraps to the last (Save Changes).
    screen.getByRole('button', { name: 'Close' }).focus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: /save changes/i })).toHaveFocus()
    // Tab from the last wraps back to the first.
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
  })

  test('phone field is a tel input', () => {
    render(<EditProfileModal onClose={vi.fn()} />)
    expect(screen.getByLabelText('Phone')).toHaveAttribute('type', 'tel')
  })
})
