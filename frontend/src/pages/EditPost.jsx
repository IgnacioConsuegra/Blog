import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { DeletePostModel } from "../components/DeletePostModel.jsx";
import Editor from "../Editor";
import handlePhoto from "../Utils/handlePhoto.js";
import toast from "react-hot-toast";
export function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFile] = useState("");
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();
  const [showPopUp, setShowPopUp] = useState(false);
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
      toast.success("Post Edited correctly");

      setRedirect(true);
    }
  }
  const handleDelete = async () => {
    const response = await fetch("http://localhost:4000/deletePost/" + id, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      toast.success("Post deleted correctly");
      navigate("/");
    } else {
      toast.error("An error happen, try later.");
    }
  };
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
    <>
      <form onSubmit={updatePost}>
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
          className="input hover:cursor-pointer"
        />
        <Editor onChange={setContent} value={content} />
        <button className="btn">Update post</button>
        
      </form>
      <button
          className="btn btn-secondary mt-3 md:mt-4 lg:mt-5"
          onClick={() => setShowPopUp(true)}
        >
          Delete post
        </button>
      {showPopUp && <DeletePostModel onConfirm={handleDelete} onCancel={() => setShowPopUp(false)}/>}
    </>
  );
}
