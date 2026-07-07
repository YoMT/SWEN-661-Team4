export interface MenuItemDef {
  label: string
  action?: string
  accelerator?: string
  separator?: boolean
}

export interface MenuDef {
  label: string
  items: MenuItemDef[]
}

const MOD = typeof navigator !== 'undefined' && navigator.platform.startsWith('Mac') ? '⌘' : 'Ctrl'

/** Shared menu structure for the visual MenuBar and the Command Palette. */
export const MENUS: MenuDef[] = [
  {
    label: 'File',
    items: [
      { label: 'New Medication', action: 'new-medication', accelerator: `${MOD}+N` },
      { label: 'New Appointment', action: 'new-appointment', accelerator: `${MOD}+Shift+N` },
      { label: 'Log Symptom', action: 'log-symptom' },
      { label: '', separator: true },
      { label: 'Export Report…', action: 'export-report', accelerator: `${MOD}+E` },
      { label: '', separator: true },
      { label: 'Sign Out', action: 'sign-out' }
    ]
  },
  {
    label: 'Edit',
    items: [
      { label: 'Edit Profile', action: 'edit-profile' },
      { label: 'Emergency Contacts', action: 'emergency-contacts' },
      { label: 'Caretaker Notes', action: 'caretaker-notes' }
    ]
  },
  {
    label: 'View',
    items: [
      { label: 'Dashboard', action: 'nav-dashboard', accelerator: `${MOD}+1` },
      { label: 'Medications', action: 'nav-medications', accelerator: `${MOD}+2` },
      { label: 'Appointments', action: 'nav-appointments', accelerator: `${MOD}+3` },
      { label: 'Symptoms', action: 'nav-symptoms', accelerator: `${MOD}+4` },
      { label: 'Profile', action: 'nav-profile', accelerator: `${MOD}+5` },
      { label: '', separator: true },
      { label: 'Toggle Sidebar', action: 'toggle-sidebar', accelerator: `${MOD}+B` },
      { label: 'Show Assistant', action: 'toggle-assistant', accelerator: `${MOD}+J` },
      { label: '', separator: true },
      { label: 'Tremor (Accessible) Mode', action: 'toggle-density' },
      { label: 'Reduce Motion', action: 'toggle-motion' },
      { label: 'Theme: Light', action: 'theme-light' },
      { label: 'Theme: Dark', action: 'theme-dark' },
      { label: 'Theme: System', action: 'theme-system' },
      { label: '', separator: true },
      { label: 'Command Palette', action: 'command-palette', accelerator: `${MOD}+K` },
      { label: 'Settings', action: 'settings', accelerator: `${MOD}+,` }
    ]
  },
  {
    label: 'Help',
    items: [
      { label: 'User Guide', action: 'help', accelerator: 'F1' },
      { label: 'Keyboard Shortcuts', action: 'keyboard-shortcuts', accelerator: `${MOD}+/` },
      { label: '', separator: true },
      { label: 'About CareConnect', action: 'about' }
    ]
  }
]
