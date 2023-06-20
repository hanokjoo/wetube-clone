const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = async (e) => {
    e.preventDefault();
    const textarea = form.querySelector("textarea");
    const btn = form.querySelector("button");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text.trim() === "") return;
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    if (response.status === 201) {
        textarea.value = "";
        const { newCommentId, author } = await response.json();
        addComment(text, newCommentId, author);
    }
};
const addComment = (text, id, author) => {
    const videoComments = document.querySelector(".video__comments ul");
    const div = document.createElement("div");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.className = "video__comment-author";
    span.innerText = `${author}`;
    const span2 = document.createElement("span");
    span2.innerText = ` ${text}`;
    const span3 = document.createElement("span");
    span3.className = "video__comment-delete";
    span3.innerText = "❌";
    div.appendChild(icon);
    div.appendChild(span);
    div.appendChild(span2);
    newComment.appendChild(div);
    newComment.appendChild(span3);
    videoComments.prepend(newComment);
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}
