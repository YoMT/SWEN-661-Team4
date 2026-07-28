// Navigation data + types shared by the sidebar/rail/tabs and the app shell.
// Kept separate from Sidebar.tsx so that file only exports components (Vite Fast
// Refresh requires component-only modules).

export type View = 'dashboard' | 'medications' | 'appointments' | 'symptoms' | 'profile'

export interface NavItem {
  id: View
  label: string
  short: string
  icon: string
  path: string
}

export const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', short: 'Home', icon: '🏠', path: '/dashboard' },
  { id: 'medications', label: 'Medications', short: 'Meds', icon: '💊', path: '/medications' },
  { id: 'appointments', label: 'Appointments', short: 'Appts', icon: '📅', path: '/appointments' },
  { id: 'symptoms', label: 'Symptoms', short: 'Sympt.', icon: '📝', path: '/symptoms' },
  { id: 'profile', label: 'Profile', short: 'Profile', icon: '👤', path: '/profile' }
]
