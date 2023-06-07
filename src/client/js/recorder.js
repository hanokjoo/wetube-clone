const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream, recorder;

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

    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
        // 녹화한 영상파일(브라우저의 메모리)을 가르키는 URL, 서버엔 없음
        const videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    };
    recorder.start();
};
const handleStopRecording = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStopRecording);
    startBtn.addEventListener("click", handleDownload);
    recorder.stop();
};
const handleDownload = () => {};

init();
startBtn.addEventListener("click", handleStartRecording);
