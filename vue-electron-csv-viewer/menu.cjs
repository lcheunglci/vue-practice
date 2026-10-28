const { app, dialog, Menu, BrowserWindow, shell } = require('electron');
const path = require('path');

function toggleDarkMode() {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.webContents.send('toggle-theme', { source: 'menu' });
}

function showLogFile() {
  const logFile = path.join(app.getPath('userData'), 'renderer.log');
  shell.openPath(logFile);
}

function showAbout() {
  dialog.showMessageBox({
    type: 'info',
    title: `About ${app.getName()}`,
    message: app.getName(),
    detail: `Version ${app.getVersion()}\nDesktop CSV report viewer built with Electron + Vue.`
  });
}

function buildApplicationMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Toggle Dark Mode', accelerator: 'CommandOrControl+Shift+D', click: toggleDarkMode },
        { label: 'Show Log File', click: showLogFile },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
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
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Reports Insight',
          click: () => showAbout()
        }
      ]
    }
  ];

  return Menu.buildFromTemplate(template);
}

module.exports = { buildApplicationMenu };
