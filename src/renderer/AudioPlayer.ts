import { $ } from './Helper';
import playSVG from './svg/play.svg';
import pauseSVG from './svg/pause.svg';
import { AudioPlayerPlaylist, Track } from './AudioPlayerPlaylist';

export class AudioPlayer {
  private element_playBtn = $("#play-btn") as HTMLElement
  private element_playBtn_img = this.element_playBtn.querySelector("img") as HTMLImageElement
  private element_nextBtn = $("#next-btn") as HTMLElement
  private element_currentEntryDisplay: HTMLElement = $("#playing") as HTMLElement
  // private element_thumbnail: HTMLElement = $("#playing") as HTMLElement

  private _audioPlayer = new Audio();
  private playlistManager = new AudioPlayerPlaylist();

  constructor() {
    // Prepare event listeners.
    this._audioPlayer.addEventListener("ended", () => this.audioPlayerOnEnd());
    this._audioPlayer.addEventListener("error", (e) => this.audioPlayerError(e));

    this.element_playBtn.addEventListener("click", () => this.togglePlay());
    this.element_nextBtn.addEventListener("click", () => this.chooseNextTrack())
  }

  // Add tracks to the DOM playlist.
  addTrack(track: Track) {
    // If this is the first item in the list, set it to be the selected track.
    if (this.playlistManager.trackCount === 0) {
      this.updateSongTitle(track);
    }

    this.playlistManager.addTrack(track, (index, element) => {
      this.changeTrack(index)
    })
  }

  removeCurrentTrack() {
    this.removeTrack(this.playlistManager.currentTrackIndex)
  }

  removeTrack(index: number) {
    this.playlistManager.removeTrackAtIndex(index)

    this.togglePlay(); // Pause audio playback
    this.changeTrack(index); // Update the DOM with the new track information
    this.togglePlay()
  }

  // Change the current song header.
  updateSongTitle(song: Track) {
    this.element_currentEntryDisplay.innerText = `${song.name}`;
  }

  // Changes the track to the specified index.
  changeTrack(index: number) {
    let track = this.playlistManager.changeTrack(index)

    this.updateSongTitle(track);

    if (this._audioPlayer.paused === false) {
      this.playTrack();
    }
  }

  // Starts playing the current track.
  playTrack() {
    let track = this.playlistManager.currentTrack;
    // Don't re-add the same source URL. Even if the source is identical, when it changes, the track commences at the begining.
    if (this._audioPlayer.src != track.url) this._audioPlayer.src = track.url;
    this._audioPlayer.play();
  }

  // Deals with playing next track after previous is finished.
  // Stops at end of playlist to prevent looping.
  // TODO: This (^) should be an option.
  // TODO: An option for enabling auto-play
  audioPlayerOnEnd() {
    // If the next track doesn't exist, pause the playback.
    if (this.playlistManager.isAtEnd) {
      this.togglePlay();
      this.playlistManager.resetIndex()
      return
    };

    this.chooseNextTrack();
  }

  chooseNextTrack() {
    if (!this._audioPlayer.paused) this.togglePlay()
    this.playlistManager.getNextTrack()
    this.updateSongTitle(this.playlistManager.currentTrack)
    this.playlistManager.scrollToCurrentTrack()
    this.togglePlay()
  }

  /**
   * Handler for toggling audio playback. If the state was paused, it will play; otherwise it will pause.
   */
  togglePlay() {
    // If there are no pending tracks, do nothing.
    if (this.playlistManager.trackCount === 0) {
      console.error("No tracks.")
      return;
    }

    this.element_playBtn_img.src = this._audioPlayer.paused ? pauseSVG : playSVG;
    if (this._audioPlayer.paused) {

      // Set the audio source to the current chosen song URL.
      this.playTrack();
    } else {
      this._audioPlayer.pause();
    }
  }

  /**
   * Callback for any errors raised by the internal AudioPlayer reference.
   * 
   * @param e Event from AudioPlayer. Not used.
   */
  audioPlayerError(e: any) {
    try {
      // Remove the current track
      this.removeCurrentTrack();
    } catch (e) {
      console.error("Something went wrong when removing a track entry.")
      console.error(e)
    }
  }
}

export var player_instance: AudioPlayer;

export function setup_player() {
  player_instance = new AudioPlayer()
}