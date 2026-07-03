import { fireEvent, render, screen } from '@testing-library/react'
import { MedicationsScreen } from '../screens/MedicationsScreen'

const markTakenMock = jest.fn()

jest.mock('../state/medication-context', () => ({
  useMedicationContext: () => ({
    medications: [
      {
        id: 'med-1',
        name: 'Carbidopa-Levodopa',
        dosage: '25/100 mg',
        scheduledTime: '8:00 AM',
        instruction: 'Take with water',
        status: 'dueNow'
      },
      {
        id: 'med-2',
        name: 'Vitamin D',
        dosage: '1000 IU',
        scheduledTime: '12:00 PM',
        instruction: 'Take with food',
        status: 'upcoming'
      },
      {
        id: 'med-3',
        name: 'Melatonin',
        dosage: '5 mg',
        scheduledTime: '9:00 PM',
        instruction: 'Take before bed',
        status: 'given'
      }
    ],
    givenDoses: 1,
    totalDoses: 3,
    isLoading: false,
    error: null,
    markTaken: markTakenMock
  })
}))

describe('MedicationsScreen', () => {
  beforeEach(() => {
    markTakenMock.mockClear()
  })

  test('renders medication page title and dose summary', () => {
    render(<MedicationsScreen />)

    expect(
      screen.getByRole('heading', { name: /medications/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/1 of 3 doses taken today/i)
    ).toBeInTheDocument()
  })

  test('renders medication details and dose statuses', () => {
    render(<MedicationsScreen />)

    expect(screen.getByText(/carbidopa-levodopa/i)).toBeInTheDocument()
    expect(screen.getByText(/25\/100 mg/i)).toBeInTheDocument()
    expect(screen.getByText(/take with water/i)).toBeInTheDocument()
    expect(screen.getByText(/^Due now$/i)).toBeInTheDocument()

    expect(screen.getByText(/vitamin d/i)).toBeInTheDocument()
    expect(screen.getByText(/1000 iu/i)).toBeInTheDocument()
    expect(screen.getByText(/^Upcoming$/i)).toBeInTheDocument()

    expect(screen.getByText(/melatonin/i)).toBeInTheDocument()
    expect(screen.getByText(/^Taken$/i)).toBeInTheDocument()
  })

  test('calls markTaken when a medication is marked as taken', () => {
    render(<MedicationsScreen />)

    fireEvent.click(
      screen.getByRole('button', {
        name: /mark carbidopa-levodopa as taken/i
      })
    )

    expect(markTakenMock).toHaveBeenCalledWith('med-1')
  })
})