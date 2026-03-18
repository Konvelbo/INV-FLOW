/* eslint-disable @typescript-eslint/no-require-imports */
const {
  app,
  BrowserWindow,
  session,
  ipcMain,
  Notification,
  shell,
} = require("electron");
const path = require("path");

let win;

// Register the custom protocol for deep linking
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("essor", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("essor");
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: true,
    },
    backgroundColor: "#000000",
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

  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../out/index.html"));
  }

  // Check if app was opened via deep link (Windows)
  const argUrl = process.argv.find((arg) => arg.startsWith("essor://"));
  if (argUrl) {
    win.webContents.once("did-finish-load", () => {
      try {
        const parsedUrl = new URL(argUrl);
        const token = parsedUrl.searchParams.get("token");
        if (token) {
          win.webContents.send("login-success", token);
        }
      } catch (e) {
        console.error("Failed to parse startup deep link:", e);
      }
    });
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

  // Handle opening external URLs in the system browser
  ipcMain.handle("open-external", async (event, url) => {
    await shell.openExternal(url);
  });

  return win;
}

// Handle deep links when the app is already running
app.on("second-instance", (event, commandLine) => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
  
  // Extract token from essor://login?token=...
  const url = commandLine.find((arg) => arg.startsWith("essor://"));
  if (url) {
    try {
      const parsedUrl = new URL(url);
      const token = parsedUrl.searchParams.get("token");
      if (token && win) {
        win.webContents.send("login-success", token);
      }
    } catch (e) {
      console.error("Failed to parse deep link URL:", e);
    }
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
