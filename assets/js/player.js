const audioPlayer = new Audio();
const playlistDOM = $(".playlist");
const playlistDOMArray = [];
const MusicTitleText = "⫸ Now playing: ";

var currentSongIndex = 0;


// Add music to the DOM playlist
function addMusic(title_name) {

    // Add the new element to the playlist.
    let p = document.createElement("p");

    p.textContent = title_name;
    playlistDOM.appendChild(p);
    if (playlistDOM.children.length == 1) {
        p.className = "selected";
        updateSongTitle(title_name);
        index = 0;
    }

    // Used for later removal.
    playlistDOMArray.push(p);
}

function removeMusic(index = currentSongIndex) {
    playlistDOMArray[index].remove();
    playlistDOMArray.splice(index, 1);
    playlist.splice(index, 1);

    togglePlay();
    changeMusic(currentSongIndex);
    audioPlayer.play();
}

// Change the current song header.
function updateSongTitle(song) {
    $(".playing").innerText = `${MusicTitleText}"${song.name || song}"`;
}

// Changes the music to the specified index.
function changeMusic(index) {

    // Find the first DOM element with a "selected" class name.
    if ($(".selected")) {
        // The current item is de-selected
        $(".selected").className = "";
    }

    // Verify index is within the bounds of the avaliable playlist size.
    // This also ensures that the selection loops back to start.
    index %= playlistDOM.children.length;

    if (playlistDOM.children.length !== 0) {

        // Set the next item's class to "selected"
        playlistDOM.children[index].className = "selected";
        currentSongIndex = index;
        updateSongTitle(playlist[index]);
        if (!audioPlayer.paused) {
            playMusic();
        }
    }
}

// Starts the music if it was not previously.
function playMusic() {


    // Don't re-add the same source URL. Even if the source is identical, when it changes, the music commences at the begining.
    if (audioPlayer.src != playlist[currentSongIndex].url) audioPlayer.src = playlist[currentSongIndex].url;
    audioPlayer.play();
}

// Deals with playing next track after previous is finished.
// Stops at end of playlist to precent looping.
// TODO: This (^) should be an option.
function audioPlayerOnEnd() {
    // If the next track doesn't exist, don't do anything.
    if (currentSongIndex + 1 >= playlist.length) return;
    changeMusic(currentSongIndex + 1);
    // Music is now paused. Le'ts play
    playMusic();
}

function chooseNextTrack() {
    changeMusic(currentSongIndex + 1);
}

function togglePlay() {
    // If no music exists, don't do anything.
    if (playlist.length === 0) return;

    $(".play").innerText = audioPlayer.paused ? "Pause" : "Play";
    if (audioPlayer.paused) {

        // Set the audio source to the current chosen song URL.
        playMusic();
    } else {
        audioPlayer.pause();
    }
}

function audioPlayerError(e) {
    // alert("Can't play media");
    removeMusic();
}

/*
 * Setting up event listeners.
 */

audioPlayer.addEventListener("ended", audioPlayerOnEnd);

audioPlayer.addEventListener("error", audioPlayerError);

$(".next").addEventListener("click", chooseNextTrack);

$(".play").addEventListener("click", togglePlay);