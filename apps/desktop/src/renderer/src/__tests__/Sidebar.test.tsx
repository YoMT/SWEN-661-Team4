import { fireEvent, render, screen } from '@testing-library/react'
import { Sidebar } from '../components/Sidebar'

const logoutMock = jest.fn()
const onNavigateMock = jest.fn()
const onTogglePeggyMock = jest.fn()

jest.mock('../state/auth-context', () => ({
  useAuthContext: () => ({
    user: { name: 'Nuboke Bakoh' },
    logout: logoutMock
  })
}))

jest.mock('../state/profile-context', () => ({
  useProfileContext: () => ({
    profile: { careeName: 'Margaret' }
  })
}))

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders navigation, user info, and active page', () => {
    render(
      <Sidebar
        active="dashboard"
        onNavigate={onNavigateMock}
        onTogglePeggy={onTogglePeggyMock}
      />
    )

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
    expect(screen.getByText(/careconnect/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dashboard/i })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByText(/nuboke bakoh/i)).toBeInTheDocument()
    expect(screen.getByText(/caring for margaret/i)).toBeInTheDocument()
    expect(screen.getByText('N')).toBeInTheDocument()
  })

  test('calls onNavigate when nav buttons are clicked', () => {
    render(
      <Sidebar
        active="dashboard"
        onNavigate={onNavigateMock}
        onTogglePeggy={onTogglePeggyMock}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /medications/i }))
    fireEvent.click(screen.getByRole('button', { name: /appointments/i }))
    fireEvent.click(screen.getByRole('button', { name: /symptoms/i }))
    fireEvent.click(screen.getByRole('button', { name: /profile/i }))

    expect(onNavigateMock).toHaveBeenCalledWith('medications')
    expect(onNavigateMock).toHaveBeenCalledWith('appointments')
    expect(onNavigateMock).toHaveBeenCalledWith('symptoms')
    expect(onNavigateMock).toHaveBeenCalledWith('profile')
  })

  test('calls Peggy toggle and logout actions', () => {
    render(
      <Sidebar
        active="profile"
        onNavigate={onNavigateMock}
        onTogglePeggy={onTogglePeggyMock}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /ask peggy/i }))
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))

    expect(onTogglePeggyMock).toHaveBeenCalledTimes(1)
    expect(logoutMock).toHaveBeenCalledTimes(1)
  })
})