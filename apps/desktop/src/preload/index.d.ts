import { ElectronAPI } from '@electron-toolkit/preload'

export interface DesktopApi {
  platform: string
  window: {
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    close: () => Promise<void>
    isMaximized: () => Promise<boolean>
    onMaximizedChange: (cb: (maximized: boolean) => void) => () => void
  }
  onMenuAction: (cb: (action: string) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: DesktopApi
  }
}
