const Post = require("../models/Post.model");
const asyncHandler = require("../utils/asyncHandler");

exports.createPost = asyncHandler(async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.status(201).json(post);
});

exports.getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

exports.updatePost = asyncHandler(async (req, res) => {
  const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

exports.deletePost = asyncHandler(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});