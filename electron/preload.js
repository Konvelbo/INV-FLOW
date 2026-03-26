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
  getData: (type, ...params) => ipcRenderer.invoke("get-data", type, params),
  actionData: (type, method, ...params) => ipcRenderer.invoke("action-data", type, method, params),
  generatePDF: (html) => ipcRenderer.invoke("generate-pdf", html),
  getLocale: () => ipcRenderer.invoke("get-locale"),
});
