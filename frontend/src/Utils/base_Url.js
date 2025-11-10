export const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://blog-evtq.onrender.com";
