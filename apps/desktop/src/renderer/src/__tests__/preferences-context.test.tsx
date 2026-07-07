import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PreferencesProvider, usePreferences } from '../state/preferences-context'

function Harness(): React.JSX.Element {
  const p = usePreferences()
  return (
    <div>
      <span data-testid="theme">{p.theme}</span>
      <span data-testid="density">{p.density}</span>
      <button onClick={() => p.setTheme('dark')}>set-dark</button>
      <button onClick={() => p.toggleDensity()}>toggle-density</button>
      <button onClick={() => p.setTextSize('large')}>text-large</button>
    </div>
  )
}

const renderPrefs = (): void => {
  render(
    <PreferencesProvider>
      <Harness />
    </PreferencesProvider>
  )
}

describe('preferences-context', () => {
  beforeEach(() => {
    localStorage.clear()
    // jsdom has no matchMedia; the provider queries it to resolve theme:'system'.
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  })

  test('applies defaults to the document root (system→light, reduce-motion on)', () => {
    renderPrefs()
    const root = document.documentElement
    expect(screen.getByTestId('theme')).toHaveTextContent('system')
    expect(root.dataset.theme).toBe('light') // system + matchMedia:false → light
    expect(root.dataset.density).toBe('dense')
    expect(root.dataset.reduceMotion).toBe('true') // Pillar 4 default
  })

  test('setting dark theme updates the root + persists', async () => {
    renderPrefs()
    await userEvent.click(screen.getByText('set-dark'))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('cc.theme')).toBe('dark')
  })

  test('toggling Tremor density updates the root + persists', async () => {
    renderPrefs()
    await userEvent.click(screen.getByText('toggle-density'))
    expect(screen.getByTestId('density')).toHaveTextContent('accessible')
    expect(document.documentElement.dataset.density).toBe('accessible')
    expect(localStorage.getItem('cc.density')).toBe('accessible')
  })

  test('text size sets the --text-scale custom property', async () => {
    renderPrefs()
    await userEvent.click(screen.getByText('text-large'))
    expect(document.documentElement.style.getPropertyValue('--text-scale')).toBe('1.25')
    expect(localStorage.getItem('cc.textSize')).toBe('large')
  })

  test('restores persisted preferences on mount', () => {
    localStorage.setItem('cc.theme', 'dark')
    localStorage.setItem('cc.density', 'accessible')
    renderPrefs()
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.dataset.density).toBe('accessible')
  })
})
