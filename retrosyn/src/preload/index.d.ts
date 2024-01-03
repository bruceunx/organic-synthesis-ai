import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Api {
    // eslint-disable-next-line
    onFindRoutes: (smiles: string) => any
    onGetSvg: (smiles: string) => string
    openFile: () => string
  }

  interface Window {
    electronAPI: Api
    electron: ElectronAPI
  }
}
