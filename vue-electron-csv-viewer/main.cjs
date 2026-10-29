const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const {
  openDb,
  parseCsv,
  listReports,
  getReport,
  insertReport,
  renameReport,
  updateRow,
  deleteReport,
  clearAllReports,
  exportRowsToJson,
  exportRowsToSpreadsheet
} = require('./db.cjs');
const { buildApplicationMenu } = require('./menu.cjs');

const DEV_URL = process.env.ELECTRON_START_URL;
const PROD_INDEX = path.join(
  __dirname,
  'dist',
  'index.html'
);

let db;

const LOG_FILE = path.join(app.getPath('userData'), 'renderer.log');

function logToRenderer(message, level = 'error', context = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context
  };
  const line = JSON.stringify(entry) + '\n';
  fs.appendFileSync(LOG_FILE, line, { encoding: 'utf8' });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const splashPath = path.join(__dirname, 'splash.html');
  if (DEV_URL) {
    const req = require('http').get(DEV_URL, () => {
      win.loadURL(DEV_URL);
      win.webContents.on('dom-ready', () => {
        win.show();
        win.webContents.openDevTools();
      });
    });
    req.on('error', () => {
      // Vite not ready yet; poll
      const tryLoad = () => {
        const r = require('http').get(DEV_URL, () => {
          win.loadURL(DEV_URL);
          win.webContents.on('dom-ready', () => {
            win.show();
            win.webContents.openDevTools();
          });
        });
        r.on('error', () => setTimeout(tryLoad, 300));
      };
      setTimeout(tryLoad, 200);
    });
  } else {
    win.loadFile(splashPath);
    win.webContents.on('dom-ready', () => {
      win.loadFile(PROD_INDEX);
      win.webContents.on('dom-ready', () => {
        win.show();
      });
    });
  }
}

function registerIpc() {
  ipcMain.handle('report:open-csv', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Select CSV report file',
      filters: [{ name: 'CSV files', extensions: ['csv'] }],
      properties: ['openFile']
    });
    if (result.canceled) return { canceled: true };
    return { canceled: false, filePath: result.filePaths[0] };
  });

  ipcMain.handle('report:import', (_event, { filePath, name }) => {
    const rows = parseCsv(filePath);
    const sourceFile = path.basename(filePath);
    const reportName = name && name.trim() ? name.trim() : sourceFile;
    return insertReport(db, reportName, sourceFile, rows);
  });

  ipcMain.handle('report:list', () => listReports(db));

  ipcMain.handle('report:get', (_event, id) => getReport(db, id));

  ipcMain.handle('report:rename', (_event, { id, name }) =>
    renameReport(db, id, name.trim())
  );

  ipcMain.handle('report:update-row', (_event, { id, values }) =>
    updateRow(db, id, values)
  );

  ipcMain.handle('report:delete', (_event, id) => deleteReport(db, id));

  ipcMain.handle('report:clear', () => clearAllReports(db));

  ipcMain.handle('report:export', async (_event, { id, format }) => {
    const extensions =
      format === 'json' ? ['json'] : format === 'ods' ? ['ods'] : ['xlsx'];
    const result = await dialog.showSaveDialog({
      title: 'Export report',
      defaultPath: `${id}-report.${extensions[0]}`,
      filters: [
        { name: extensions[0].toUpperCase(), extensions }
      ]
    });
    if (result.canceled || !result.filePath) return { canceled: true };

    if (format === 'json') {
      return exportRowsToJson(db, id, result.filePath);
    }
    return exportRowsToSpreadsheet(db, id, result.filePath, format);
  });

  ipcMain.handle('renderer:log', (_event, { level, message, context }) => {
    logToRenderer(message, level, context);
    return { logged: true };
  });
}

app.whenReady().then(() => {
  app.setAsDefaultProtocolClient('https');
  app.setAsDefaultProtocolClient('http');
  app.setAsDefaultProtocolClient('file');
  app.commandLine.appendSwitch('disable-gpu-disk-cache');
  app.commandLine.appendSwitch('disable-http-cache');

  const dbPath = path.join(app.getPath('userData'), 'reports.db');
  db = openDb(dbPath);
  registerIpc();

  Menu.setApplicationMenu(buildApplicationMenu());
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
