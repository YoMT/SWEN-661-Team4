// TypeScript mirror of the design-system CSS tokens (DESKTOP_DESIGN_SYSTEM.md §7.4).
// Prefer the CSS custom properties in theme.css; use these when a token value is
// needed in TS (e.g. inline style props bound to a var()).
export const tokens = {
  color: {
    bg: 'var(--color-bg)',
    surface: 'var(--color-surface)',
    surfaceAlt: 'var(--color-surface-alt)',
    primary: 'var(--color-primary)',
    onPrimary: 'var(--color-on-primary)',
    text: 'var(--color-text)',
    textMuted: 'var(--color-text-muted)',
    borderSubtle: 'var(--color-border-subtle)',
    borderStrong: 'var(--color-border-strong)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    info: 'var(--color-info)'
  },
  landing: {
    bg: 'var(--landing-bg)',
    headlineAccent: 'var(--headline-accent)',
    liveDot: 'var(--live-dot)',
    errorSurface: 'var(--error-surface)'
  },
  space: {
    x0_5: 2,
    x1: 4,
    x1_5: 6,
    x2: 8,
    x3: 12,
    x4: 16,
    x5: 20,
    x6: 24,
    x8: 32,
    x10: 40,
    x12: 48,
    x16: 64
  },
  radius: { xs: 2, sm: 4, md: 6, lg: 8, xl: 12, pill: 999 },
  control: {
    sm: 'var(--control-sm)',
    md: 'var(--control-md)',
    lg: 'var(--control-lg)',
    critical: 'var(--control-critical)'
  },
  chrome: {
    titlebarH: 'var(--titlebar-h)',
    menubarH: 'var(--menubar-h)',
    toolbarH: 'var(--toolbar-h)',
    statusbarH: 'var(--statusbar-h)',
    sidebarW: 'var(--sidebar-w)',
    panelW: 'var(--panel-w)'
  },
  motion: { fast: 120, base: 150 }
} as const

// Care-write debounce — Pillar 3 (Ignore Double-Taps); mirrors mobile BUTTON_DEBOUNCE_MS.
export const BUTTON_DEBOUNCE_MS = 600
