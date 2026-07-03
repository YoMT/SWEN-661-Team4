import { fireEvent, render, screen } from '@testing-library/react'
import { PeggyPanel } from '../components/PeggyPanel'
Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  value: jest.fn(),
  writable: true
})
const sendMessageMock = jest.fn()
const onCloseMock = jest.fn()

jest.mock('../state/ai-assistant-context', () => ({
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
    jest.clearAllMocks()
  })

  test('does not render when closed', () => {
    render(<PeggyPanel open={false} onClose={onCloseMock} />)

    expect(screen.queryByLabelText(/peggy assistant/i)).not.toBeInTheDocument()
  })

  test('renders Peggy panel messages and close button', () => {
    render(<PeggyPanel open={true} onClose={onCloseMock} />)

    expect(screen.getByLabelText(/peggy assistant/i)).toBeInTheDocument()
    expect(screen.getByText(/peggy/i)).toBeInTheDocument()
    expect(screen.getByText(/when is the next medication/i)).toBeInTheDocument()
    expect(screen.getByText(/the next dose is at 8:00 pm/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /close assistant/i }))
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  test('sends a typed message with send button', () => {
    render(<PeggyPanel open={true} onClose={onCloseMock} />)

    fireEvent.change(screen.getByLabelText(/message peggy/i), {
      target: { value: 'Help me review symptoms' }
    })

    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    expect(sendMessageMock).toHaveBeenCalledWith('Help me review symptoms')
  })

  test('sends a typed message with enter key', () => {
    render(<PeggyPanel open={true} onClose={onCloseMock} />)

    const input = screen.getByLabelText(/message peggy/i)

    fireEvent.change(input, {
      target: { value: 'Check appointments' }
    })

    fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
      shiftKey: false
    })

    expect(sendMessageMock).toHaveBeenCalledWith('Check appointments')
  })
})