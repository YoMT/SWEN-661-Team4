import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from './test-utils'
import { PeggyPanel } from '@renderer/components/PeggyPanel'
import { EditProfileModal } from '@renderer/components/EditProfileModal'
import { InfoDialog } from '@renderer/components/InfoDialog'

describe('PeggyPanel', () => {
  test('renders nothing when closed', () => {
    const { container } = renderWithProviders(<PeggyPanel open={false} onClose={jest.fn()} />)
    expect(container.querySelector('.peggy-panel')).toBeNull()
  })

  test('shows the empty state and sends a message on Enter', async () => {
    renderWithProviders(<PeggyPanel open onClose={jest.fn()} />)
    expect(screen.getByText(/How can I help/)).toBeInTheDocument()

    const input = screen.getByLabelText('Message Peggy')
    const send = screen.getByRole('button', { name: 'Send' })
    expect(send).toBeDisabled()

    fireEvent.change(input, { target: { value: 'tell me about her medication' } })
    expect(send).toBeEnabled()
    fireEvent.keyDown(input, { key: 'Enter' })

    // User bubble appears immediately; the mock assistant reply follows.
    expect(await screen.findByText('tell me about her medication')).toBeInTheDocument()
    expect(await screen.findByText(/Metoprolol/)).toBeInTheDocument()
  })

  test('close button invokes onClose', () => {
    const onClose = jest.fn()
    renderWithProviders(<PeggyPanel open onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: 'Close assistant' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('EditProfileModal', () => {
  test('blocks save with a validation error when the name is empty', async () => {
    renderWithProviders(<EditProfileModal onClose={jest.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
    expect(await screen.findByText('Full name is required.')).toBeInTheDocument()
  })

  test('saves valid changes and closes', async () => {
    const onClose = jest.fn()
    renderWithProviders(<EditProfileModal onClose={onClose} />)

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'New Name' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@name.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })

  test('cancelling with unsaved changes asks for confirmation', () => {
    const onClose = jest.fn()
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)
    renderWithProviders(<EditProfileModal onClose={onClose} />)

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Dirty' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(confirmSpy).toHaveBeenCalledWith('Discard changes?')
    expect(onClose).toHaveBeenCalledTimes(1)
    confirmSpy.mockRestore()
  })
})

describe('InfoDialog', () => {
  test('renders title + children and closes via the close button', () => {
    const onClose = jest.fn()
    render(
      <InfoDialog title="Help" onClose={onClose}>
        <p>Body content</p>
      </InfoDialog>
    )
    expect(screen.getByRole('dialog', { name: 'Help' })).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('closes on scrim mousedown and Escape, but not on inner mousedown', () => {
    const onClose = jest.fn()
    const { container } = render(
      <InfoDialog title="Help" onClose={onClose}>
        <p>Body</p>
      </InfoDialog>
    )
    const scrim = container.querySelector('.modal-scrim') as HTMLElement
    const card = container.querySelector('.modal-card') as HTMLElement

    fireEvent.mouseDown(card)
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.mouseDown(scrim)
    expect(onClose).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(scrim, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
