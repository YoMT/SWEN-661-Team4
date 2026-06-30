import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { buildAppMenu } from './menu'

function createWindow(): void {
  // Frameless window (§3.1): we render a custom title bar so the brand chrome and
  // in-window menu bar are consistent across OSes.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 832,
    minWidth: 1024,
    minHeight: 680,
    center: true,
    title: 'CareConnect',
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Native menu: macOS global menu bar + cross-platform accelerators (§3.2/§6).
  // Kept hidden on Windows/Linux (we draw our own); accelerators still fire.
  Menu.setApplicationMenu(buildAppMenu(mainWindow))
  mainWindow.setMenuBarVisibility(false)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Keep the renderer's window-control UI in sync with the actual state.
  const emitMaximize = (): void =>
    mainWindow.webContents.send('window:maximized-changed', mainWindow.isMaximized())
  mainWindow.on('maximize', emitMaximize)
  mainWindow.on('unmaximize', emitMaximize)

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer based on electron-vite cli.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Window-control IPC for the custom frameless title bar (§3.1).
function registerWindowControls(): void {
  const windowOf = (e: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent): BrowserWindow | null =>
    BrowserWindow.fromWebContents(e.sender)

  ipcMain.on('window:minimize', (e) => windowOf(e)?.minimize())
  ipcMain.on('window:toggle-maximize', (e) => {
    const w = windowOf(e)
    if (!w) return
    if (w.isMaximized()) w.unmaximize()
    else w.maximize()
  })
  ipcMain.on('window:close', (e) => windowOf(e)?.close())
  ipcMain.handle('window:is-maximized', (e) => windowOf(e)?.isMaximized() ?? false)
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.careconnect.desktop')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerWindowControls()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
