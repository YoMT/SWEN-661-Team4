import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { SymptomsScreen } from '../screens/SymptomsScreen'

vi.mock('../state/symptom-context', () => ({
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
    addLog: vi.fn()
  })
}))

describe('SymptomsScreen accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(<SymptomsScreen />)
    expect(await axe(container)).toHaveNoViolations()
  })

  test('symptom and severity pickers are labelled fieldsets', () => {
    const { container } = render(<SymptomsScreen />)
    const groups = screen.getAllByRole('group')
    expect(groups).toHaveLength(2)
    expect(screen.getByRole('group', { name: /log a symptom/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /severity: 3\/5/i })).toBeInTheDocument()
    expect(container.querySelectorAll('fieldset legend')).toHaveLength(2)
  })

  test('recent logs are an h2 section with a list', () => {
    render(<SymptomsScreen />)
    expect(screen.getByRole('heading', { level: 2, name: /recent logs/i })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })
})
