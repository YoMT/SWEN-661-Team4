import { render, screen } from '@testing-library/react'
import { StatusBar } from '../components/StatusBar'

jest.mock('../state/use-dashboard', () => ({
  useDashboard: () => ({
    givenDoses: 1,
    totalDoses: 3
  })
}))

describe('StatusBar', () => {
  test('shows sync status and doses due today', () => {
    render(<StatusBar />)

    expect(screen.getByRole('contentinfo', { name: /status/i })).toBeInTheDocument()
    expect(screen.getByText(/Synced just now/i)).toBeInTheDocument()
    expect(screen.getByText('2 due today')).toBeInTheDocument()
  })
})