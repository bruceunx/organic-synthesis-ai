import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  //eslint-disable-next-line
  onUpdateValue: (callback: (value: number) => void) =>
    ipcRenderer.on('update-value', (_event, value) => callback(value)),
}

contextBridge.exposeInMainWorld('electronAPI', api)
contextBridge.exposeInMainWorld('electron', electronAPI)
