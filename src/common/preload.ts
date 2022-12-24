const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    handleAdapter: (callback) => ipcRenderer.on('adapterArray', callback),
    handleDefaultAdapter: (callback) => ipcRenderer.on("defaultAdapter", callback),
    setAdapter: (adapter) => ipcRenderer.send("setAdapter", adapter),
    setState: (state) => ipcRenderer.send("setState", state)
})