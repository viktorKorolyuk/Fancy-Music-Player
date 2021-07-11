import { player_instance } from "./AudioPlayer";
import { triggerOverlay } from "./Overlay";

interface DirectoryReader {
  readEntries: (a: (e: any[]) => void) => void
}

interface FileOrDirectoryEntry {
  file: (file: any) => void;
  createReader: () => DirectoryReader
  isFile: boolean,
  isDirectory: boolean,
}

/**
 * When a file is detected as being 'dropped', this method is called to
 * -- handle the introduction of the files into the playlist.
 */
export async function drop_handler(event: DragEvent) {
  event.preventDefault();
  let items = event.dataTransfer?.items;

  if (items == undefined) return // TODO: Display an error
  // Loop through every file and add them to the list.
  
  for (let file of items) {
    await scanFileEntry(file.webkitGetAsEntry());
  }

  triggerOverlay({ action: "remove" });
}

/**
 * Takes a file object and determines how to parse the object
 * depending on whether it is a singular file or a directory.
 * 
 * @param item File to scan
 * @returns A promise to complete the file or directory scan
 */
async function scanFileEntry(item: FileOrDirectoryEntry):Promise<any> {
  // If it is a directory, wait to scan all files within it
  if (item.isDirectory) {
    let files = await dirReader(item);
    return Promise.all(files.map(file => scanFileEntry(file)))
  }

  return fileReader(item).then((file) => {
    player_instance.addMusic({
      name: file.name,
      url: URL.createObjectURL(file)
    });
  });
}

/**
 * Read each file within the directory and run
 * scanFile to each file to properly add it into the playlist.
 * Deprecated and no longer recommended.
 * https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries
 * 
 * @param directory
 */
async function dirReader(directory: FileOrDirectoryEntry): Promise<FileOrDirectoryEntry[]> {
  var reader = directory.createReader();

  // Read files within the directory
  return await new Promise(res => 
    reader.readEntries((fileList: FileOrDirectoryEntry[]) => res(fileList)))
}

/**
 * Takes a File object as input and returns the contents of it.
 * This wrapper is to ease development.
 * 
 * @param file File object
 */
function fileReader(file: FileOrDirectoryEntry): Promise<File> {
  return new Promise((res) => {
    file.file((_file: File) => res(_file));
  });
}

// Called when the file is dragged over the "drop zone".
export function dragover_handler(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer === null) return;

  event.dataTransfer.dropEffect = "copy"; // Gives a plus symbol for the cursor.
  triggerOverlay({ action: "add" });
}

// Called when the file has left the "drop zone".
export function dragleave_handler(event: DragEvent) {
  triggerOverlay({ action: "remove" });
}
