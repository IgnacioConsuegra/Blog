import ReactQuill from "react-quill";
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];
export default function Editor({ value, onChange }) {
  const parentSpan = document.querySelector("span.ql-formats");

  if (parentSpan) {
    parentSpan.classList.add("card-title");

    const firstChildSpan = parentSpan.querySelector("span");
    if (firstChildSpan) {
      firstChildSpan.style.color = "currentColor";
    }
  }

  return (
    <ReactQuill
      value={value}
      theme={"snow"}
      onChange={onChange}
      modules={modules}
      formats={formats}
    ></ReactQuill>
  );
}
