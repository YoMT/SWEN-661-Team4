import { act, fireEvent, render, screen } from '@testing-library/react'
import { UpdateToast } from '../components/UpdateToast'

describe('UpdateToast', () => {
  test('hidden until the service worker reports an update', () => {
    render(<UpdateToast />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    act(() => {
      window.dispatchEvent(new CustomEvent('cc:sw-updated'))
    })

    expect(screen.getByRole('status')).toHaveTextContent(/new version/i)
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument()
  })

  test('can be dismissed', () => {
    render(<UpdateToast />)
    act(() => {
      window.dispatchEvent(new CustomEvent('cc:sw-updated'))
    })
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
