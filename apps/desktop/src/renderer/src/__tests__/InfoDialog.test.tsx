import { render, screen, fireEvent } from '@testing-library/react'
import { InfoDialog } from '../components/InfoDialog'

describe('InfoDialog', () => {
  test('renders title and children', () => {
    const onClose = jest.fn()

    render(
      <InfoDialog title="Help Information" onClose={onClose}>
        <p>This is helpful content.</p>
      </InfoDialog>
    )

    expect(screen.getByRole('dialog', { name: 'Help Information' })).toBeInTheDocument()
    expect(screen.getByText('This is helpful content.')).toBeInTheDocument()
  })

  test('calls onClose when close button is clicked', () => {
    const onClose = jest.fn()

    render(
      <InfoDialog title="Help Information" onClose={onClose}>
        <p>Dialog content</p>
      </InfoDialog>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  test('calls onClose when Escape key is pressed', () => {
    const onClose = jest.fn()

    render(
      <InfoDialog title="Help Information" onClose={onClose}>
        <p>Dialog content</p>
      </InfoDialog>
    )

    fireEvent.keyDown(screen.getByText('Dialog content').closest('.modal-scrim')!, {
      key: 'Escape'
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})