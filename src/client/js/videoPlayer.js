const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
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
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted
        ? "fas fa-volume-mute"
        : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
    video.volume = volumeRange.value;
};

const handleChangeVolumeRange = (e) => {
    const {
        target: { value },
    } = e;
    if (Number(value) === 0) {
        video.muted = true;
        muteBtnIcon.classList = "fas fa-volume-mute";
    } else volumeValue = value;
};

const handleInputVolumeRange = (e) => {
    const {
        target: { value },
    } = e;
    if (video.muted) {
        video.muted = false;
    }
    muteBtnIcon.classList = video.muted
        ? "fas fa-volume-mute"
        : "fas fa-volume-up";
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
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
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

const handleKeyUp = (e) => {
    switch (e.code) {
        case "Space":
            handlePlayClick();
            e.preventDefault();
            break;
        case "KeyM":
            handleMuteClick();
            break;
        case "Enter":
            handleFullscreen();
            break;
        case "ArrowLeft":
            video.currentTime -= 5;
            break;
        case "ArrowRight":
            video.currentTime += 5;
            break;
    }
    handleMouseMove();
};

const handlePlayEnded = () => {
    video.currentTime = 0;
    video.pause();
    playBtnIcon.classList = "fas fa-play";
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleInputVolumeRange);
volumeRange.addEventListener("change", handleChangeVolumeRange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handlePlayClick);
video.addEventListener("ended", handlePlayEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
timeline.addEventListener("input", handleTimelineChange);
timeline.addEventListener("mousedown", handleTimelineMouseDown);
timeline.addEventListener("mouseup", handleTimelineMouseUp);
fullScreenBtn.addEventListener("click", handleFullscreen);
document.addEventListener("keyup", handleKeyUp);
