import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Api {
    onUpdateValue: (callback: (value: number) => void) => void
  }

  interface Window {
    electronAPI: Api
    electron: ElectronAPI
  }
}
