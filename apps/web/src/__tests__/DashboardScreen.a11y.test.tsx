import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { DashboardScreen } from '../screens/DashboardScreen'

vi.mock('../state/use-dashboard', () => ({
  useDashboard: () => ({
    careeName: 'Margaret Johnson',
    isLoading: false,
    refresh: vi.fn(),
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
    const { container } = render(<DashboardScreen onNavigate={vi.fn()} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  test('uses a semantic heading hierarchy and stat list', () => {
    render(<DashboardScreen onNavigate={vi.fn()} />)
    expect(screen.getByRole('heading', { level: 1, name: /margaret johnson/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /next medication/i })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /today.s appointment/i })
    ).toBeInTheDocument()
    // Stat tiles are a real list.
    expect(screen.getByText('Doses today').closest('li')).not.toBeNull()
  })
})
