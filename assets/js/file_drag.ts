const playlist = [];
var overlay = null;
let file:any;


// Is called when a file is dropped into the "drop zone".
function drop_handler(event) {
    event.preventDefault();

    (window as any).items = event.dataTransfer.items;
    // Loop through every file and add them to the list.
    for (file of event.dataTransfer.items) {
        scanFile(file.webkitGetAsEntry());
    }

    triggerOverlay({
        action: "remove"
    });
}

// Determines if the item is a directory or a valid item.
function scanFile(item) {
    if(item.isFile){
        fileReader(item).then((file:any) => {
            playlist.push({
                name: file.name,
                url: URL.createObjectURL(file)
            });

            // Tell player.js to update the DOM
            player.addMusic(file.name);
            console.log("Added new music to list.");
        });

    } else if(item.isDirectory){
        dirReader(item);
    }
}

// If it is a directory, read the contents.
function dirReader(directory) {
    (window as any).dir = directory;
    var reader = directory.createReader();
    reader.readEntries(function (e) {
        e.forEach(file => {
            scanFile(file);
        });
    });
}

// Called when the item is of valid type.
// Returns a promise.
function fileReader(file) {
    return new Promise((res, rej) => {
        file.file(function (_file) {
            res(_file);
        });
    });
}

// Is called when the file is dragged over the "drop zone".
function dragover_handler(event) {
    event.preventDefault();

    // Gives a plus symbol for the cursor.
    event.dataTransfer.dropEffect = "copy";

    triggerOverlay({
        action: "add"
    });

}
// Is called when the file has left the "drop zone".
function dragleave_handler(event) {
    triggerOverlay({
        action: "remove"
    });
}

// Toggles the "drop overlay".
// The "drop overlay" instructs the user when a valid drop can occur.
function triggerOverlay(command) {
    // If no overlay exists (if it did, the variable would not be undefined) create a the required element.
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.textContent = "Drop Files.";
        overlay.ondrop = drop_handler;
        overlay.ondragover = dragover_handler;
        overlay.ondragleave = dragleave_handler;
    }

    if (command.action === "add" && !document.body.contains(overlay)) {
        document.body.appendChild(overlay);
    } else if (command.action === "remove") {
        overlay.remove();
    }
}