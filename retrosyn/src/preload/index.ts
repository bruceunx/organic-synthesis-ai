import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  onFindRoutes: (smiles: string) =>
    ipcRenderer.invoke('routes:getRoutes', smiles),
  onFindConditions: (reactants: string, product: string) =>
    ipcRenderer.invoke('getConditions', reactants, product),
  onGetSvg: (smiles: string, width: number = 200, height: number = 200) =>
    ipcRenderer.invoke('svg', smiles, width, height),
  onSaveFlow: (target: string, content: string) =>
    ipcRenderer.invoke('saveFlow', target, content),
  onDelFlow: (id: number) => ipcRenderer.invoke('delFlow', id),
  onGetFlow: (id: number) => ipcRenderer.invoke('getFlow', id),
  onUpdateFlow: (id: number, content: string) =>
    ipcRenderer.invoke('updateFlow', id, content),
  onGetFlowList: () => ipcRenderer.invoke('getFlowList'),
  openFile: () => ipcRenderer.invoke('openFile'),
}

contextBridge.exposeInMainWorld('electronAPI', api)
contextBridge.exposeInMainWorld('electron', electronAPI)
