import { $ } from './Helper';
import playSVG from './svg/play.svg';
import pauseSVG from './svg/pause.svg';

interface MusicEntry {
    name: string,
    url: string
}
export class AudioPlayer {
    private element_playBtn = $("#play-btn") as HTMLElement
    private element_playBtn_img = this.element_playBtn.querySelector("img") as HTMLImageElement
    private element_nextBtn = $("#next-btn") as HTMLElement
    private element_playlistContainer = $("#playlist") as HTMLElement;
    private element_currentEntryDisplay: HTMLElement = $("#playing") as HTMLElement

    private musicEntries_playlist: MusicEntry[] = []
    private elements_playlistEntries: HTMLParagraphElement[] = [];

    private _audioPlayer = new Audio();

    private currentSongIndex: number = 0;
    constructor() {
        // Prepare event listeners.
        this.audioPlayer.addEventListener("ended", this.audioPlayerOnEnd);
        this.audioPlayer.addEventListener("error", this.audioPlayerError);

        this.element_playBtn.addEventListener("click", () => this.togglePlay());
        this.element_nextBtn.addEventListener("click", () => this.chooseNextTrack())
    }

    // Add music to the DOM playlist
    addMusic(musicEntry: MusicEntry) {

        // Add the new element to the playlist.
        let element_entryContainer = document.createElement("div")
        element_entryContainer.classList.add("musicEntry")

        let element_p = document.createElement("p");

        element_p.textContent = musicEntry.name;
        element_entryContainer.appendChild(element_p)

        // If this is the first item in the list, set it to be the selected music entry.
        if (this.elements_playlistEntries.length == 0) {
            element_entryContainer.classList.add("selected");
            this.updateSongTitle(musicEntry);
        }

        // Store the element reference and the music entry in memory for later removal.
        this.elements_playlistEntries.push(element_entryContainer);
        this.musicEntries_playlist.push(musicEntry)

    }

    removeMusic(index: number = this.currentSongIndex) {
        this.elements_playlistEntries[index].remove();
        this.elements_playlistEntries.splice(index, 1);
        this.musicEntries_playlist.splice(index, 1);

        this.togglePlay();
        this.changeMusic(this.currentSongIndex);
        this.audioPlayer.play();
    }

    // Change the current song header.
    updateSongTitle(song: MusicEntry) {
        this.element_currentEntryDisplay.innerText = `${song.name}`;
    }

    // Changes the music to the specified index.
    changeMusic(index: number) {
        // Find the first DOM element with a "selected" class name.
        let selectedElement = $(".selected")

        if (selectedElement != null) {
            // The current item is de-selected
            selectedElement.classList.remove("selected");
        }

        // Verify index is within the bounds of the avaliable playlist size.
        // This also ensures that the selection loops back to start.
        index %= this.elements_playlistEntries.length;

        if (this.elements_playlistEntries.length !== 0) {

            // Set the next item's class to "selected"
            this.element_playlistContainer.children[index].classList.add("selected");
            this.currentSongIndex = index;
            this.updateSongTitle(this.musicEntries_playlist[index]);

            if (this.audioPlayer.paused === false) {
                this.playMusic();
            }
        }
    }

    // Starts the music if it was not previously.
    playMusic() {
        // Don't re-add the same source URL. Even if the source is identical, when it changes, the music commences at the begining.
        if (this.audioPlayer.src != this.musicEntries_playlist[this.currentSongIndex].url) this.audioPlayer.src = this.musicEntries_playlist[this.currentSongIndex].url;
        this.audioPlayer.play();
    }

    // Deals with playing next track after previous is finished.
    // Stops at end of playlist to prevent looping.
    // TODO: This (^) should be an option.
    audioPlayerOnEnd() {
        // If the next track doesn't exist, pause the playback.
        if (this.currentSongIndex + 1 >= this.musicEntries_playlist.length) {
            this.togglePlay();
        };

        this.changeMusic(this.currentSongIndex + 1);

        // Music is now paused. Let's play
        this.playMusic();
    }

    chooseNextTrack() {
        this.changeMusic(this.currentSongIndex + 1);
    }

    /**
     * Handler for toggling audio playback. If the state was paused, it will play; otherwise it will pause.
     */
    togglePlay() {
        // If there is no pending music, do nothing.
        if (this.musicEntries_playlist.length === 0) {
            console.error("No music.")
            return;
        }

        this.element_playBtn_img.src = this.audioPlayer.paused ? pauseSVG : playSVG;
        if (this.audioPlayer.paused) {

            // Set the audio source to the current chosen song URL.
            this.playMusic();
        } else {
            this.audioPlayer.pause();
        }
    }

    /**
     * Callback for any errors raised by the internal AudioPlayer reference.
     * 
     * @param e Event from AudioPlayer. Not used.
     */
    audioPlayerError(e: any) {
        try {
            this.removeMusic();
        } catch (e) {
            console.error("Something went wrong when removing a music entry.")
            console.error(e)
        }
    }

    public get audioPlayer() {
        return this._audioPlayer;
    }

}

export var player_instance: AudioPlayer;

export function setup_player() {
    player_instance = new AudioPlayer()
}