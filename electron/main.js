/* eslint-disable @typescript-eslint/no-require-imports */
const {
  app,
  BrowserWindow,
  session,
  ipcMain,
  Notification,
  shell,
  Tray,
  Menu,
  protocol,
  dialog,
} = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const { handleDataRequest, handleActionRequest } = require("./data-handlers");
const { startAutomationService } = require("./automation-service");

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
let tray = null;
let isQuitting = false;

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
          // Error parsing deep link
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
      show: false, // Don't show the window until it's ready, preventing black/flicker
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
        spellcheck: true,
        devTools: !app.isPackaged, // Disable DevTools in production
      },
      backgroundColor: "#000000",
    });

    // Gracefully show the window once it's ready to be displayed
    win.once("ready-to-show", () => {
      win.show();
    });
    
    // Support background mode: hide window instead of closing
    win.on("close", (event) => {
      if (!isQuitting) {
        event.preventDefault();
        win.hide();
        return false;
      }
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
      const fsPromises = fs.promises;

      // Helper: guess MIME type from extension (no external dep needed)
      const getMime = (filePath) => {
        const ext = filePath.split(".").pop().toLowerCase();
        const map = {
          html: "text/html; charset=utf-8",
          js: "application/javascript; charset=utf-8",
          mjs: "application/javascript; charset=utf-8",
          css: "text/css; charset=utf-8",
          json: "application/json; charset=utf-8",
          txt: "text/x-component; charset=utf-8",
          png: "image/png",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          gif: "image/gif",
          svg: "image/svg+xml",
          ico: "image/x-icon",
          woff: "font/woff",
          woff2: "font/woff2",
          ttf: "font/ttf",
          mp3: "audio/mpeg",
          webp: "image/webp",
          map: "application/json",
        };
        return map[ext] || "application/octet-stream";
      };

      protocol.handle("app", async (request) => {
        const originalUrl = request.url;
        let urlPath = "";

        try {
          const parsedUrl = new URL(originalUrl);
          urlPath = decodeURIComponent(parsedUrl.pathname);
        } catch (e) {
          urlPath = originalUrl.replace(/^app:\/\/[^/]*/, "");
        }

        // Strip query strings and hashes from path
        urlPath = urlPath.split("?")[0].split("#")[0];

        // Normalize leading prefix
        if (urlPath.startsWith("./")) urlPath = urlPath.slice(2);
        if (urlPath.startsWith("/")) urlPath = urlPath.slice(1);
        if (urlPath === "." || urlPath === "") urlPath = "index.html";

        const outDir = path.join(__dirname, "../out");
        let finalPath = path.join(outDir, urlPath);

        // Detect RSC (soft-navigation) requests from Next.js router
        const isRSC =
          originalUrl.includes("_rsc=") ||
          originalUrl.includes("?rsc=") ||
          (request.headers &&
            (request.headers.get("RSC") === "1" ||
              request.headers.get("rsc") === "1" ||
              request.headers.get("Next-Router-Prefetch") === "1" ||
              request.headers.get("Next-Router-State-Tree") !== null));

        try {
          // 1. Try serving exact path if it exists as a file
          let stats = await fsPromises.stat(finalPath).catch(() => null);
          
          if (stats && stats.isFile()) {
            const content = await fsPromises.readFile(finalPath);
            return new Response(content, {
              headers: { 
                "content-type": getMime(finalPath),
                "content-length": content.length.toString()
              },
            });
          }

          // 2. Handle Next.js RSC requests (.txt files for segments)
          if (isRSC) {
            const rscPath = `${finalPath}.txt`;
            const rscStats = await fsPromises.stat(rscPath).catch(() => null);
            if (rscStats && rscStats.isFile()) {
              const content = await fsPromises.readFile(rscPath);
              return new Response(content, {
                headers: { 
                  "content-type": "text/x-component; charset=utf-8",
                  "content-length": content.length.toString()
                },
              });
            }
          }

          // 3. Handle folder index or .html extension fallback
          const htmlPath = finalPath.endsWith(".html") ? finalPath : `${finalPath}.html`;
          const htmlStats = await fsPromises.stat(htmlPath).catch(() => null);
          if (htmlStats && htmlStats.isFile()) {
            const content = await fsPromises.readFile(htmlPath);
            return new Response(content, {
              headers: { 
                "content-type": "text/html; charset=utf-8",
                "content-length": content.length.toString()
              },
            });
          }

          // 4. Handle Directory index.html
          if (stats && stats.isDirectory()) {
            const indexHtml = path.join(finalPath, "index.html");
            const indexStats = await fsPromises.stat(indexHtml).catch(() => null);
            if (indexStats && indexStats.isFile()) {
              const content = await fsPromises.readFile(indexHtml);
              return new Response(content, {
                headers: { 
                  "content-type": "text/html; charset=utf-8",
                  "content-length": content.length.toString()
                },
              });
            }
          }

          // 5. Final fallback: SPA shell (index.html) for unknown client-side routes
          const spaShell = path.join(outDir, "index.html");
          if (fs.existsSync(spaShell)) {
             const shellContent = await fsPromises.readFile(spaShell);
             return new Response(shellContent, {
               headers: { 
                 "content-type": "text/html; charset=utf-8",
                 "content-length": shellContent.length.toString()
               },
             });
          }

          return new Response("Not Found", { status: 404 });
        } catch (err) {
          if (!app.isPackaged) {
             console.error(`[Protocol] Error serving: ${finalPath}`, err.message);
          }
          return new Response("Not Found", { status: 404 });
        }
      });

      const indexPath = path.join(__dirname, "../out/index.html");
      if (app.isPackaged && !fs.existsSync(indexPath)) {
        dialog.showErrorBox(
          "Erreur d'Intégrité",
          "Les fichiers de l'application (index.html) sont manquants dans le répertoire 'out'. Veuillez reconstruire l'application ou réinstaller.",
        );
      }

      win.loadURL("app://index.html");
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
          // Error parsing deep link
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
    ipcMain.handle("get-data", async (event, type, ...params) => {
      return await handleDataRequest(type, params);
    });

    // Handle data mutations via unified handlers
    ipcMain.handle("action-data", async (event, type, method, ...params) => {
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
    createTray();

    // Start background automation service (recurring invoices, reminders)
    startAutomationService(win);

    // Auto-check for updates on startup
    autoUpdater.checkForUpdatesAndNotify()
      .catch(() => {});

    // Auto Update configuration
    autoUpdater.autoDownload = true; // Download updates automatically in the background

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
      // Automatically install the update immediately after download completes
      setTimeout(() => {
        autoUpdater.quitAndInstall();
      }, 3000); // 3 seconds delay before restarting
    });

    // IPC for updates
    ipcMain.handle("check-for-updates", async () => {
      return await autoUpdater.checkForUpdatesAndNotify();
    });

    ipcMain.handle("start-download", async () => {
      return await autoUpdater.downloadUpdate();
    });

    ipcMain.handle("quit-and-install", () => {
      isQuitting = true;
      autoUpdater.quitAndInstall();
    });
  });

  function createTray() {
    const iconPath = path.join(__dirname, "../public/black-caractere-non-black.png");
    tray = new Tray(iconPath);
    
    const contextMenu = Menu.buildFromTemplate([
      { 
        label: "Ouvrir ESSOR", 
        click: () => {
          win.show();
        } 
      },
      { type: "separator" },
      { 
        label: "Quitter", 
        click: () => {
          isQuitting = true;
          app.quit();
        } 
      }
    ]);
    
    tray.setToolTip("ESSOR - Gestion de Facturation");
    tray.setContextMenu(contextMenu);
    
    tray.on("double-click", () => {
      win.show();
    });
  }

  app.on("before-quit", () => {
    isQuitting = true;
  });

  app.on("window-all-closed", () => {
    // Keep the app running in the background (tray)
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform === "darwin") {
      // Standard macOS behavior
    }
  });
}
