// src/api/posts.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({ baseURL: API_URL });

export const createPost = (postData) => api.post("/posts", postData);

export const getPostById = async (id) => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
};

export const updatePost = async (id, postData) => {
  const res = await api.put(`/posts/${id}`, postData);
  return res.data;
};

export const deletePost = async (id) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

// TODO: replace this once the backend upload route exists.
// For now it just fakes a delay and returns a local blob URL so you can
// keep building the UI without the backend being ready.
export const uploadImage = async (file) => {
  // Real version (once backend exists) will look like:
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/upload", formData);
  return res.data.url;

};