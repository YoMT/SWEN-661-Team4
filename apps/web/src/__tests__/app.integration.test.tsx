import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '@renderer/App'
import { DEMO_EMAIL, DEMO_PASSWORD } from '@renderer/services/mock-api'

const goTo = (path: string): void => {
  window.history.pushState({}, '', path)
}

beforeEach(() => {
  localStorage.clear()
  goTo('/')
})

describe('App routing (logged out)', () => {
  test('renders the landing page at /', async () => {
    render(<App />)
    expect(await screen.findByText(/gentle helping hand/i)).toBeInTheDocument()
  })

  test('renders the login screen at /login', async () => {
    goTo('/login')
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
  })

  test('renders the signup screen at /signup', async () => {
    goTo('/signup')
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Create account' })).toBeInTheDocument()
  })
})

describe('Login screen', () => {
  test('shows a validation error for an invalid email', async () => {
    goTo('/login')
    render(<App />)
    await screen.findByRole('heading', { name: 'Sign in' })

    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'not-an-email' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'whatever' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Please enter a valid email address.')
  })

  test('surfaces an auth error for wrong credentials', async () => {
    goTo('/login')
    render(<App />)
    await screen.findByRole('heading', { name: 'Sign in' })

    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'nope@test.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password.')
  })

  test('logs in with demo credentials and lands on the dashboard', async () => {
    goTo('/login')
    render(<App />)
    await screen.findByRole('heading', { name: 'Sign in' })

    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: DEMO_EMAIL } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: DEMO_PASSWORD } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    // Redirected into the authed shell — the dashboard shows the caree's name.
    expect(await screen.findByRole('heading', { name: 'Margaret Johnson' })).toBeInTheDocument()
    await waitFor(() => expect(window.location.pathname).toBe('/dashboard'))
  })
})

describe('Signup screen', () => {
  test('creates an account and lands on the dashboard', async () => {
    goTo('/signup')
    render(<App />)
    await screen.findByRole('heading', { name: 'Create account' })

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Casey Rivera' } })
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'casey@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(await screen.findByRole('heading', { name: 'Margaret Johnson' })).toBeInTheDocument()
  })
})
