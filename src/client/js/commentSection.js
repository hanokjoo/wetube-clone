const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (e) => {
    e.preventDefault();
    const textarea = form.querySelector("textarea");
    const btn = form.querySelector("button");
    const text = textarea.value;
    const videoId = videoContainer.dataset.videoid;
    if (text.trim() === "") return;
    fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    textarea.value = "";
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}
