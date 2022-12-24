var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
/*
 * Imports
 */
var _a = require('electron'), app = _a.app, ipcMain = _a.ipcMain, session = _a.session, Tray = _a.Tray, Menu = _a.Menu, BrowserWindow = _a.BrowserWindow, dialog = _a.dialog;
var path = require("path");
var execSync = require("node:child_process").execSync;
var exec = require("sudo-prompt").exec;
var Store = require("electron-store");
var store = new Store();
/*
 * Main Variable
 */
var selectedAdapter = store.get("defaultAdapter") != null ? store.get("defaultAdapter") : getAdapters()[0][3];
/*
 * Window App
 */
var tray;
var createWindow = function () { return __awaiter(_this, void 0, void 0, function () {
    var win, shell, contextMenu;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                win = new BrowserWindow({
                    webPreferences: {
                        preload: path.join(__dirname, "..", "common", 'preload.js'),
                    },
                    width: 800,
                    height: 600,
                    autoHideMenuBar: true,
                    icon: path.join(__dirname, "..", "..", "static", "assets", "icon.ico")
                });
                // Send adapter array
                return [4 /*yield*/, win.webContents.send("adapterArray", getAdapters())];
            case 1:
                // Send adapter array
                _a.sent();
                // Send default array
                return [4 /*yield*/, win.webContents.send("defaultAdapter", selectedAdapter)];
            case 2:
                // Send default array
                _a.sent();
                // Handler to set the actual adapter and to store it
                return [4 /*yield*/, ipcMain.on('setAdapter', function (event, adapter) {
                        selectedAdapter = adapter;
                        store.set("defaultAdapter", adapter);
                    })];
            case 3:
                // Handler to set the actual adapter and to store it
                _a.sent();
                // Handler to enable or disable an adapter
                return [4 /*yield*/, ipcMain.on("setState", function (event, state) {
                        exec('netsh interface set interface "' + selectedAdapter + '" ' + state, { name: "Connection Switcher" });
                    })];
            case 4:
                // Handler to enable or disable an adapter
                _a.sent();
                shell = require("electron").shell;
                win.webContents.setWindowOpenHandler(function (_a) {
                    var url = _a.url;
                    shell.openExternal(url);
                    return { action: 'deny' };
                });
                // Minimize to tray
                win.on("minimize", function (e) {
                    e.preventDefault();
                    win.hide();
                    tray = new Tray(path.join(__dirname, "..", "..", "static", "assets", "icon.ico"));
                    tray.setToolTip("Connection Switcher");
                    tray.setIgnoreDoubleClickEvents(true);
                    tray.on("click", function () {
                        win.show();
                        if (!tray.isDestroyed()) {
                            tray.destroy();
                        }
                    });
                    tray.setContextMenu(contextMenu);
                });
                win.on("close", function (e) {
                    if (!app.isQuiting) {
                        e.preventDefault();
                        win.hide();
                        tray = new Tray(path.join(__dirname, "..", "..", "static", "assets", "icon.ico"));
                        tray.setToolTip("Connection Switcher");
                        tray.setIgnoreDoubleClickEvents(true);
                        tray.on("click", function () {
                            win.show();
                            if (!tray.isDestroyed()) {
                                tray.destroy();
                            }
                        });
                        tray.setContextMenu(contextMenu);
                    }
                    return false;
                });
                contextMenu = Menu.buildFromTemplate([
                    {
                        label: "Show Connection Switcher", click: function () {
                            win.show();
                            if (!tray.isDestroyed()) {
                                tray.destroy();
                            }
                        }
                    },
                    {
                        type: "separator"
                    },
                    {
                        label: "Selected Adapter :",
                        enabled: false
                    },
                    {
                        label: selectedAdapter + "",
                        enabled: false
                    },
                    {
                        type: "separator"
                    },
                    {
                        label: "Enable", click: function () { return exec('netsh interface set interface "' + selectedAdapter + '" enable', { name: "Connection Switcher" }); }
                    },
                    {
                        label: "Disable", click: function () { return exec('netsh interface set interface "' + selectedAdapter + '" disable', { name: "Connection Switcher" }); }
                    },
                    {
                        type: "separator"
                    },
                    {
                        label: "Quit", click: function () {
                            if (!tray.isDestroyed()) {
                                tray.destroy();
                            }
                            app.isQuiting = true;
                            app.quit();
                        }
                    }
                ]);
                // Show page
                return [4 /*yield*/, win.loadFile(path.join(__dirname, "..", "..", "static", "index.html"))];
            case 5:
                // Show page
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
app.whenReady().then(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Security
                session.defaultSession.webRequest.onHeadersReceived(function (details, callback) {
                    callback({
                        responseHeaders: __assign(__assign({}, details.responseHeaders), { 'Content-Security-Policy': ['default-src \'self\''] })
                    });
                });
                // Handler main to renderer
                return [4 /*yield*/, ipcMain.on('adapterArray', function () { })];
            case 1:
                // Handler main to renderer
                _a.sent();
                return [4 /*yield*/, ipcMain.on("defaultAdapter", function () { })
                    // Open the app window
                ];
            case 2:
                _a.sent();
                if (!(process.platform === "win32")) return [3 /*break*/, 4];
                return [4 /*yield*/, createWindow()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4: return [2 /*return*/, dialog.showErrorBox("Incompatible OS", "You can only use \"Connection Switcher\" on Windows.")];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Stop the app when all windows are closed
app.on('window-all-closed', function () {
    //if(!tray.isDestroyed()) tray.destroy();
    if (process.platform !== 'darwin')
        app.quit();
    if (!tray.isDestroyed()) {
        tray.destroy();
    }
});
/*
 * Get adapters system
 */
function getAdapters() {
    var result = execSync('@chcp 65001 >nul & cmd /d/s/c netsh interface show interface', { 'encoding': 'UTF-8' });
    // Split items to lines
    var lines = result.split('\n');
    // Remove all blank lines
    lines = lines.filter(function (e) {
        return e !== '\r' && e !== '' && e !== '\n';
    });
    // Remove the 2 first lines (useless)
    for (var i = 0; i < 2; i++) {
        lines.shift();
    }
    // Join elements separated by semicolon
    for (var i = 0; i < lines.length; i++) {
        for (var j = 0; j < 3; j++) {
            lines[i] = lines[i].replace(/\s+/, ";");
        }
    }
    // Remove \r at the end of lines
    for (var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(/\r/, "");
    }
    // Split elements by semicolon to a 2D Array
    var tokens = Array.from(Array(lines.length), function () { return new Array(4); });
    for (var i = 0; i < tokens.length; i++) {
        for (var j = 0; j < tokens[0].length; j++) {
            tokens[i][j] = lines[i].split(";")[j];
        }
    }
    return tokens;
}
//# sourceMappingURL=main.js.map