import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SymptomsScreen } from '../screens/SymptomsScreen'

const addLogMock = jest.fn()

jest.mock('../state/symptom-context', () => ({
  useSymptomContext: () => ({
    logs: [
      {
        id: 'log-1',
        symptom: 'pain',
        severity: 4,
        note: 'Headache after lunch',
        createdAt: new Date(Date.now() - 10 * 60000).toISOString()
      }
    ],
    isLoading: false,
    error: null,
    addLog: addLogMock
  })
}))

describe('SymptomsScreen', () => {
  beforeEach(() => {
    addLogMock.mockClear()
    jest.useRealTimers()
  })

  test('renders symptoms page and recent logs', () => {
    render(<SymptomsScreen />)

    expect(screen.getByRole('heading', { name: /symptoms/i })).toBeInTheDocument()
    expect(screen.getByText(/what's bothering margaret today/i)).toBeInTheDocument()
    expect(screen.getByText(/log a symptom/i)).toBeInTheDocument()
    expect(screen.getByText(/recent logs/i)).toBeInTheDocument()
    expect(screen.getByText(/headache after lunch/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/severity 4 of 5/i)).toBeInTheDocument()
  })

  test('allows selecting symptom and severity, then saves a log', async () => {
    render(<SymptomsScreen />)

    fireEvent.click(screen.getByRole('button', { name: /nausea/i }))
    fireEvent.click(screen.getByRole('button', { name: /severity 5/i }))
    fireEvent.change(screen.getByLabelText(/note/i), {
      target: { value: 'Feeling sick after dinner' }
    })

    fireEvent.click(screen.getByRole('button', { name: /save to log/i }))

    await waitFor(() => {
      expect(addLogMock).toHaveBeenCalledWith({
        symptom: 'nausea',
        severity: 5,
        note: 'Feeling sick after dinner'
      })
    })

    expect(screen.getByRole('status')).toHaveTextContent(/symptom logged/i)
  })
})