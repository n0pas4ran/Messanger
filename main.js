const path = require('path');
const url = require('url');
const {
  app,
  BrowserWindow
} = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 650,
    height: 733,
    icon: __dirname + 'src/img/pencil_32.png',
    webPreferences: {nodeIntegration: true},
  });

  // win.loadURL(url.format({
  //   pathname: path.join(__dirname, '/src/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));
  // win.loadURL('http://127.0.0.1:8080');
  win.loadURL('http://localhost:8080');
  // sudo electron-packager ./ runit --platform=mas --arch=x64 --electron-version=1.4.3 --overwrite


  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
