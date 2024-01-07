import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Api {
    onFindRoutes: (smiles: string) => any
    onFindConditions: (reactants: string, product: string) => any
    onGetSvg: (
      smiles: string,
      width: number = 200,
      height: numeber = 200,
    ) => string
    onSaveFlow: (target: string, content: string) => any
    onGetFlowList: () => any
    openFile: () => string
  }

  interface Window {
    electronAPI: Api
    electron: ElectronAPI
  }
}
