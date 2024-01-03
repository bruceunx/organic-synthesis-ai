import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  onFindRoutes: (smiles: string) =>
    ipcRenderer.invoke('routes:getRoutes', smiles),
  onGetSvg: (smiles: string) => ipcRenderer.invoke('svg', smiles),
  openFile: () => ipcRenderer.invoke('openFile'),
}

contextBridge.exposeInMainWorld('electronAPI', api)
contextBridge.exposeInMainWorld('electron', electronAPI)
