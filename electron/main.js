const {
  app,
  BrowserWindow,
  session,
  ipcMain,
  Notification,
} = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Si vous en avez un
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.setMenuBarVisibility(false);

  if (app.isPackaged) {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;",
          ],
        },
      });
    });
  }

  // En développement : on charge l'URL de Next.js
  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    // En production : on charge le fichier HTML exporté
    win.loadFile(path.join(__dirname, "../out/index.html"));
  }

  // Handle notifications from renderer
  ipcMain.on("notify", (event, { title, options }) => {
    const notification = new Notification({
      title: title,
      body: options.body,
      icon: options.icon,
      silent: false,
    });

    notification.show();

    notification.on("click", () => {
      if (win.isMinimized()) win.restore();
      win.focus();
    });
  });

  return win;
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
