import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Editor from "./Editor.jsx";
import handlePhoto from "./Utils/handlePhoto.js";
import {toast} from "react-hot-toast"
export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFile] = useState("");
  const [redirect, setRedirect] = useState(false);
  async function createNewPost(ev) {
        ev.preventDefault();

    if(files === "uploading"){
      toast.error("Photo is uploading");
      return
    }
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files);
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
      toast.success("Post created successfully");

    }
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
        className="input"
      />
      <input
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
        className="input"
      />
      <input
        type="file"
        onChange={ev => handlePhoto(ev, setFile)}
        className="input"
      />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: "5px" }} className="btn">
        Create Post
      </button>
    </form>
  );
}
