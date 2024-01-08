import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
import initRDKitModule from '@rdkit/rdkit'
import { Database } from 'better-sqlite3'
import { initDB } from './model'
import { delFlow, getFlow, getFlowList, saveFlow, updateFlow } from './service'
import { chdir } from 'process'
import { exec } from 'child_process'

let db: Database
let rdkit: any

// eslint-disable-next-line
// @ts-ignore
initRDKitModule().then((RDKit: any) => {
  rdkit = RDKit
})

const initServer = () => {
  const reactionDir = join(__dirname, '../reaction')
  chdir(reactionDir)
  exec('torchserve --start --ncs --ts-config config.properties', (error) => {
    if (error) {
      dialog.showMessageBox({
        type: 'error',
        title: '错误',
        message: `AI反应模型启动失败- ${error}`,
      })
    }
  })

  const conditionDir = join(__dirname, '../conditionDir')
  chdir(conditionDir)
  exec('condition', (error) => {
    if (error) {
      dialog.showMessageBox({
        type: 'error',
        title: '错误',
        message: `AI反应条件预测模型启动失败- ${error}`,
      })
    }
  })
}

const API = 'http://127.0.0.1:6001'
const CONDITION_API = 'http://127.0.0.1:6006'

const handleFileOpen = async () => {
  // eslint-disable-next-line
  // @ts-ignore
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
  return ''
}

const findCondition = async (reactants: string, product: string) => {
  const url = `${CONDITION_API}/get-conditions`
  const data = { reactants: reactants, product: product }
  try {
    const res = await axios.post(url, data)
    if (res.status === 200) {
      return res.data
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

const getSvg = async (
  smiles: string,
  width: number = 200,
  height: number = 200,
) => {
  const res = new Promise((resolve, reject) => {
    try {
      const mol = rdkit.get_mol(smiles)
      const svg: string = mol.get_svg(width, height)
      let lines = svg.split(/\n/)
      lines = lines.filter((line: string) => !line.startsWith('<rect'))
      resolve(lines.join('\n'))
    } catch (err) {
      reject()
    }
  })
  return await res
}

const findRoutes = async (smiles: string) => {
  const url = `${API}/predictions/reaxys`
  const data = { smiles: [smiles] }
  try {
    const res = await axios.post(url, data)
    if (res.status === 200) {
      return res.data[0]
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1700,
    height: 950,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.setTitle('AI Retrosynthesis')

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('routes:getRoutes', async (_, smiles) => {
    const res = await findRoutes(smiles)
    return res
  })
  ipcMain.handle('getConditions', async (_, reactants, product) => {
    const res = await findCondition(reactants, product)
    return res
  })
  ipcMain.handle(
    'svg',
    async (_, smiles, width: number = 200, height: number = 200) => {
      const res = await getSvg(smiles, width, height)
      return res
    },
  )

  ipcMain.handle('saveFlow', async (_, target: string, content: string) => {
    const res = await saveFlow(db, target, content)
    return res
  })

  ipcMain.handle('getFlowList', async () => {
    const res = await getFlowList(db)
    return res
  })

  ipcMain.handle('delFlow', async (_, id: number) => {
    const res = await delFlow(db, id)
    return res
  })

  ipcMain.handle('getFlow', async (_, id: number) => {
    const res = await getFlow(db, id)
    return res
  })
  ipcMain.handle('updateFlow', async (_, id: number, content: string) => {
    const res = await updateFlow(db, id, content)
    return res
  })

  ipcMain.handle('openFile', handleFileOpen)

  createWindow()
  initServer()
  db = initDB()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  db.close()
  app.quit()

  // }
})
