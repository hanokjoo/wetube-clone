const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
    video.volume = volumeRange.value;
};

const handleChangeVolumeRange = (e) => {
    const {
        target: { value },
    } = e;
    if (Number(value) === 0) {
        video.muted = true;
        muteBtn.innerText = "Unmute";
    } else volumeValue = value;
};

const handleInputVolumeRange = (e) => {
    const {
        target: { value },
    } = e;
    if (video.muted) {
        video.muted = false;
    }
    muteBtn.innerText = video.muted ? "Unmuted" : "Mute";
    video.volume = value;
};

const formatTime = (seconds) => {
    let startIdx = 11;
    if (seconds < 60) startIdx = 15;
    else if (seconds >= 60 && seconds < 3600) startIdx = 14;
    return new Date(seconds * 1000).toISOString().substring(startIdx, 19);
};

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
};

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleInputVolumeRange);
volumeRange.addEventListener("change", handleChangeVolumeRange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
