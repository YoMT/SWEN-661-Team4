import { Menu, app, type BrowserWindow, type MenuItemConstructorOptions } from 'electron'

/**
 * Native application menu — DESKTOP_DESIGN_SYSTEM.md §3.2 menu map.
 *
 * Its job here is twofold (per §6): on macOS it becomes the global menu bar, and
 * on every platform it registers the `CmdOrCtrl` accelerators so a single
 * definition is conflict-safe cross-platform (§4.10). Each item forwards an
 * action id to the renderer, which owns all UI state. The renderer also draws an
 * in-window menu bar for visual fidelity; this native menu is kept hidden on
 * Windows/Linux (accelerators still fire).
 */
export function buildAppMenu(win: BrowserWindow): Menu {
  const send = (action: string) => (): void => win.webContents.send('menu:action', action)
  const isMac = process.platform === 'darwin'

  const template: MenuItemConstructorOptions[] = [
    ...(isMac ? ([{ role: 'appMenu' }] as MenuItemConstructorOptions[]) : []),
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
        isMac ? { role: 'close' } : { role: 'quit' }
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
        { label: 'Show Sidebar', accelerator: 'CmdOrCtrl+B', click: send('toggle-sidebar') },
        { label: 'Show Assistant', accelerator: 'CmdOrCtrl+J', click: send('toggle-assistant') },
        { type: 'separator' },
        {
          label: 'Text Size',
          submenu: [
            { label: 'Standard', click: send('text-standard') },
            { label: 'Large', click: send('text-large') },
            { label: 'Largest', click: send('text-largest') }
          ]
        },
        { label: 'Tremor (Accessible) Mode', click: send('toggle-density') },
        { label: 'Reduce Motion', click: send('toggle-motion') },
        {
          label: 'Theme',
          submenu: [
            { label: 'Light', click: send('theme-light') },
            { label: 'Dark', click: send('theme-dark') },
            { label: 'System', click: send('theme-system') }
          ]
        },
        { type: 'separator' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'User Guide', accelerator: 'F1', click: send('user-guide') },
        { label: 'Keyboard Shortcuts', accelerator: 'CmdOrCtrl+/', click: send('shortcuts') },
        { type: 'separator' },
        { label: `About ${app.name}`, click: send('about') }
      ]
    }
  ]

  return Menu.buildFromTemplate(template)
}
