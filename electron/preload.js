const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendNotification: (title, options) =>
    ipcRenderer.send("notify", { title, options }),
});
