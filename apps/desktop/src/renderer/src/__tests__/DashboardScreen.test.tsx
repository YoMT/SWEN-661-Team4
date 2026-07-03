import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DashboardScreen } from '../screens/DashboardScreen'

const refreshMock = jest.fn()

jest.mock('../state/use-dashboard', () => ({
  useDashboard: () => ({
    careeName: 'Margaret Johnson',
    isLoading: false,
    refresh: refreshMock,
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

describe('DashboardScreen', () => {
  beforeEach(() => {
    refreshMock.mockClear()
  })

  test('renders dashboard information', () => {
    render(<DashboardScreen onNavigate={jest.fn()} />)

    expect(
      screen.getByRole('heading', { name: /margaret johnson/i })
    ).toBeInTheDocument()

    expect(screen.getByText('1/3')).toBeInTheDocument()
    expect(screen.getByText(/Lisinopril/i)).toBeInTheDocument()
    expect(screen.getByText(/Dr\. Sarah Chen/i)).toBeInTheDocument()
  })

  test('calls refresh when refresh button is clicked', async () => {
    const user = userEvent.setup()

    render(<DashboardScreen onNavigate={jest.fn()} />)

    await user.click(
      screen.getByRole('button', { name: /refresh dashboard/i })
    )

    expect(refreshMock).toHaveBeenCalledTimes(1)
  })

  test('navigates to medications from medication card', async () => {
    const user = userEvent.setup()
    const onNavigate = jest.fn()

    render(<DashboardScreen onNavigate={onNavigate} />)

    await user.click(
      screen.getByRole('button', { name: /view all medications/i })
    )

    expect(onNavigate).toHaveBeenCalledWith('medications')
  })

  test('navigates to appointments from appointment card', async () => {
    const user = userEvent.setup()
    const onNavigate = jest.fn()

    render(<DashboardScreen onNavigate={onNavigate} />)

    await user.click(
      screen.getByRole('button', { name: /view schedule/i })
    )

    expect(onNavigate).toHaveBeenCalledWith('appointments')
  })

  test('quick action buttons navigate correctly', async () => {
    const user = userEvent.setup()
    const onNavigate = jest.fn()

    render(<DashboardScreen onNavigate={onNavigate} />)

    const buttons = screen.getAllByRole('button')

    await user.click(buttons.find(btn => btn.textContent === 'Medications')!)
    await user.click(buttons.find(btn => btn.textContent === 'Schedule')!)
    await user.click(buttons.find(btn => btn.textContent === 'Symptoms')!)
    await user.click(buttons.find(btn => btn.textContent === 'Profile')!)

    expect(onNavigate).toHaveBeenCalledWith('medications')
    expect(onNavigate).toHaveBeenCalledWith('appointments')
    expect(onNavigate).toHaveBeenCalledWith('symptoms')
    expect(onNavigate).toHaveBeenCalledWith('profile')
  })
})