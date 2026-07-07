import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditProfileModal } from '../components/EditProfileModal'

const updateMock = jest.fn().mockResolvedValue(undefined)
const confirmMock = jest.fn().mockResolvedValue(true)

jest.mock('../state/profile-context', () => ({
  useProfileContext: () => ({
    profile: {
      name: 'Bobby Washington',
      email: 'bobby.w@email.com',
      phone: '(555) 248-1190',
      careeName: 'Margaret Washington',
      bloodType: 'O+'
    },
    update: updateMock
  })
}))

jest.mock('../state/confirm-context', () => ({
  useConfirm: () => ({ confirm: confirmMock })
}))

describe('EditProfileModal (two-step discard guard)', () => {
  beforeEach(() => {
    updateMock.mockClear()
    confirmMock.mockClear()
  })

  test('closing an unchanged form does not prompt', async () => {
    const onClose = jest.fn()
    render(<EditProfileModal onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(confirmMock).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  test('closing a dirty form asks for a discard confirmation', async () => {
    const onClose = jest.fn()
    render(<EditProfileModal onClose={onClose} />)
    await userEvent.type(screen.getByLabelText('Full name'), '!')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(confirmMock).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(onClose).toHaveBeenCalled()) // confirm resolved true
  })

  test('keeping edits (confirm declined) leaves the modal open', async () => {
    confirmMock.mockResolvedValueOnce(false)
    const onClose = jest.fn()
    render(<EditProfileModal onClose={onClose} />)
    await userEvent.type(screen.getByLabelText('Full name'), '!')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(confirmMock).toHaveBeenCalled())
    expect(onClose).not.toHaveBeenCalled()
  })

  test('saving valid changes persists and closes', async () => {
    const onClose = jest.fn()
    render(<EditProfileModal onClose={onClose} />)
    await userEvent.type(screen.getByLabelText('Phone'), '0')
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))
    await waitFor(() => expect(updateMock).toHaveBeenCalled())
    expect(onClose).toHaveBeenCalled()
  })
})
