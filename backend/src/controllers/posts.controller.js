const Post = require("../models/Post.js");
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

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
});

exports.updatePost = asyncHandler(async (req, res) => {
  const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

exports.deletePost = asyncHandler(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});

exports.addComment = asyncHandler(async (req, res) => {
  const { author, content } = req.body;
  if (!author || !content) {
    return res.status(400).json({ error: "Name and comment content are required" });
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  post.comments.push({ author, content });
  await post.save();
  res.status(201).json(post.comments[post.comments.length - 1]);
});

exports.likeComment = asyncHandler(async (req, res) => {
  const { id: postId, commentId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  const comment = post.comments.id(commentId);
  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }
  comment.likes = (comment.likes || 0) + 1;
  await post.save();
  res.json(comment);
});

exports.replyComment = asyncHandler(async (req, res) => {
  const { id: postId, commentId } = req.params;
  const { content, author } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Reply content is required" });
  }
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  const comment = post.comments.id(commentId);
  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }
  comment.replies.push({
    author: author || "Author",
    content
  });
  await post.save();
  res.status(201).json(comment.replies[comment.replies.length - 1]);
});

exports.likeReply = asyncHandler(async (req, res) => {
  const { id: postId, commentId, replyId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  const comment = post.comments.id(commentId);
  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }
  const reply = comment.replies.id(replyId);
  if (!reply) {
    return res.status(404).json({ error: "Reply not found" });
  }
  reply.likes = (reply.likes || 0) + 1;
  await post.save();
  res.json(reply);
});