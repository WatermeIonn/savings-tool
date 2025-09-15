import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

// Initialize database for Electron
async function initElectronDatabase() {
  try {
    if (app.isPackaged) {
      // In packaged app, use userData directory
      const userDataPath = app.getPath('userData');
      const dbPath = path.join(userDataPath, 'database.sqlite');
      process.env.DATABASE_URL = `file:${dbPath}`;
      
      // Ensure directory exists
      const fs = require('fs');
      if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true });
      }
      
      console.log('Database will be stored at:', dbPath);
    }
  } catch (error) {
    console.error('Error initializing database path:', error);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 1200,
    autoHideMenuBar: true,
    webPreferences: {
      // contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
      devTools: false
    },
  })

  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    win.loadURL('http://localhost:3000');

    win.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        'electron' + (process.platform === "win32" ? ".cmd" : "")),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }
}

app.whenReady().then(async () => {
  // Initialize database path for packaged apps
  await initElectronDatabase();
  
  // DevTools
  if (!app.isPackaged) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});
