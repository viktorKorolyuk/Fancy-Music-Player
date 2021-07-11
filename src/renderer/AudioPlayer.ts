import { $ } from './Helper';

interface MusicEntry {
    name: string,
    url: string
}
export class AudioPlayer {
    public element_playBtn = $("#play-btn") as HTMLElement
    private playlist: MusicEntry[] = []

    private _audioPlayer = new Audio();

    private element_playlistContainer = $(".playlist") as HTMLElement;
    private elements_playlistEntries: HTMLParagraphElement[] = [];

    private element_currentEntryDisplay: HTMLElement = $(".playing") as HTMLElement
    private template_currentEntryDisplay: string = "Now playing: ";

    private currentSongIndex: number = 0;
    constructor() {
        // Prepare event listeners
        this.audioPlayer.addEventListener("ended", this.audioPlayerOnEnd);
        this.audioPlayer.addEventListener("error", this.audioPlayerError);

        // (window as any).$(".stepBack").addEventListener("click", player.chooseNextTrack);
        this.element_playBtn.addEventListener("click", () => this.togglePlay());
    }

    // Add music to the DOM playlist
    addMusic(musicEntry: MusicEntry) {

        // Add the new element to the playlist.
        let p = document.createElement("p");

        p.textContent = musicEntry.name;
        this.element_playlistContainer.appendChild(p);
        console.log(this.element_playlistContainer)

        if (this.element_playlistContainer.children.length == 1) {
            p.className = "selected";
            this.updateSongTitle(musicEntry.name);
        }

        // Used for later removal.
        this.elements_playlistEntries.push(p);
        this.playlist.push(musicEntry)

        console.log("Added new music to list.");
    }

    removeMusic(index: number = this.currentSongIndex) {
        this.elements_playlistEntries[index].remove();
        this.elements_playlistEntries.splice(index, 1);
        this.playlist.splice(index, 1);

        this.togglePlay();
        this.changeMusic(this.currentSongIndex);
        this.audioPlayer.play();
    }

    // Change the current song header.
    updateSongTitle(song: any) {
        this.element_currentEntryDisplay.innerText = `${this.template_currentEntryDisplay}"${song.name || song}"`;
    }

    // Changes the music to the specified index.
    changeMusic(index: number) {
        // Find the first DOM element with a "selected" class name.
        let selectedElement = $(".selected")

        if (selectedElement != null) {

            // The current item is de-selected
            selectedElement.className = "";
        }

        // Verify index is within the bounds of the avaliable playlist size.
        // This also ensures that the selection loops back to start.
        index %= this.element_playlistContainer.children.length;

        if (this.element_playlistContainer.children.length !== 0) {

            // Set the next item's class to "selected"
            this.element_playlistContainer.children[index].className = "selected";
            this.currentSongIndex = index;
            this.updateSongTitle(this.playlist[index]);

            if (this.audioPlayer.paused === false) {
                this.playMusic();
            }
        }
    }

    // Starts the music if it was not previously.
    playMusic() {
        // Don't re-add the same source URL. Even if the source is identical, when it changes, the music commences at the begining.
        if (this.audioPlayer.src != this.playlist[this.currentSongIndex].url) this.audioPlayer.src = this.playlist[this.currentSongIndex].url;
        this.audioPlayer.play();
    }

    // Deals with playing next track after previous is finished.
    // Stops at end of playlist to precent looping.
    // TODO: This (^) should be an option.
    audioPlayerOnEnd() {
        // If the next track doesn't exist, don't do anything.
        if (this.currentSongIndex + 1 >= this.playlist.length) {
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
     * The "Play" button */
    togglePlay() {
        // If no music exists, don't do anything.
        if (this.playlist.length === 0) {
            console.error("No music.")
            return;
        }

        this.element_playBtn.innerText = this.audioPlayer.paused ? "Pause" : "Play";
        if (this.audioPlayer.paused) {

            // Set the audio source to the current chosen song URL.
            this.playMusic();
        } else {
            this.audioPlayer.pause();
        }
    }

    audioPlayerError(e: any) {
        this.removeMusic();
    }

    public get audioPlayer() {
        return this._audioPlayer;
    }

}

export var player_instance: AudioPlayer;

export function setup_player() {
    player_instance = new AudioPlayer()
}