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

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/upload", formData);
  return res.data.url;
};

export const replyToComment = async (postId, commentId, replyContent) => {
  const res = await api.post(`/posts/${postId}/comments/${commentId}/replies`, {
    content: replyContent,
    author: "Author"
  });
  return res.data;
};

export const getReadingItems = async () => {
  const res = await api.get("/reading");
  return res.data;
};

export const createOrUpdateReadingItem = async (readingData) => {
  const res = await api.post("/reading", readingData);
  return res.data;
};

export const deleteReadingItem = async (id) => {
  const res = await api.delete(`/reading/${id}`);
  return res.data;
};