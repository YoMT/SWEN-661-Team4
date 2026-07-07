import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'

// Accessibility preferences (DESKTOP_DESIGN_SYSTEM §2/§8). Centralised here so
// they persist across navigation + reload and are reachable from both the
// Profile screen and (later) the View menu. Applied as data-* / --text-scale on
// the document root so the token layer in theme.css reacts.
export type ThemeMode = 'light' | 'dark' | 'system'
export type Density = 'dense' | 'accessible'
export type TextSize = 'standard' | 'large' | 'largest'

const TEXT_SCALE: Record<TextSize, number> = { standard: 1, large: 1.25, largest: 1.5 }

interface PreferencesState {
  theme: ThemeMode
  setTheme: (t: ThemeMode) => void
  density: Density
  setDensity: (d: Density) => void
  toggleDensity: () => void
  textSize: TextSize
  setTextSize: (t: TextSize) => void
  reduceMotion: boolean
  setReduceMotion: (v: boolean) => void
  highContrast: boolean
  setHighContrast: (v: boolean) => void
}

const PreferencesContext = createContext<PreferencesState | null>(null)

const read = <T extends string>(key: string, fallback: T): T =>
  (localStorage.getItem(key) as T | null) ?? fallback
const readBool = (key: string, fallback: boolean): boolean => {
  const v = localStorage.getItem(key)
  return v === null ? fallback : v === '1'
}

export function PreferencesProvider({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const [theme, setThemeState] = useState<ThemeMode>(() => read('cc.theme', 'system'))
  const [density, setDensityState] = useState<Density>(() => read('cc.density', 'dense'))
  const [textSize, setTextSizeState] = useState<TextSize>(() => read('cc.textSize', 'standard'))
  // Reduce Motion defaults on (Pillar 4 — calm, static UI).
  const [reduceMotion, setReduceMotionState] = useState(() => readBool('cc.motion', true))
  const [highContrast, setHighContrastState] = useState(() => readBool('cc.contrast', false))

  useEffect(() => {
    const root = document.documentElement
    const apply = (): void => {
      const resolved =
        theme === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : theme
      root.dataset.theme = resolved
    }
    apply()
    localStorage.setItem('cc.theme', theme)
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.density = density
    localStorage.setItem('cc.density', density)
  }, [density])

  useEffect(() => {
    document.documentElement.style.setProperty('--text-scale', String(TEXT_SCALE[textSize]))
    localStorage.setItem('cc.textSize', textSize)
  }, [textSize])

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = reduceMotion ? 'true' : 'false'
    localStorage.setItem('cc.motion', reduceMotion ? '1' : '0')
  }, [reduceMotion])

  useEffect(() => {
    document.documentElement.dataset.highContrast = highContrast ? 'true' : 'false'
    localStorage.setItem('cc.contrast', highContrast ? '1' : '0')
  }, [highContrast])

  const setTheme = useCallback((t: ThemeMode) => setThemeState(t), [])
  const setDensity = useCallback((d: Density) => setDensityState(d), [])
  const toggleDensity = useCallback(
    () => setDensityState((d) => (d === 'dense' ? 'accessible' : 'dense')),
    []
  )
  const setTextSize = useCallback((t: TextSize) => setTextSizeState(t), [])
  const setReduceMotion = useCallback((v: boolean) => setReduceMotionState(v), [])
  const setHighContrast = useCallback((v: boolean) => setHighContrastState(v), [])

  const value = useMemo<PreferencesState>(
    () => ({
      theme,
      setTheme,
      density,
      setDensity,
      toggleDensity,
      textSize,
      setTextSize,
      reduceMotion,
      setReduceMotion,
      highContrast,
      setHighContrast
    }),
    [
      theme,
      setTheme,
      density,
      setDensity,
      toggleDensity,
      textSize,
      setTextSize,
      reduceMotion,
      setReduceMotion,
      highContrast,
      setHighContrast
    ]
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences(): PreferencesState {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider')
  return ctx
}
