import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const createPost = async (postData) => {
  const res = await axios.post(`${API_URL}/posts`, postData);
  return res.data;
};

export const fetchPosts = async () => {
  const res = await axios.get(`${API_URL}/posts`);
  return res.data;
};