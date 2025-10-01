import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Editor from "./Editor.jsx";
export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFile] = useState("");
  const [redirect, setRedirect] = useState(false);
  async function createNewPost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files);
    console.log({ title, summary, content, files });
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  async function handlePhoto(ev) {
    const file = ev.target.files[0];
    if (!file) return;
    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", `${import.meta.env.VITE_my_upload_preset}`);
    data.append("cloud_name", `${import.meta.env.VITE_my_upload_preset}`);
    const response = await fetch(
      " https://api.cloudinary.com/v1_1/djhvdnjpz/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const uploadedImageURL = await response.json();
    setFile(uploadedImageURL["url"]);
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form onSubmit={createNewPost}>
      <input
        type="title"
        placeholder="Title"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
      />
      <input type="file" onChange={handlePhoto} />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: "5px" }}>Create Post</button>
    </form>
  );
}
