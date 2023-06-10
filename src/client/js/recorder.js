import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream, recorder, videoFile;

const init = async () => {
    startBtn.innerText = "Start Recording";
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
const handleDownload = async () => {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
    await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4"); // recording.webm -> output.mp4(초당 60프레임)로 변환
    await ffmpeg.run(
        "-i",
        "recording.webm",
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        "thumbnail.jpg"
    );

    const mp4File = ffmpeg.FS("readFile", "output.mp4");
    const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");
    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    const a = document.createElement("a");
    a.href = mp4Url;
    a.download = "MyRecording.mp4";
    document.body.appendChild(a);
    a.click();

    const thumbA = document.createElement("a");
    thumbA.href = thumbUrl;
    thumbA.download = "MyThumbnail.jpg";
    document.body.appendChild(thumbA);
    thumbA.click();

    video.pause();
    video.src = "";
    document.body.removeChild(a);
    stream.removeTrack(stream.getTracks()[0]);
    init();
};

init();
startBtn.addEventListener("click", handleStartRecording);
