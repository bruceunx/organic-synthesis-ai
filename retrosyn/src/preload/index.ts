import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  onFindRoutes: (smiles: string) =>
    ipcRenderer.invoke('routes:getRoutes', smiles),
  onGetSvg: (smiles: string, width: number = 200, height: number = 200) =>
    ipcRenderer.invoke('svg', smiles, width, height),
  openFile: () => ipcRenderer.invoke('openFile'),
}

contextBridge.exposeInMainWorld('electronAPI', api)
contextBridge.exposeInMainWorld('electron', electronAPI)
