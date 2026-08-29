const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')

let mainWindow
const portalUrl = process.env.PORTAL_URL || 'http://localhost:3000'

function showPortalUnavailable() {
  const safeUrl = portalUrl.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`
    <main style="font-family:Segoe UI,Arial,sans-serif;max-width:680px;margin:12vh auto;padding:32px;color:#172033">
      <h1>OilERP portal is not running</h1>
      <p>The desktop shell is ready, but it cannot reach the ERP portal at <strong>${safeUrl}</strong>.</p>
      <ol><li>Start the ERP services with <code>pnpm dev</code>.</li><li>Wait for the web portal on port 3000.</li><li>Click Retry below.</li></ol>
      <button onclick="location.href='${safeUrl}'" style="padding:10px 16px;border:0;border-radius:6px;background:#0f766e;color:white;font-weight:600;cursor:pointer">Retry connection</button>
    </main>`)} `)
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'OilERP — Industrial Manufacturing ERP',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: false,
  })

  // Load the local portal or a deployed portal supplied with PORTAL_URL.
  mainWindow.loadURL(portalUrl).catch(showPortalUnavailable)
  mainWindow.webContents.on('did-fail-load', (_event, _code, _description, validatedUrl, isMainFrame) => {
    if (isMainFrame && validatedUrl === portalUrl) showPortalUnavailable()
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
        { label: 'Reload Portal', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.loadURL(portalUrl).catch(showPortalUnavailable) },
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
          label: 'About OilERP',
          click: () => {
            const { dialog } = require('electron')
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About OilERP',
              message: 'OilERP — Industrial Manufacturing ERP',
              detail: 'Version 1.0.0 Desktop Client\nBuilt for manufacturing operations\nPostgreSQL connected',
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
