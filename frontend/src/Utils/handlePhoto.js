export default async function handlePhoto(ev, handler) {
  handler("uploading");
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
  handler(uploadedImageURL["url"]);
}
