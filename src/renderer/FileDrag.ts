import { player } from "./AudioPlayer";
import { triggerOverlay } from "./Overlay";

const filePlaylist = [];

interface WebkitEntry {
    file: (file: any) => void;
    createReader: () => {
        readEntries: (a: (e: any[]) => void) => void
    }
    isFile: boolean,
    isDirectory: boolean,
}

/**
 * When a file is detected as being 'dropped', this method is called to
 * -- handle the introduction of the files into the playlist.
 */
export function drop_handler(event: DragEvent) {
    event.preventDefault();
    let items = event.dataTransfer?.items;

    if (items == undefined) return
    // Loop through every file and add them to the list.
    for (let file of items) {
        scanFile(file.webkitGetAsEntry());
        console.log(file.webkitGetAsEntry())
    }

    triggerOverlay({ action: "remove" });
}

/**
 * Takes a file object and determines how to parse the object
 * depending on whether it is a singular file or a directory.
 * @param item File to scan
 */
function scanFile(item: WebkitEntry) {
    if (item.isFile) {
        fileReader(item).then((file: any) => {
            filePlaylist.push({
                name: file.name,
                url: URL.createObjectURL(file)
            });
            // Tell player.js to update the DOM
            player.addMusic(file.name);
            console.log("Added new music to list.");
        });
    }
    else if (item.isDirectory) {
        dirReader(item);
    }
}

/**
 * Read each file within the directory and run
 * scanFile to each file to properly add it into the playlist.
 * @param directory
 */
function dirReader(directory: WebkitEntry) {
    var reader = directory.createReader();
    reader.readEntries((fileList: any[]) => {
        fileList.forEach(file => scanFile(file));
    });
}

/**
 * Takes a File object as input and returns the contents of it.
 * This wrapper is to ease development.
 * @param file File object
 */
function fileReader(file: WebkitEntry) {
    return new Promise((res, rej) => {
        file.file(function (_file: any) {
            res(_file);
        });
    });
}

// Is called when the file is dragged over the "drop zone".
export function dragover_handler(event: any) {
    event.preventDefault();
    // Gives a plus symbol for the cursor.
    event.dataTransfer.dropEffect = "copy";
    triggerOverlay({ action: "add" });
}

// Is called when the file has left the "drop zone".
export function dragleave_handler(event: any) {
    triggerOverlay({ action: "remove" });
}
