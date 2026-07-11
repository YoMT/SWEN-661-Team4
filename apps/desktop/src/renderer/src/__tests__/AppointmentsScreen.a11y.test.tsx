import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { AppointmentsScreen } from '../screens/AppointmentsScreen'

jest.mock('../state/appointment-context', () => ({
  useAppointmentContext: () => ({
    isLoading: false,
    error: null,
    todayAppointments: [
      {
        id: 'appt-1',
        type: 'video',
        dateTime: '2026-07-02T10:30:00',
        doctorName: 'Dr. James Wilson',
        specialty: 'Neurology',
        location: 'Video call',
        notes: 'Discuss tremor symptoms'
      }
    ],
    upcomingAppointments: [
      {
        id: 'appt-2',
        type: 'in-person',
        dateTime: '2026-07-05T14:00:00',
        doctorName: 'Dr. Maria Lopez',
        specialty: 'Primary Care',
        location: 'Care Clinic',
        notes: ''
      }
    ]
  })
}))

describe('AppointmentsScreen accessibility', () => {
  test('has no axe violations', async () => {
    const { container } = render(<AppointmentsScreen />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
