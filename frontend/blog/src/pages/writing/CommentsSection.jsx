import React, { useState } from "react";

const CommentsSection = ({ postId, comments, onRefreshPost, API_URL }) => {
  // New comments state
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");

  // Nested replies state
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyError, setReplyError] = useState("");

  // Session-based likes tracker
  const [likedComments, setLikedComments] = useState({});
  const [likedReplies, setLikedReplies] = useState({});

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentContent.trim()) {
      setCommentError("Both name and comment text are required.");
      return;
    }

    const name = commentAuthor.trim();
    if (name.toLowerCase() === "author" || name.toLowerCase() === "admin") {
      setCommentError("The name 'Author' or 'Admin' is reserved.");
      return;
    }

    setCommentSubmitting(true);
    setCommentError("");

    fetch(`${API_URL}/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: name, content: commentContent }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Comment submission failed.");
        return res.json();
      })
      .then(() => {
        setCommentContent("");
        setCommentAuthor("");
        onRefreshPost();
      })
      .catch((err) => {
        console.error(err);
        setCommentError("Could not post comment. Please try again.");
      })
      .finally(() => setCommentSubmitting(false));
  };

  const handleReplySubmit = (e, commentId) => {
    e.preventDefault();
    if (!replyAuthor.trim() || !replyContent.trim()) {
      setReplyError("Both name and reply text are required.");
      return;
    }

    const name = replyAuthor.trim();
    if (name.toLowerCase() === "author" || name.toLowerCase() === "admin") {
      setReplyError("The name 'Author' or 'Admin' is reserved.");
      return;
    }

    setReplySubmitting(true);
    setReplyError("");

    fetch(`${API_URL}/api/posts/${postId}/comments/${commentId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: name, content: replyContent }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Reply submission failed.");
        return res.json();
      })
      .then(() => {
        setReplyContent("");
        setReplyAuthor("");
        setActiveReplyCommentId(null);
        onRefreshPost();
      })
      .catch((err) => {
        console.error(err);
        setReplyError("Could not post reply. Please try again.");
      })
      .finally(() => setReplySubmitting(false));
  };

  const handleLikeComment = (commentId) => {
    if (likedComments[commentId]) return;
    fetch(`${API_URL}/api/posts/${postId}/comments/${commentId}/like`, { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to like comment");
        setLikedComments((prev) => ({ ...prev, [commentId]: true }));
        onRefreshPost();
      })
      .catch((err) => console.error(err));
  };

  const handleLikeReply = (commentId, replyId) => {
    if (likedReplies[replyId]) return;
    fetch(`${API_URL}/api/posts/${postId}/comments/${commentId}/replies/${replyId}/like`, { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to like reply");
        setLikedReplies((prev) => ({ ...prev, [replyId]: true }));
        onRefreshPost();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="post-detail-comments-panel">
      <div className="comments-panel-header">
        <h2>Comments ({comments ? comments.length : 0})</h2>
      </div>

      <div className="comments-list-scrollable">
        {!comments || comments.length === 0 ? (
          <p className="no-comments-message">No comments yet. Share your thoughts!</p>
        ) : (
          <div className="comments-stack">
            {comments.map((comment) => (
              <div className="comment-card" key={comment._id}>
                <div className="comment-meta">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                
                <p className="comment-text">{comment.content}</p>

                <div className="comment-actions">
                  <button
                    className={`like-button ${likedComments[comment._id] ? "liked" : ""}`}
                    onClick={() => handleLikeComment(comment._id)}
                  >
                    ❤️ {comment.likes || 0}
                  </button>
                  
                  <button
                    className="reply-toggle-button"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#8a8578",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      padding: "2px 6px",
                    }}
                    onClick={() => {
                      setReplyError("");
                      setActiveReplyCommentId(
                        activeReplyCommentId === comment._id ? null : comment._id
                      );
                    }}
                  >
                    💬 Reply
                  </button>
                </div>

                {/* Display Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="comment-replies-section">
                    {comment.replies.map((reply) => (
                      <div className="reply-card" key={reply._id}>
                        <div className="reply-meta">
                          <span className="reply-author">{reply.author}</span>
                          <span className="reply-date">
                            {new Date(reply.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="reply-text">{reply.content}</p>
                        
                        <div style={{ marginTop: "4px" }}>
                          <button
                            className={`like-button ${likedReplies[reply._id] ? "liked" : ""}`}
                            style={{ fontSize: "0.72rem" }}
                            onClick={() => handleLikeReply(comment._id, reply._id)}
                          >
                            ❤️ {reply.likes || 0}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Nested Reply Form */}
                {activeReplyCommentId === comment._id && (
                  <form className="comment-form" onSubmit={(e) => handleReplySubmit(e, comment._id)} style={{ marginTop: "10px", borderTop: "1px dashed rgba(47,59,47,0.08)", paddingTop: "10px" }}>
                    {replyError && <div className="comment-form-error">{replyError}</div>}
                    <div className="form-group" style={{ marginBottom: "6px" }}>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="comment-input"
                        value={replyAuthor}
                        onChange={(e) => setReplyAuthor(e.target.value)}
                        disabled={replySubmitting}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: "6px" }}>
                      <textarea
                        placeholder="Reply to this comment..."
                        className="comment-textarea"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        disabled={replySubmitting}
                        rows="2"
                        required
                      />
                    </div>
                    <button type="submit" className="comment-submit-button" disabled={replySubmitting} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                      {replySubmitting ? "Posting..." : "Post Reply"}
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add primary Comment Form */}
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <h3>Add a Comment</h3>
        {commentError && <div className="comment-form-error">{commentError}</div>}
        <div className="form-group">
          <input
            type="text"
            placeholder="Your Name"
            className="comment-input"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            disabled={commentSubmitting}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="What are your thoughts?"
            className="comment-textarea"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            disabled={commentSubmitting}
            rows="3"
            required
          />
        </div>
        <button type="submit" className="comment-submit-button" disabled={commentSubmitting}>
          {commentSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
