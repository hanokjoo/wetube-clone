const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
    video.srcObject = stream;
    video.play();
};

const handleStartRecording = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStartRecording);
    startBtn.addEventListener("click", handleStopRecording);

    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        console.log("recording done");
        console.log(e);
        console.log(e.data);
    };
    console.log(recorder);
    recorder.start();
    setTimeout(() => {
        recorder.stop();
    }, 5000);
};
const handleStopRecording = () => {
    startBtn.innerText = "Start Recording";
    startBtn.removeEventListener("click", handleStopRecording);
    startBtn.addEventListener("click", handleStartRecording);
};

init();
startBtn.addEventListener("click", handleStartRecording);
