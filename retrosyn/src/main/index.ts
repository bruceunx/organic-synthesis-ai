import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
import initRDKitModule from '@rdkit/rdkit'
import Database from 'better-sqlite3'

function initDB() {
  // Create the database connection
  const db = new Database('test.db')

  // Create table statement
  const sql = `
    CREATE TABLE IF NOT EXISTS reaction (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      target VARCHAR(255) NOT NULL,
      content TEXT
    )
  `

  const trigger = `
    CREATE TRIGGER IF NOT EXISTS time_stamp_trigger
    AFTER UPDATE ON reaction
    FOR EACH ROW
    BEGIN
        UPDATE reaction
        SET time_stamp = CURRENT_TIMESTAMP
        WHERE id = NEW.id;
    END
  `

  db.prepare(sql).run()
  db.prepare(trigger).run()

  const tableInfo = db.prepare('PRAGMA table_info(reaction)').all()
  console.log(tableInfo) // Will contain table schema

  // Close database connection
  db.close()
}

let rdkit

// eslint-disable-next-line
// @ts-ignore
initRDKitModule().then((RDKit) => {
  rdkit = RDKit
})

const API = 'http://127.0.0.1:8080'
const CONDITION_API = 'http://127.0.0.1:8000'

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

// async function initDB() {
//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS my_table (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       age INTEGER
//     )
//   `)
// }

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
  ipcMain.handle('openFile', handleFileOpen)

  createWindow()
  initDB()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  app.quit()

  // }
})
