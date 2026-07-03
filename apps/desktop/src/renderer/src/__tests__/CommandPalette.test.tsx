import { fireEvent, render, screen } from '@testing-library/react'
import { CommandPalette } from '../components/CommandPalette'

const onCloseMock = jest.fn()
const onCommandMock = jest.fn()

describe('CommandPalette', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders command palette and command search', () => {
    render(<CommandPalette onClose={onCloseMock} onCommand={onCommandMock} />)

    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/command search/i)).toBeInTheDocument()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  test('filters commands by search text', () => {
    render(<CommandPalette onClose={onCloseMock} onCommand={onCommandMock} />)

    fireEvent.change(screen.getByLabelText(/command search/i), {
      target: { value: 'zzzz-no-match' }
    })

    expect(screen.getByText(/no matching commands/i)).toBeInTheDocument()
  })

  test('runs selected command with enter key', () => {
    render(<CommandPalette onClose={onCloseMock} onCommand={onCommandMock} />)

    fireEvent.keyDown(screen.getByRole('dialog', { name: /command palette/i }), {
      key: 'Enter'
    })

    expect(onCloseMock).toHaveBeenCalledTimes(1)
    expect(onCommandMock).toHaveBeenCalledTimes(1)
  })

  test('closes with escape key and scrim click', () => {
    const { container } = render(
      <CommandPalette onClose={onCloseMock} onCommand={onCommandMock} />
    )

    fireEvent.keyDown(screen.getByRole('dialog', { name: /command palette/i }), {
      key: 'Escape'
    })

    fireEvent.mouseDown(container.querySelector('.palette-scrim') as Element)

    expect(onCloseMock).toHaveBeenCalledTimes(2)
  })

  test('moves active command with arrow keys and runs clicked command', () => {
    render(<CommandPalette onClose={onCloseMock} onCommand={onCommandMock} />)

    const dialog = screen.getByRole('dialog', { name: /command palette/i })

    fireEvent.keyDown(dialog, { key: 'ArrowDown' })
    fireEvent.keyDown(dialog, { key: 'ArrowUp' })

    const options = screen.getAllByRole('option')
    fireEvent.mouseEnter(options[0])
    fireEvent.click(options[0])

    expect(onCloseMock).toHaveBeenCalled()
    expect(onCommandMock).toHaveBeenCalled()
  })
})