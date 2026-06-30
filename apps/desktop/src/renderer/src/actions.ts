// Central action catalog. Action ids are dispatched from three sources — the
// native menu (menu:action IPC), the in-window MenuBar, and the Command Palette
// (⌘K) — and resolved by a single dispatcher in App.tsx. This keeps every
// command reachable by keyboard (DESKTOP_ACCESSIBILITY §3.3).

export type NavView = 'dashboard' | 'medications' | 'appointments' | 'symptoms' | 'profile'

export type ActionId =
  // File
  | 'new-medication'
  | 'new-appointment'
  | 'log-symptom'
  | 'export-report'
  | 'sign-out'
  // Edit
  | 'edit-profile'
  | 'emergency-contacts'
  | 'caretaker-notes'
  // View — navigation
  | 'nav-dashboard'
  | 'nav-medications'
  | 'nav-appointments'
  | 'nav-symptoms'
  | 'nav-profile'
  // View — chrome & prefs
  | 'toggle-sidebar'
  | 'toggle-assistant'
  | 'text-standard'
  | 'text-large'
  | 'text-largest'
  | 'toggle-density'
  | 'toggle-motion'
  | 'theme-light'
  | 'theme-dark'
  | 'theme-system'
  // Help / global
  | 'user-guide'
  | 'shortcuts'
  | 'about'
  | 'command-palette'
  | 'refresh'

export const NAV_OF_ACTION: Partial<Record<ActionId, NavView>> = {
  'nav-dashboard': 'dashboard',
  'nav-medications': 'medications',
  'nav-appointments': 'appointments',
  'nav-symptoms': 'symptoms',
  'nav-profile': 'profile'
}

export interface Command {
  id: ActionId
  label: string
  group: 'Navigate' | 'Create' | 'View' | 'Account' | 'Help'
  accel?: string
}

const mod = navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'

/** Commands surfaced in the ⌘K palette (keyboard path to every action). */
export const COMMANDS: Command[] = [
  { id: 'nav-dashboard', label: 'Go to Dashboard', group: 'Navigate', accel: `${mod}+1` },
  { id: 'nav-medications', label: 'Go to Medications', group: 'Navigate', accel: `${mod}+2` },
  { id: 'nav-appointments', label: 'Go to Appointments', group: 'Navigate', accel: `${mod}+3` },
  { id: 'nav-symptoms', label: 'Go to Symptoms', group: 'Navigate', accel: `${mod}+4` },
  { id: 'nav-profile', label: 'Go to Profile', group: 'Navigate', accel: `${mod}+5` },
  { id: 'new-medication', label: 'New Medication', group: 'Create', accel: `${mod}+N` },
  { id: 'new-appointment', label: 'New Appointment', group: 'Create', accel: `${mod}+Shift+N` },
  { id: 'log-symptom', label: 'Log Symptom', group: 'Create' },
  { id: 'export-report', label: 'Export Report', group: 'Create', accel: `${mod}+E` },
  { id: 'refresh', label: 'Refresh data', group: 'View' },
  { id: 'toggle-sidebar', label: 'Toggle Sidebar', group: 'View', accel: `${mod}+B` },
  { id: 'toggle-assistant', label: 'Toggle Assistant (Peggy)', group: 'View', accel: `${mod}+J` },
  { id: 'toggle-density', label: 'Toggle Tremor (Accessible) Mode', group: 'View' },
  { id: 'toggle-motion', label: 'Toggle Reduce Motion', group: 'View' },
  { id: 'theme-light', label: 'Theme: Light', group: 'View' },
  { id: 'theme-dark', label: 'Theme: Dark', group: 'View' },
  { id: 'theme-system', label: 'Theme: System', group: 'View' },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', group: 'Help', accel: `${mod}+/` },
  { id: 'sign-out', label: 'Sign Out', group: 'Account' }
]
