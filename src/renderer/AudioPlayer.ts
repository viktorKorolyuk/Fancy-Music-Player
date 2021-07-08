import { $ } from './Helper'

let playlist: any[] = []
let playElement = $(".play")

export class AudioPlayer {
    audioPlayer = new Audio();
    playlistDOM = $(".playlist");
    MusicTitleText: string = "Now playing: ";
    playlistDOMArray: HTMLParagraphElement[] = [];
    currentSongIndex: number = 0;
    index: number = 0;

    // Add music to the DOM playlist
    addMusic(title_name: string) {

        // Add the new element to the playlist.
        let p = document.createElement("p");

        p.textContent = title_name;
        this.playlistDOM?.appendChild(p);

        if (this.playlistDOM?.children.length == 1) {
            p.className = "selected";
            this.updateSongTitle(title_name);
        }

        // Used for later removal.
        this.playlistDOMArray.push(p);
    }

    removeMusic(index: number = this.currentSongIndex) {
        this.playlistDOMArray[index].remove();
        this.playlistDOMArray.splice(index, 1);
        playlist.splice(index, 1);

        this.togglePlay();
        this.changeMusic(this.currentSongIndex);
        this.audioPlayer.play();
    }

    // Change the current song header.
    updateSongTitle(song: any) {
        ($(".playing") as HTMLElement).innerText = `${this.MusicTitleText}"${song.name || song}"`;
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
        index %= (this.playlistDOM as HTMLElement).children.length;

        if (this.playlistDOM?.children.length !== 0) {

            // Set the next item's class to "selected"
            (this.playlistDOM as HTMLElement).children[index].className = "selected";
            this.currentSongIndex = index;
            this.updateSongTitle(playlist[index]);

            if (this.audioPlayer.paused === false) {
                this.playMusic();
            }
        }
    }

    // Starts the music if it was not previously.
    playMusic() {
        // Don't re-add the same source URL. Even if the source is identical, when it changes, the music commences at the begining.
        if (this.audioPlayer.src != playlist[this.currentSongIndex].url) this.audioPlayer.src = playlist[this.currentSongIndex].url;
        this.audioPlayer.play();
    }

    // Deals with playing next track after previous is finished.
    // Stops at end of playlist to precent looping.
    // TODO: This (^) should be an option.
    audioPlayerOnEnd() {
        // If the next track doesn't exist, don't do anything.
        if (this.currentSongIndex + 1 >= playlist.length) {
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
        if (playlist.length === 0) return;
        if (playElement === null) return

        playElement.innerText = this.audioPlayer.paused ? "Pause" : "Play";
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

}

export const player = new AudioPlayer();

/*
 * Setting up event listeners.
 */

player.audioPlayer.addEventListener("ended", player.audioPlayerOnEnd);
player.audioPlayer.addEventListener("error", player.audioPlayerError);

// (window as any).$(".stepBack").addEventListener("click", player.chooseNextTrack);

if(playElement) {
    playElement.addEventListener("click", () => player.togglePlay());

}