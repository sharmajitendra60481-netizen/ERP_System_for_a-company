const { app, BrowserWindow, Menu, shell, Tray } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'OilERP — Edible Oil Enterprise Desktop Portal',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: false,
  })

  // Load local Next.js Web Portal
  const portalUrl = process.env.PORTAL_URL || 'http://localhost:3000'
  
  mainWindow.loadURL(portalUrl).catch(() => {
    // Retry loading if dev server is warming up
    setTimeout(() => mainWindow.loadURL(portalUrl), 3000)
  })

  // Open external links in default OS browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })

  // Set Desktop Application Menu
  const menuTemplate = [
    {
      label: 'OilERP',
      submenu: [
        { label: 'Reload Portal', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() },
        { label: 'Toggle Full Screen', accelerator: 'F11', click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()) },
        { type: 'separator' },
        { label: 'Exit Desktop App', role: 'quit' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Apex Edible Oils ERP',
          click: () => {
            const { dialog } = require('electron')
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About OilERP Desktop',
              message: 'OilERP — Enterprise Management System',
              detail: 'Version 1.0.0 Desktop Client\nBuilt for Apex Edible Oils & Foods Pvt Ltd\nSupabase PostgreSQL Connected',
            })
          },
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
