import { Menu, BrowserWindow, MenuItemConstructorOptions, app } from 'electron'

/**
 * Builds the native CareConnect application menu. Accelerators use `CmdOrCtrl`
 * so a single definition is conflict-safe on Windows, Linux and macOS
 * (DESKTOP_DESIGN_SYSTEM.md §4.7 / Week 7 keyboard reference §4–5).
 *
 * The window is frameless, so this native menu is hidden but its accelerators
 * still fire — it is the authoritative keyboard layer. The renderer draws a
 * matching visual menu bar (MenuBar.tsx) that dispatches the same action ids.
 */
export function buildAppMenu(win: BrowserWindow): void {
  const send = (action: string) => (): void => win.webContents.send('menu:action', action)
  const isMac = process.platform === 'darwin'

  const template: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { label: 'New Medication', accelerator: 'CmdOrCtrl+N', click: send('new-medication') },
        {
          label: 'New Appointment',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: send('new-appointment')
        },
        { label: 'Log Symptom', click: send('log-symptom') },
        { type: 'separator' },
        { label: 'Export Report…', accelerator: 'CmdOrCtrl+E', click: send('export-report') },
        { type: 'separator' },
        { label: 'Sign Out', click: send('sign-out') },
        { role: 'quit', label: isMac ? 'Quit CareConnect' : 'Exit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { label: 'Edit Profile', click: send('edit-profile') },
        { label: 'Emergency Contacts', click: send('emergency-contacts') },
        { label: 'Caretaker Notes', click: send('caretaker-notes') }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Dashboard', accelerator: 'CmdOrCtrl+1', click: send('nav-dashboard') },
        { label: 'Medications', accelerator: 'CmdOrCtrl+2', click: send('nav-medications') },
        { label: 'Appointments', accelerator: 'CmdOrCtrl+3', click: send('nav-appointments') },
        { label: 'Symptoms', accelerator: 'CmdOrCtrl+4', click: send('nav-symptoms') },
        { label: 'Profile', accelerator: 'CmdOrCtrl+5', click: send('nav-profile') },
        { type: 'separator' },
        { label: 'Toggle Sidebar', accelerator: 'CmdOrCtrl+B', click: send('toggle-sidebar') },
        { label: 'Show Assistant', accelerator: 'CmdOrCtrl+J', click: send('toggle-assistant') },
        { type: 'separator' },
        { label: 'Command Palette', accelerator: 'CmdOrCtrl+K', click: send('command-palette') },
        { label: 'Settings', accelerator: 'CmdOrCtrl+,', click: send('settings') }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'User Guide', accelerator: 'F1', click: send('help') },
        {
          label: 'Keyboard Shortcuts',
          accelerator: 'CmdOrCtrl+/',
          click: send('keyboard-shortcuts')
        },
        { type: 'separator' },
        { label: 'About CareConnect', click: send('about') }
      ]
    }
  ]

  if (isMac) {
    template.unshift({
      label: app.name,
      submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'quit' }]
    })
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
