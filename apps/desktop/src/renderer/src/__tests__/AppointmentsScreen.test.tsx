import { render, screen } from '@testing-library/react'
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

describe('AppointmentsScreen', () => {
  test('renders appointments page title and subtitle', () => {
    render(<AppointmentsScreen />)

    expect(
      screen.getByRole('heading', { name: /appointments/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/upcoming visits and video calls/i)
    ).toBeInTheDocument()
  })

  test('renders today and upcoming appointments', () => {
    render(<AppointmentsScreen />)

    expect(screen.getByText(/^Today$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Upcoming$/i)).toBeInTheDocument()

    expect(
      screen.getByText(/dr\. james wilson/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/neurology/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/discuss tremor symptoms/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText((content) =>
        content.includes('Neurology') &&
        content.includes('Video call')
      )
    ).toBeInTheDocument()

    expect(
      screen.getByText(/dr\. maria lopez/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/primary care/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/care clinic/i)
    ).toBeInTheDocument()
  })
})