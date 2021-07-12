import { $ } from './Helper'

export interface Track {
  name: string,
  url: string
  file: File
}

export class AudioPlayerPlaylist {
  private element_playlistContainer = $("#playlist") as HTMLElement;
  private track_playlist: Track[] = []
  private elements_playlistEntries: HTMLElement[] = [];
  private playlistIndex: number = 0;

  /**
   * Queue a track to the playlist and update the DOM to display the new track.
   * @param track Track to add.
   * @param clickCallback On-click callback to be added to the corresponding track element in the DOM.
   */
  addTrack(track: Track, clickCallback: (number: number, element: HTMLElement) => void) {

    // Add the new element to the playlist.
    let element_entryContainer = document.createElement("div")
    element_entryContainer.classList.add("trackEntry")

    let element_p = document.createElement("p");

    element_p.textContent = track.name;
    element_entryContainer.appendChild(element_p)

    // If this is the first item in the list, set it to be the selected track entry.
    if (this.elements_playlistEntries.length == 0) {
      element_entryContainer.classList.add("selected");
    }

    // Store the element reference and the track entry in memory for later removal.
    this.elements_playlistEntries.push(element_entryContainer);
    this.track_playlist.push(track)

    // Add a listener to change the current track when a playlist item is clicked.
    // TODO: This will need to be revised when track re-ordering is added.
    element_entryContainer.addEventListener("click", () => {
      // indexOf is not performant for (very) large lists
      clickCallback(this.elements_playlistEntries.indexOf(element_entryContainer), element_entryContainer)
    })

    this.element_playlistContainer.appendChild(element_entryContainer)
  }

  scrollToCurrentTrack() {
    this.elements_playlistEntries[this.playlistIndex].scrollIntoView({
      block: "center"
    })
  }

  changeTrack(index: number) {
    // Find the first DOM element with a "selected" class name.
    let selectedElement = $(".selected")

    if (selectedElement != null) {
      // The current item is de-selected
      selectedElement.classList.remove("selected");
    }

    // Verify index is within the bounds of the avaliable playlist size.
    // This also ensures that the selection loops back to start.
    index %= this.track_playlist.length;
    this.playlistIndex = index
    this.element_playlistContainer.children[index].classList.add("selected");
    
    return this.track_playlist[index]
  }

  getNextTrack() {
    return this.changeTrack(this.playlistIndex + 1)
  }
  
  removeCurrentTrack() {
    this.removeTrackAtIndex(this.playlistIndex)
  }

  removeTrackAtIndex(index: number) {
    this.elements_playlistEntries[index].remove();
    this.elements_playlistEntries.splice(index, 1);
    this.track_playlist.splice(index, 1);
  }

  /**
   * Sets the index of the current playlist to 0.
   */
  resetIndex() {
    this.playlistIndex = 0;
  }

  get currentTrack() {
    return this.track_playlist[this.playlistIndex]
  }

  get currentTrackIndex() {
    return this.playlistIndex;
  }

  get trackCount() {
    return this.track_playlist.length;
  }

  get isAtEnd() {
    return this.playlistIndex == this.track_playlist.length - 1;
  }
}