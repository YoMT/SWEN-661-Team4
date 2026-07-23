import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { PeggyPanel } from '../components/PeggyPanel'

const sendMessageMock = vi.fn()
const onCloseMock = vi.fn()

vi.mock('../state/ai-assistant-context', () => ({
  useAiAssistantContext: () => ({
    messages: [
      { id: '1', role: 'user', content: 'When is the next medication?' },
      { id: '2', role: 'assistant', content: 'The next dose is at 8:00 PM.' }
    ],
    isTyping: false,
    errorMessage: null,
    sendMessage: sendMessageMock
  })
}))

describe('PeggyPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('has no axe violations', async () => {
    const { container } = render(<PeggyPanel open onClose={onCloseMock} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  test('does not render when closed', () => {
    render(<PeggyPanel open={false} onClose={onCloseMock} />)
    expect(screen.queryByLabelText(/peggy assistant/i)).not.toBeInTheDocument()
  })

  test('renders messages and closes with the close button', () => {
    render(<PeggyPanel open onClose={onCloseMock} />)
    expect(screen.getByText(/when is the next medication/i)).toBeInTheDocument()
    expect(screen.getByText(/the next dose is at 8:00 pm/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /close assistant/i }))
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  test('Escape inside the panel closes it', () => {
    render(<PeggyPanel open onClose={onCloseMock} />)
    fireEvent.keyDown(screen.getByLabelText(/message peggy/i), { key: 'Escape' })
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  test('sends a typed message with the send button', () => {
    render(<PeggyPanel open onClose={onCloseMock} />)
    fireEvent.change(screen.getByLabelText(/message peggy/i), {
      target: { value: 'Help me review symptoms' }
    })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(sendMessageMock).toHaveBeenCalledWith('Help me review symptoms')
  })
})
