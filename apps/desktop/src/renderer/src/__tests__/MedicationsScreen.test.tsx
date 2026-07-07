import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MedicationsScreen } from '../screens/MedicationsScreen'

const markTakenMock = jest.fn()
const confirmMock = jest.fn().mockResolvedValue(true)

jest.mock('../state/medication-context', () => ({
  useMedicationContext: () => ({
    medications: [
      {
        id: 'med-1',
        name: 'Metoprolol',
        dosage: '50 mg',
        scheduledTime: '8:00 AM',
        instruction: 'Take with water',
        status: 'dueNow'
      },
      {
        id: 'med-2',
        name: 'Atorvastatin',
        dosage: '20 mg',
        scheduledTime: '9:00 PM',
        instruction: 'Take at bedtime',
        status: 'given'
      }
    ],
    givenDoses: 1,
    totalDoses: 2,
    isLoading: false,
    error: null,
    markTaken: markTakenMock
  })
}))

jest.mock('../state/confirm-context', () => ({
  useConfirm: () => ({ confirm: confirmMock })
}))

describe('MedicationsScreen (keyboard grid + care-write protections)', () => {
  beforeEach(() => {
    markTakenMock.mockClear()
    confirmMock.mockClear()
  })

  test('renders as an accessible grid with a row per dose', () => {
    render(<MedicationsScreen />)
    expect(screen.getByRole('grid', { name: /medications/i })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(2)
    expect(screen.getByText(/1 of 2 doses taken today/i)).toBeInTheDocument()
    // First row is the single tab stop (roving tabindex).
    expect(screen.getAllByRole('row')[0]).toHaveAttribute('tabindex', '0')
  })

  test('Mark as taken goes through the two-step confirm, then marks the dose', async () => {
    render(<MedicationsScreen />)
    await userEvent.click(screen.getByRole('button', { name: /mark metoprolol as taken/i }))
    expect(confirmMock).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(markTakenMock).toHaveBeenCalledWith('med-1'))
  })

  test('pressing T on a focused row marks the dose (keyboard path)', async () => {
    render(<MedicationsScreen />)
    const row = screen.getAllByRole('row')[0]
    row.focus()
    fireEvent.keyDown(row, { key: 'T' })
    expect(confirmMock).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(markTakenMock).toHaveBeenCalledWith('med-1'))
  })

  test('does not mark the dose when the confirm is declined', async () => {
    confirmMock.mockResolvedValueOnce(false)
    render(<MedicationsScreen />)
    await userEvent.click(screen.getByRole('button', { name: /mark metoprolol as taken/i }))
    await waitFor(() => expect(confirmMock).toHaveBeenCalled())
    expect(markTakenMock).not.toHaveBeenCalled()
  })

  test('a taken dose shows no mark button', () => {
    render(<MedicationsScreen />)
    expect(
      screen.queryByRole('button', { name: /mark atorvastatin as taken/i })
    ).not.toBeInTheDocument()
  })

  test('ArrowDown moves roving focus to the next row', () => {
    render(<MedicationsScreen />)
    const [row0, row1] = screen.getAllByRole('row')
    row0.focus()
    fireEvent.keyDown(row0, { key: 'ArrowDown' })
    expect(row1).toHaveFocus()
  })
})
