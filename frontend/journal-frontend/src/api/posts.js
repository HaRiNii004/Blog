// src/api/posts.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({ baseURL: API_URL });

export const createPost = (postData) => api.post("/api/posts", postData);

// TODO: replace this once the backend upload route exists.
// For now it just fakes a delay and returns a local blob URL so you can
// keep building the UI without the backend being ready.
export const uploadImage = async (file) => {
  // Real version (once backend exists) will look like:
  // const formData = new FormData();
  // formData.append("image", file);
  // const res = await api.post("/api/upload", formData);
  // return res.data.url;

  await new Promise((r) => setTimeout(r, 300));
  return URL.createObjectURL(file);
};