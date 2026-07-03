import { fireEvent, render, screen } from '@testing-library/react'
import { MenuBar } from '../components/MenuBar'

const onCommandMock = jest.fn()

describe('MenuBar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders top-level application menus', () => {
    render(<MenuBar onCommand={onCommandMock} />)

    expect(screen.getByRole('menubar', { name: /application menu/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /file/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument()
  })

  test('opens a menu and runs a command', () => {
    render(<MenuBar onCommand={onCommandMock} />)

    fireEvent.click(screen.getByRole('button', { name: /file/i }))

    const menuItems = screen.getAllByRole('menuitem')
    fireEvent.click(menuItems[0])

    expect(onCommandMock).toHaveBeenCalledTimes(1)
  })

  test('supports keyboard navigation between top menus', () => {
    render(<MenuBar onCommand={onCommandMock} />)

    const fileButton = screen.getByRole('button', { name: /file/i })

    fireEvent.keyDown(fileButton, { key: 'ArrowDown' })
    expect(fileButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(fileButton, { key: 'ArrowRight' })
    expect(screen.getByRole('button', { name: /edit/i })).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(screen.getByRole('button', { name: /edit/i }), { key: 'ArrowLeft' })
    expect(screen.getByRole('button', { name: /file/i })).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(screen.getByRole('button', { name: /file/i }), { key: 'Escape' })
    expect(screen.getByRole('button', { name: /file/i })).toHaveAttribute('aria-expanded', 'false')
  })

  test('closes an open menu when clicking outside', () => {
    render(
      <div>
        <MenuBar onCommand={onCommandMock} />
        <button type="button">Outside</button>
      </div>
    )

    const fileButton = screen.getByRole('button', { name: /file/i })

    fireEvent.click(fileButton)
    expect(fileButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.mouseDown(screen.getByRole('button', { name: /outside/i }))
    expect(fileButton).toHaveAttribute('aria-expanded', 'false')
  })
})