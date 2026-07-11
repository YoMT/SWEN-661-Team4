import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DashboardScreen } from '../screens/DashboardScreen'

jest.mock('../state/use-dashboard', () => ({
  useDashboard: () => ({
    careeName: 'Margaret Johnson',
    isLoading: false,
    refresh: jest.fn(),
    givenDoses: 1,
    totalDoses: 3,
    todayAppointmentsCount: 2,
    logsCount: 4,
    nextMed: {
      name: 'Lisinopril',
      dosage: '10 mg',
      scheduledTime: '12:00 PM',
      instruction: 'Take with food'
    },
    nextAppt: {
      doctorName: 'Dr. Sarah Chen',
      specialty: 'Cardiology',
      location: 'City Heart Clinic'
    }
  })
}))

describe('DashboardScreen accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(<DashboardScreen onNavigate={jest.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
