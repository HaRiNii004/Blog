import axios from "axios";

const API_URL = "http://localhost:5000/api/posts";

// Create Post
export const createPost = async (postData) => {
  try {
    const response = await axios.post(API_URL, postData);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};