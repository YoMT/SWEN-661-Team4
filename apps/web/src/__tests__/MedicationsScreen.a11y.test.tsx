import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { MedicationsScreen } from '../screens/MedicationsScreen'

vi.mock('../state/medication-context', () => ({
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
    markTaken: vi.fn()
  })
}))

describe('MedicationsScreen accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(<MedicationsScreen />)
    expect(await axe(container)).toHaveNoViolations()
  })

  test('renders medications as a list', () => {
    render(<MedicationsScreen />)
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
