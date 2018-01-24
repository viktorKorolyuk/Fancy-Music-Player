const {app, BrowserWindow} = require("electron");
const url = require("url");
const path = require("path");

var win;

function createWindow(){

    win = new BrowserWindow({
        width: 500,
        height: 400,
        icon: path.join(__dirname, "assets/icons/png/64x64.png")
        // Frame is enabled until--
        //  new way to drag window is decided,
        ,frame:false,
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
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
