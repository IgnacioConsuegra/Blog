import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFile] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files.length) {
      data.set("file", files);
    }
    const response = await fetch("http://localhost:4000/post", {
      method: "PUT",
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
  useEffect(() => {
    fetch("http://localhost:4000/post/" + id).then(response => {
      response.json().then(postInfo => {
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
      });
    });
  }, []);

  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }
  return (
    <form onSubmit={updatePost}>
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
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "5px" }}>Update Post</button>
    </form>
  );
}
