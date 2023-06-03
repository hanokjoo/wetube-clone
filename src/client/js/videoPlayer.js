const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumeValue = 0.5;
video.volume = volumeValue;
let videoPlayStatus = true;
let controlsTimeout = null;

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
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (e) => {
    const {
        target: { value },
    } = e;
    video.currentTime = value;
};

const handleTimelineMouseDown = (e) => {
    videoPlayStatus = !video.paused;
    video.pause();
};
const handleTimelineMouseUp = () => {
    if (videoPlayStatus) video.play();
};

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        document.exitFullscreen();
        fullScreenBtn.innerText = "Enter Full Screen";
    } else {
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText = "Exit Full Screen";
    }
};

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsTimeout = setTimeout(
        () => videoControls.classList.remove("showing"),
        3000
    );
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleInputVolumeRange);
volumeRange.addEventListener("change", handleChangeVolumeRange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("mousemove", handleMouseMove);
timeline.addEventListener("input", handleTimelineChange);
timeline.addEventListener("mousedown", handleTimelineMouseDown);
timeline.addEventListener("mouseup", handleTimelineMouseUp);
fullScreenBtn.addEventListener("click", handleFullscreen);
