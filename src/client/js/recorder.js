import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream, recorder, videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
};

const init = async () => {
    actionBtn.innerText = "Start Recording";
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
    video.srcObject = stream;
    video.play();
};

const handleStartRecording = () => {
    actionBtn.innerText = "Stop Recording";
    actionBtn.removeEventListener("click", handleStartRecording);
    actionBtn.addEventListener("click", handleStopRecording);

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
    actionBtn.innerText = "Download Recording";
    actionBtn.removeEventListener("click", handleStopRecording);
    actionBtn.addEventListener("click", handleDownload);
    recorder.stop();
};
const handleDownload = async () => {
    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.innerText = "Transcoding...";
    actionBtn.disabled = true;

    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
    await ffmpeg.run("-i", files.input, "-r", "60", files.output); // files.input -> files.output(초당 60프레임)로 변환
    await ffmpeg.run(
        "-i",
        files.input,
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        files.thumb
    );

    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbFile = ffmpeg.FS("readFile", files.thumb);

    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url, "MyRecording.mp4");
    downloadFile(thumbUrl, "MyThumbnail.jpg");

    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    /*
    video.pause();
    video.src = "";
    document.body.removeChild(a);
    document.body.removeChild(thumbA);
    stream.removeTrack(stream.getTracks()[0]);
    */

    actionBtn.disabled = false;
    init();
    actionBtn.innerText = "Record Again";
    actionBtn.addEventListener("click", handleStartRecording);
};

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
};

init();
actionBtn.addEventListener("click", handleStartRecording);
