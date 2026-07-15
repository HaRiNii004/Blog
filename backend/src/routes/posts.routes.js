const express = require("express");
const { createPost, getPosts, getPostById, updatePost, deletePost, addComment, likeComment, replyComment, likeReply } = require("../controllers/posts.controller.js");

const router = express.Router();

router.post("/", createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.post("/:id/comments", addComment);
router.post("/:id/comments/:commentId/like", likeComment);
router.post("/:id/comments/:commentId/replies", replyComment);
router.post("/:id/comments/:commentId/replies/:replyId/like", likeReply);

module.exports = router;