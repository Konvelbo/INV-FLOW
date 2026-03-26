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
                "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;",
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
        let url = request.url.replace("app://", "");
        // Remove query strings or hashes
        url = url.split("?")[0].split("#")[0];
        if (url.startsWith("./")) url = url.slice(2);
        if (url === "." || url === "") url = "index.html";

        const filePath = path.join(__dirname, "../out", url);

        let finalPath = filePath;
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          finalPath = path.join(filePath, "index.html");
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

  app.whenReady().then(createWindow);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
