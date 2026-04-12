/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendNotification: (title, options) =>
    ipcRenderer.send("notify", { title, options }),
  openExternal: (url) => ipcRenderer.invoke("open-external", url),
  onLoginSuccess: (callback) => {
    const subscription = (_event, token) => callback(token);
    ipcRenderer.on("login-success", subscription);
    return () => ipcRenderer.removeListener("login-success", subscription);
  },
  getData: (type, ...params) => ipcRenderer.invoke("get-data", type, ...params),
  actionData: (type, method, ...params) => ipcRenderer.invoke("action-data", type, method, ...params),
  generatePDF: (html) => ipcRenderer.invoke("generate-pdf", html),
  getLocale: () => ipcRenderer.invoke("get-locale"),
  getVersion: () => ipcRenderer.invoke("get-version"),
  // Updates
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
  startDownload: () => ipcRenderer.invoke("start-download"),
  quitAndInstall: () => ipcRenderer.invoke("quit-and-install"),
  onUpdateStatus: (callback) => {
    const subscription = (_event, status, info) => callback(status, info);
    ipcRenderer.on("update-status", subscription);
    return () => ipcRenderer.removeListener("update-status", subscription);
  },
  onUpdateProgress: (callback) => {
    const subscription = (_event, progress) => callback(progress);
    ipcRenderer.on("update-progress", subscription);
    return () => ipcRenderer.removeListener("update-progress", subscription);
  },
  onInvoiceRead: (callback) => {
    const subscription = (_event, invoice) => callback(invoice);
    ipcRenderer.on("invoice-read-notification", subscription);
    return () => ipcRenderer.removeListener("invoice-read-notification", subscription);
  },
  onAutomationEvent: (callback) => {
    const subscription = (_event, data) => callback(data);
    ipcRenderer.on("automation-event", subscription);
    return () => ipcRenderer.removeListener("automation-event", subscription);
  },
});
