/*
 * Imports
 */
const { app, ipcMain, session, Tray, Menu, BrowserWindow, dialog } = require('electron');
const path = require("path");
const { execSync } = require("node:child_process");
const { exec } = require("sudo-prompt");
const Store = require("electron-store");
const store = new Store();

/*
 * Main Variable
 */
let selectedAdapter = store.get("defaultAdapter") != null ? store.get("defaultAdapter") : getAdapters()[0][3];

/*
 * Window App
 */
let tray;
const createWindow = async () => {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "..", "common", 'preload.js'),
        },
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "..", "..", "static", "assets", "icon.ico")
    });

    // Send adapter array
    await win.webContents.send("adapterArray", getAdapters());
    // Send default array
    await win.webContents.send("defaultAdapter", selectedAdapter);

    // Handler to set the actual adapter and to store it
    await ipcMain.on('setAdapter', (event, adapter) => {
        selectedAdapter = adapter;
        store.set("defaultAdapter", adapter);
    });

    // Handler to enable or disable an adapter
    await ipcMain.on("setState", (event, state) => {
        exec('netsh interface set interface "'+selectedAdapter+'" '+state, { name: "Connection Switcher" });
    });

    // Open all target=_blank links in default browser
    const shell = require("electron").shell;
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Minimize to tray
    win.on("minimize", function(e) {
        e.preventDefault();
        win.hide();
        tray = new Tray(path.join(__dirname, "..", "..", "static", "assets", "icon.ico"));
        tray.setToolTip("Connection Switcher");
        tray.setIgnoreDoubleClickEvents(true);
        tray.on("click", function() {
            win.show();
            if(!tray.isDestroyed()) {
                tray.destroy();
            }
        });
        tray.setContextMenu(contextMenu);
    })

    win.on("close", function(e) {
        if(!app.isQuiting) {
            e.preventDefault();
            win.hide();
            tray = new Tray(path.join(__dirname, "..", "..", "static", "assets", "icon.ico"));
            tray.setToolTip("Connection Switcher");
            tray.setIgnoreDoubleClickEvents(true);
            tray.on("click", function() {
                win.show();
                if(!tray.isDestroyed()) {
                    tray.destroy();
                }
            });
            tray.setContextMenu(contextMenu);
        }
        return false;
    })

    // Tray
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Show Connection Switcher", click: function() {
                win.show();
                if(!tray.isDestroyed()) {
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
            label: selectedAdapter+"",
            enabled: false
        },
        {
            type: "separator"
        },
        {
            label: "Enable", click: () => exec('netsh interface set interface "'+selectedAdapter+'" enable', { name: "Connection Switcher" })
        },
        {
            label: "Disable", click: () => exec('netsh interface set interface "'+selectedAdapter+'" disable', { name: "Connection Switcher" })
        },
        {
            type: "separator"
        },
        {
            label: "Quit", click: function() {
                if(!tray.isDestroyed()) {
                    tray.destroy();
                }
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    // Show page
    await win.loadFile(path.join(__dirname, "..", "..", "static", "index.html"));
}

app.whenReady().then(async () => {
    // Security
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ['default-src \'self\'']
            }
        });
    });

    // Handler main to renderer
    await ipcMain.on('adapterArray', () => {})
    await ipcMain.on("defaultAdapter", () => {})

    // Open the app window
    if (process.platform === "win32") await createWindow();
    else return dialog.showErrorBox("Incompatible OS", "You can only use \"Connection Switcher\" on Windows.");
});

// Stop the app when all windows are closed
app.on('window-all-closed', () => {
    //if(!tray.isDestroyed()) tray.destroy();
    if (process.platform !== 'darwin') app.quit();
    if(!tray.isDestroyed()) {
        tray.destroy();
    }
});

/*
 * Get adapters system
 */
function getAdapters() {
    let result = execSync('@chcp 65001 >nul & cmd /d/s/c netsh interface show interface', {'encoding': 'UTF-8'});
    // Split items to lines
    let lines = result.split('\n');

    // Remove all blank lines
    lines = lines.filter(e => {
        return e !== '\r' && e !== '' && e !== '\n';
    });


    // Remove the 2 first lines (useless)
    for (let i = 0; i < 2; i++) {
        lines.shift();
    }

    // Join elements separated by semicolon
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < 3; j++) {
            lines[i] = lines[i].replace(/\s+/, ";");
        }
    }

    // Remove \r at the end of lines
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(/\r/, "");
    }

    // Split elements by semicolon to a 2D Array
    const tokens = Array.from(Array(lines.length), () => new Array(4));
    for (let i = 0; i < tokens.length; i++) {
        for (let j = 0; j < tokens[0].length; j++) {
            tokens[i][j] = lines[i].split(";")[j];
        }
    }

    return tokens;
}