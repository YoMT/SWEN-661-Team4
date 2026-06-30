import { ElectronAPI } from '@electron-toolkit/preload'
import type { CareConnectApi } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: CareConnectApi
  }
}
