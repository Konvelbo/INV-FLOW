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
});
