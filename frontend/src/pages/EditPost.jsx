import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import handlePhoto from "../Utils/handlePhoto.js"

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
    const response = await fetch("https://deploy-umyx.onrender.com/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  }
  
  useEffect(() => {
    fetch("https://deploy-umyx.onrender.com/post/" + id).then(response => {
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
      <input type="file" onChange={ev => handlePhoto(ev, setFile)} />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "5px" }}>Update Post</button>
    </form>
  );
}
