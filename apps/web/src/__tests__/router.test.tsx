import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Link, RouterProvider, useRouter } from '../router'

function PathProbe(): React.JSX.Element {
  const { path } = useRouter()
  return <span data-testid="path">{path}</span>
}

describe('router', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  test('Link performs SPA navigation on plain click', () => {
    render(
      <RouterProvider>
        <Link to="/medications">Meds</Link>
        <PathProbe />
      </RouterProvider>
    )
    const prevented = !fireEvent.click(screen.getByRole('link', { name: 'Meds' }))
    expect(prevented).toBe(true)
    expect(screen.getByTestId('path')).toHaveTextContent('/medications')
    expect(window.location.pathname).toBe('/medications')
  })

  test('Link lets modified clicks through to the browser', () => {
    render(
      <RouterProvider>
        <Link to="/medications">Meds</Link>
        <PathProbe />
      </RouterProvider>
    )
    fireEvent.click(screen.getByRole('link', { name: 'Meds' }), { ctrlKey: true })
    // Not intercepted: the SPA path is unchanged (browser would open a new tab).
    expect(screen.getByTestId('path')).toHaveTextContent('/')
  })
})
