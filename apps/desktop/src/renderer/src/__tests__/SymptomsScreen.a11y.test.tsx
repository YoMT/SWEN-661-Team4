import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { SymptomsScreen } from '../screens/SymptomsScreen'

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
    addLog: jest.fn()
  })
}))

describe('SymptomsScreen accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(<SymptomsScreen />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
