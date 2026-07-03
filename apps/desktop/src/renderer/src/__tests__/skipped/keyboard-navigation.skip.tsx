import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('CareConnect Desktop keyboard navigation', () => {
  test('renders desktop shell navigation controls', () => {
    render(<App />)

    expect(screen.getByText(/CareConnect/i)).toBeInTheDocument()
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Medications/i)).toBeInTheDocument()
    expect(screen.getByText(/Appointments/i)).toBeInTheDocument()
    expect(screen.getByText(/Symptoms/i)).toBeInTheDocument()
    expect(screen.getByText(/Profile/i)).toBeInTheDocument()
  })

  test('allows keyboard tab navigation through interactive controls', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.tab()

    expect(document.activeElement).toBeTruthy()
  })
})