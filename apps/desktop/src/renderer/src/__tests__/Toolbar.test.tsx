import { fireEvent, render, screen } from '@testing-library/react'
import { Toolbar } from '../components/Toolbar'

const onCommandMock = jest.fn()

const actions = [
  { label: 'Add Medication', action: 'add-medication', primary: true },
  { label: 'Refresh', action: 'refresh' },
  { label: 'Export', action: 'export' }
]

describe('Toolbar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders toolbar actions', () => {
    render(<Toolbar actions={actions} onCommand={onCommandMock} />)

    expect(screen.getByRole('toolbar', { name: /actions/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add medication/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
  })

  test('calls onCommand when action buttons are clicked', () => {
    render(<Toolbar actions={actions} onCommand={onCommandMock} />)

    fireEvent.click(screen.getByRole('button', { name: /add medication/i }))
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }))
    fireEvent.click(screen.getByRole('button', { name: /export/i }))

    expect(onCommandMock).toHaveBeenCalledWith('add-medication')
    expect(onCommandMock).toHaveBeenCalledWith('refresh')
    expect(onCommandMock).toHaveBeenCalledWith('export')
  })

  test('moves focus with arrow keys, home, and end', () => {
    render(<Toolbar actions={actions} onCommand={onCommandMock} />)

    const addButton = screen.getByRole('button', { name: /add medication/i })
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    const exportButton = screen.getByRole('button', { name: /export/i })

    addButton.focus()
    expect(addButton).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('toolbar', { name: /actions/i }), {
      key: 'ArrowRight'
    })
    expect(refreshButton).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('toolbar', { name: /actions/i }), {
      key: 'End'
    })
    expect(exportButton).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('toolbar', { name: /actions/i }), {
      key: 'ArrowLeft'
    })
    expect(refreshButton).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('toolbar', { name: /actions/i }), {
      key: 'Home'
    })
    expect(addButton).toHaveFocus()
  })
})