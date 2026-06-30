import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import type { NavView } from '@renderer/actions'

export type ThemeMode = 'light' | 'dark' | 'system'
export type Density = 'dense' | 'accessible'
export type TextSize = 'standard' | 'large' | 'largest'

const TEXT_SCALE: Record<TextSize, number> = { standard: 1, large: 1.25, largest: 1.5 }

export interface ConfirmOptions {
  title: string
  body: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}
interface ConfirmRequest extends Required<Omit<ConfirmOptions, 'destructive'>> {
  destructive: boolean
  resolve: (ok: boolean) => void
}

export interface LiveMessage {
  text: string
  assertive: boolean
  key: number
}

interface UIState {
  // navigation
  view: NavView
  setView: (v: NavView) => void
  // chrome visibility
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  assistantOpen: boolean
  toggleAssistant: () => void
  setAssistantOpen: (v: boolean) => void
  paletteOpen: boolean
  setPaletteOpen: (v: boolean) => void
  // preferences
  theme: ThemeMode
  setTheme: (t: ThemeMode) => void
  density: Density
  toggleDensity: () => void
  setDensity: (d: Density) => void
  reduceMotion: boolean
  toggleReduceMotion: () => void
  textSize: TextSize
  setTextSize: (t: TextSize) => void
  // two-step confirm (Pillar 2)
  confirm: (opts: ConfirmOptions) => Promise<boolean>
  confirmRequest: ConfirmRequest | null
  resolveConfirm: (ok: boolean) => void
  // live regions (§4.6)
  announce: (text: string, assertive?: boolean) => void
  live: LiveMessage
}

const UIContext = createContext<UIState | null>(null)

const read = <T extends string>(key: string, fallback: T): T =>
  (localStorage.getItem(key) as T | null) ?? fallback
const readBool = (key: string, fallback: boolean): boolean => {
  const v = localStorage.getItem(key)
  return v === null ? fallback : v === '1'
}

export function UIProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [view, setView] = useState<NavView>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readBool('cc.sidebar', false))
  const [assistantOpen, setAssistantOpen] = useState(() => readBool('cc.assistant', false))
  const [paletteOpen, setPaletteOpen] = useState(false)

  const [theme, setThemeState] = useState<ThemeMode>(() => read('cc.theme', 'system'))
  const [density, setDensityState] = useState<Density>(() => read('cc.density', 'dense'))
  // Reduce Motion defaults ON (Pillar 4 — calm, static UI).
  const [reduceMotion, setReduceMotion] = useState(() => readBool('cc.motion', true))
  const [textSize, setTextSizeState] = useState<TextSize>(() => read('cc.textSize', 'standard'))

  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null)
  const [live, setLive] = useState<LiveMessage>({ text: '', assertive: false, key: 0 })

  // Apply theme (resolving "system") to the document root + react to OS changes.
  useEffect(() => {
    const root = document.documentElement
    const apply = (): void => {
      const resolved =
        theme === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : theme
      root.setAttribute('data-theme', resolved)
    }
    apply()
    localStorage.setItem('cc.theme', theme)
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density)
    localStorage.setItem('cc.density', density)
  }, [density])

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', reduceMotion ? 'reduced' : 'full')
    localStorage.setItem('cc.motion', reduceMotion ? '1' : '0')
  }, [reduceMotion])

  useEffect(() => {
    document.documentElement.style.setProperty('--text-scale', String(TEXT_SCALE[textSize]))
    localStorage.setItem('cc.textSize', textSize)
  }, [textSize])

  useEffect(() => {
    localStorage.setItem('cc.sidebar', sidebarCollapsed ? '1' : '0')
  }, [sidebarCollapsed])
  useEffect(() => {
    localStorage.setItem('cc.assistant', assistantOpen ? '1' : '0')
  }, [assistantOpen])

  const announce = useCallback((text: string, assertive = false) => {
    setLive((p) => ({ text, assertive, key: p.key + 1 }))
  }, [])

  const confirm = useCallback(
    (opts: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setConfirmRequest({
          title: opts.title,
          body: opts.body,
          confirmLabel: opts.confirmLabel ?? 'Confirm',
          cancelLabel: opts.cancelLabel ?? 'Cancel',
          destructive: opts.destructive ?? false,
          resolve
        })
      }),
    []
  )
  const resolveConfirm = useCallback((ok: boolean) => {
    setConfirmRequest((prev) => {
      prev?.resolve(ok)
      return null
    })
  }, [])

  const setTheme = useCallback((t: ThemeMode) => setThemeState(t), [])
  const setDensity = useCallback((d: Density) => setDensityState(d), [])
  const toggleDensity = useCallback(
    () => setDensityState((d) => (d === 'dense' ? 'accessible' : 'dense')),
    []
  )
  const toggleReduceMotion = useCallback(() => setReduceMotion((m) => !m), [])
  const setTextSize = useCallback((t: TextSize) => setTextSizeState(t), [])
  const toggleSidebar = useCallback(() => setSidebarCollapsed((c) => !c), [])
  const toggleAssistant = useCallback(() => setAssistantOpen((o) => !o), [])

  const value = useMemo<UIState>(
    () => ({
      view,
      setView,
      sidebarCollapsed,
      toggleSidebar,
      assistantOpen,
      toggleAssistant,
      setAssistantOpen,
      paletteOpen,
      setPaletteOpen,
      theme,
      setTheme,
      density,
      toggleDensity,
      setDensity,
      reduceMotion,
      toggleReduceMotion,
      textSize,
      setTextSize,
      confirm,
      confirmRequest,
      resolveConfirm,
      announce,
      live
    }),
    [
      view,
      sidebarCollapsed,
      toggleSidebar,
      assistantOpen,
      toggleAssistant,
      paletteOpen,
      theme,
      setTheme,
      density,
      toggleDensity,
      setDensity,
      reduceMotion,
      toggleReduceMotion,
      textSize,
      setTextSize,
      confirm,
      confirmRequest,
      resolveConfirm,
      announce,
      live
    ]
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI(): UIState {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
