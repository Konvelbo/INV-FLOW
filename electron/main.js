/* eslint-disable @typescript-eslint/no-require-imports */
const {
  app,
  BrowserWindow,
  session,
  ipcMain,
  Notification,
  shell,
  Menu,
  protocol,
} = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const { handleDataRequest, handleActionRequest } = require("./data-handlers");

const isDev = !app.isPackaged;

// Register custom protocol as privileged
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      allowServiceWorkers: true,
      corsEnabled: false,
    },
  },
]);
let win;

// Force single instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine) => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();

      // Extract token from essor://login?token=...
      // Use a more robust search to handle quoted URLs from Windows
      const url = commandLine.find((arg) => arg.includes("essor://"));
      if (url) {
        try {
          const parsedUrl = new URL(url.replace(/\/$/, "")); // Remove trailing slash if any
          const token = parsedUrl.searchParams.get("token");
          const data = parsedUrl.searchParams.get("data");
          if (token || data) {
            win.webContents.send("login-success", { token, data });
          }
        } catch (e) {
          console.error("Failed to parse second-instance deep link URL:", e);
        }
      }
    }
  });

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
        devTools: !app.isPackaged, // Disable DevTools in production
      },
      backgroundColor: "#000000",
    });

    // Menu.setApplicationMenu(null);

    if (app.isPackaged) {
      win.setMenuBarVisibility(false);
      win.removeMenu(); // Completely remove menu in production
    }

    // ... (rest of the CSP and loading code)
    if (app.isPackaged) {
      session.defaultSession.webRequest.onHeadersReceived(
        (details, callback) => {
          callback({
            responseHeaders: {
              ...details.responseHeaders,
              "Content-Security-Policy": [
                "default-src 'self' app:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com https://*.mongodb.net; connect-src 'self' https://*.mongodb.net https://api.cloudinary.com https://api.resend.com https://*.resend.com wss://*; media-src 'self' blob:;",
              ],
            },
          });
        },
      );
    }

    if (isDev) {
      win.loadURL("http://localhost:3000");
    } else {
      const fs = require("fs");
      protocol.handle("app", (request) => {
        let urlPath = "";
        try {
          const parsedUrl = new URL(request.url);
          urlPath = decodeURIComponent(parsedUrl.pathname);
        } catch (e) {
          urlPath = request.url.replace("app://", "");
        }
        
        // Remove query strings or hashes
        urlPath = urlPath.split("?")[0].split("#")[0];
        
        // Remove leading prefixes
        if (urlPath.startsWith("./")) urlPath = urlPath.slice(2);
        if (urlPath.startsWith("/")) urlPath = urlPath.slice(1);
        if (urlPath === "." || urlPath === "") urlPath = "index.html";

        let finalPath = path.join(__dirname, "../out", urlPath);

        // Next.js App Router creates both a .html file and a directory for the RSC chunks
        // Check for .html first to avoid incorrectly serving directory contents
        if (fs.existsSync(`${finalPath}.html`)) {
          finalPath = `${finalPath}.html`;
        } else if (fs.existsSync(finalPath) && fs.statSync(finalPath).isDirectory()) {
          if (fs.existsSync(path.join(finalPath, "index.html"))) {
            finalPath = path.join(finalPath, "index.html");
          }
        }

        // Final fallback if file doesn't exist (e.g. for client-side routing)
        if (!fs.existsSync(finalPath)) {
          finalPath = path.join(__dirname, "../out/index.html");
        }

        return session.defaultSession.fetch(`file://${finalPath}`);
      });

      win.loadURL("app://./index.html");
    }

    // ... (deep linking and notifications)
    const argUrl = process.argv.find((arg) => arg.includes("essor://"));
    if (argUrl) {
      win.webContents.once("did-finish-load", () => {
        try {
          const parsedUrl = new URL(argUrl);
          const token = parsedUrl.searchParams.get("token");
          const data = parsedUrl.searchParams.get("data");
          if (token || data) {
            win.webContents.send("login-success", { token, data });
          }
        } catch (e) {
          console.error("Failed to parse startup deep link:", e);
        }
      });
    }

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

    ipcMain.handle("open-external", async (event, url) => {
      await shell.openExternal(url);
    });

    // Handle data fetching via unified handlers
    ipcMain.handle("get-data", async (event, type, params) => {
      return await handleDataRequest(type, params);
    });

    // Handle data mutations via unified handlers
    ipcMain.handle("action-data", async (event, type, method, params) => {
      return await handleActionRequest(type, method, params);
    });

    ipcMain.handle("get-locale", () => {
      return app.getLocale();
    });

    ipcMain.handle("get-version", () => {
      return app.getVersion();
    });

    // Handle PDF generation locally
    ipcMain.handle("generate-pdf", async (event, html) => {
      const pdfWin = new BrowserWindow({
        show: false,
        webPreferences: {
          offscreen: true,
        },
      });

      await pdfWin.loadURL(
        `data:text/html;charset=utf-8,${encodeURIComponent(html)}`,
      );

      const pdf = await pdfWin.webContents.printToPDF({
        printBackground: true,
        marginsType: 0,
        pageSize: "A4",
      });

      pdfWin.destroy();
      return pdf;
    });
  }

  // Handle protocol registration more robustly
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient("essor", process.execPath, [
        path.resolve(process.argv[1]),
      ]);
    }
  } else {
    app.setAsDefaultProtocolClient("essor");
  }

  app.whenReady().then(() => {
    createWindow();
    
    // Auto Update configuration
    autoUpdater.autoDownload = false; // We want users to see the progress
    
    autoUpdater.on("checking-for-update", () => {
      win.webContents.send("update-status", "checking");
    });

    autoUpdater.on("update-available", (info) => {
      win.webContents.send("update-status", "available", info);
    });

    autoUpdater.on("update-not-available", (info) => {
      win.webContents.send("update-status", "not-available", info);
    });

    autoUpdater.on("error", (err) => {
      win.webContents.send("update-status", "error", err.message);
    });

    autoUpdater.on("download-progress", (progressObj) => {
      win.webContents.send("update-progress", progressObj);
    });

    autoUpdater.on("update-downloaded", (info) => {
      win.webContents.send("update-status", "downloaded", info);
    });

    // IPC for updates
    ipcMain.handle("check-for-updates", async () => {
      return await autoUpdater.checkForUpdatesAndNotify();
    });

    ipcMain.handle("start-download", async () => {
      return await autoUpdater.downloadUpdate();
    });

    ipcMain.handle("quit-and-install", () => {
      autoUpdater.quitAndInstall();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
