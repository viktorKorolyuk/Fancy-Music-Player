import {drop_handler, dragover_handler, dragleave_handler} from './FileDrag'

interface Command {
    action: "add" | "remove"
}
var overlay: HTMLElement | null = null;

// Toggles the "drop overlay".
// The "drop overlay" instructs the user when a valid drop can occur.
export function triggerOverlay(command:Command) {
    // If no overlay exists (if it did, the variable would not be undefined) create a the required element.
    if (overlay === null) {
        overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.textContent = "Drop Files.";
        overlay.ondrop = drop_handler;
        overlay.ondragover = dragover_handler;
        overlay.ondragleave = dragleave_handler;
    }
    if (command.action === "add" && !document.body.contains(overlay)) {
        document.body.appendChild(overlay);
    }
    else if (command.action === "remove") {
        overlay.remove();
    }
}
