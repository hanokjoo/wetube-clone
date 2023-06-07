const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream, recorder, videoFile;

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

    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (event) => {
        // 녹화한 영상파일(브라우저의 메모리)을 가르키는 URL, 서버엔 없음
        videoFile = URL.createObjectURL(event.data);
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
const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "MyRecording.webm";
    document.body.appendChild(a);
    a.click();
};

init();
startBtn.addEventListener("click", handleStartRecording);
