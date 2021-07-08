'use strict'
import { app, BrowserWindow } from "electron";
import {format as formatUrl} from "url";
import * as path from "path";

const isDevelopment = process.env.NODE_ENV !== 'production'

var mainWindow:BrowserWindow | null;
function createWindow() {

    let window:BrowserWindow | null = new BrowserWindow({
        // width: 1920 / 2,
        // height: 1080 / 2,
        // icon: path.join(__dirname, "../icons/png/64x64.png"),
        // frame: false,
        webPreferences: { nodeIntegration: true }
    });

    if (isDevelopment) {
        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
        window.webContents.openDevTools()
    } else {
        window.loadURL(formatUrl({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file:",
            slashes: true
        }));
    }
    // Turn off the menubar at the top.
    window.setMenu(null);

    window.on('closed', () => {
        window = null
    })

    return window
}

app.on("ready", () => {
    mainWindow = createWindow();
    {mainWindow};
    
    console.log("Ready")
});

app.on("window-all-closed", () => {
    app.quit();
});


// let playlist = document.getElementById("playlist") as HTMLElement

// playlist.ondrop = dropHandler
// playlist.ondragover = dragover_handler