var _a = require('electron'), contextBridge = _a.contextBridge, ipcRenderer = _a.ipcRenderer;
contextBridge.exposeInMainWorld('api', {
    handleAdapter: function (callback) { return ipcRenderer.on('adapterArray', callback); },
    handleDefaultAdapter: function (callback) { return ipcRenderer.on("defaultAdapter", callback); },
    setAdapter: function (adapter) { return ipcRenderer.send("setAdapter", adapter); },
    setState: function (state) { return ipcRenderer.send("setState", state); }
});
//# sourceMappingURL=preload.js.map