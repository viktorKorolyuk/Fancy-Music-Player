import { $ } from './Helper';
import playSVG from './svg/play.svg';
import pauseSVG from './svg/pause.svg';
import { AudioPlayerPlaylist, Track } from './AudioPlayerPlaylist';

export class AudioPlayer {
  private element_playBtn = $("#play-btn") as HTMLElement
  private element_nextBtn = $("#next-btn") as HTMLElement
  private element_prevBtn = $("#prev-btn") as HTMLElement
  private element_playBtn_img = this.element_playBtn.querySelector("img") as HTMLImageElement
  private element_currentEntryDisplay: HTMLElement = $("#playing") as HTMLElement
  // private element_thumbnail: HTMLElement = $("#playing") as HTMLElement

  private _audioPlayer = new Audio();
  private playlistManager = new AudioPlayerPlaylist();

  constructor() {
    // Prepare event listeners.
    this._audioPlayer.addEventListener("ended", () => this.audioPlayerOnEnd());
    this._audioPlayer.addEventListener("error", (e) => this.audioPlayerError(e));

    this.element_playBtn.addEventListener("click", () => this.togglePlay());
    this.element_nextBtn.addEventListener("click", () => this.gotoNextTrack());
    this.element_prevBtn.addEventListener("click", () => this.gotoPreviousTrack());
  }

  // Add tracks to the DOM playlist.
  addTrack(track: Track) {
    // If this is the first item in the list, set it to be the selected track.
    if (this.playlistManager.trackCount === 0) {
      this.updateTrackTitle(track);
    }

    this.playlistManager.addTrack(track, (index, element) => {
      this.changeTrackToIndex(index)
    })
  }

  removeCurrentTrack() {
    this.removeTrack(this.playlistManager.currentTrackIndex)
  }

  removeTrack(index: number) {
    this.playlistManager.removeTrackAtIndex(index)

    this.togglePlay(); // Pause audio playback
    this.changeTrackToIndex(index); // Update the DOM with the new track information
    this.togglePlay()
  }

  // Change the current song header.
  updateTrackTitle(song: Track) {
    this.element_currentEntryDisplay.innerText = `${song.name}`;
  }

  // Changes the track to the specified index.
  changeTrackToIndex(index: number) {
    let track = this.playlistManager.changeTrack(index)
    if (track == undefined) return; // If there are no tracks available, do nothing

    this.updateTrackTitle(track);

    if (this.isPlaying) {
      this.playCurrentTrack();
    }
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

    this.gotoNextTrack();
  }

  updateTrack() {
    this.updateTrackTitle(this.playlistManager.currentTrack)
    this.playlistManager.scrollToCurrentTrack()
  }

  gotoPreviousTrack() {
    AudioPlayer.pauseActRestore(() => {
      this.playlistManager.getPreviousTrack()
      this.updateTrack()
    }, this)
  }

  gotoNextTrack() {
    AudioPlayer.pauseActRestore(() => {
      this.playlistManager.getNextTrack()
      this.updateTrack()
    }, this)
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

    this.element_playBtn_img.src = this.isPlaying ? playSVG : pauseSVG;

    if (this.isPlaying) {
      this._audioPlayer.pause();
    } else {
      this.playCurrentTrack();
    }
  }

  // Starts playing the current track.
  playCurrentTrack() {
    let track = this.playlistManager.currentTrack;
    // Don't re-add the same source URL. Even if the source is identical. When the source changes the track commences at the begining.
    if (this._audioPlayer.src != track.url) this._audioPlayer.src = track.url;
    this._audioPlayer.play();
  }

  /**
   * Callback for any errors raised by the internal AudioPlayer reference.
   * 
   * @param error Event from AudioPlayer. Not used.
   */
  audioPlayerError(error: any) {
    try {
      // Remove the current track
      this.removeCurrentTrack();
    } catch (e) {
      console.error("Something went wrong when removing a track entry.")
      console.error(e)
    }
  }

  get isPlaying() {
    return this._audioPlayer.paused === false;
  }

  /**
   * Intent-based wrapper for actions involving audio tracks.
   * Use this method to perform tasks requiring audio-element play state to be paused and restored.
   * Cases:
   *  If the player was playing, pause and execute the callback. Resume playback after the callback.
   *  Otherwise, if the player was paused, execute the callback and keep the player paused.
   * 
   * @param callback Action to perform when the audio element is ready.
   * @param context AudioPlayer context to perform the action on.
   */
  static pauseActRestore(callback: () => void, context: AudioPlayer) {
    let was_playing = context.isPlaying
    if (was_playing) context.togglePlay()

    callback()
    if (was_playing) context.togglePlay()
  }
}

export var player_instance: AudioPlayer;

export function setup_player() {
  player_instance = new AudioPlayer()
}