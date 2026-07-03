import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LandingScreen } from '../screens/LandingScreen'

describe('LandingScreen', () => {
  test('renders landing page content', () => {
    render(<LandingScreen onGetStarted={jest.fn()} />)

    expect(
      screen.getByRole('heading', { name: /care,\s*organized/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/keyboard-first use/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/doses, adherence, reminders/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/visits, video calls, schedules/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/ask about care, any time/i)
    ).toBeInTheDocument()
  })

  test('calls onGetStarted when Ask CareConnect is clicked', async () => {
    const user = userEvent.setup()
    const onGetStarted = jest.fn()

    render(<LandingScreen onGetStarted={onGetStarted} />)

    await user.click(
      screen.getByRole('button', { name: /ask careconnect/i })
    )

    expect(onGetStarted).toHaveBeenCalledTimes(1)
  })

  test('calls onGetStarted when sign in button is clicked', async () => {
    const user = userEvent.setup()
    const onGetStarted = jest.fn()

    render(<LandingScreen onGetStarted={onGetStarted} />)

    await user.click(
      screen.getByRole('button', { name: /sign in to continue/i })
    )

    expect(onGetStarted).toHaveBeenCalledTimes(1)
  })
})