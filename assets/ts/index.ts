const {app, BrowserWindow} = require("electron");
const url = require("url");
const path = require("path");

// Enables hot reloading
// require('electron-reload')(__dirname);

var win;

function createWindow(){

    win = new BrowserWindow({
        width: 1920/2,
        height: 1080/2,
        icon: path.join(__dirname, "../icons/png/64x64.png"),
        frame:false,
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, "../../index.html"),
        protocol:"file:",
        slashes:true
    }));

    // Turn off the menubar at the top.
    win.setMenu(null);


//   win.webContents.openDevTools();
}

app.on("ready", () => {
    createWindow();
});

app.on("window-all-closed", () => {
    app.quit();
});
