import React, { useState } from "react";
import { replyToComment, getPostById } from "../../../api/posts";
import toast from "react-hot-toast";
import "./AdminCommentsModal.css";

const AdminCommentsModal = ({ post, onClose, onRefreshPost, API_URL }) => {
  const [replyInputs, setReplyInputs] = useState({}); // { [commentId]: replyText }
  const [replySubmitting, setReplySubmitting] = useState({});

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    const replyText = replyInputs[commentId]?.trim();
    if (!replyText) return;

    setReplySubmitting((prev) => ({ ...prev, [commentId]: true }));

    try {
      await replyToComment(post._id, commentId, replyText);
      toast.success("Reply posted as Author");
      setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
      onRefreshPost(); // Reload comments
    } catch (err) {
      console.error("Failed to reply:", err);
      toast.error("Failed to send reply");
    } finally {
      setReplySubmitting((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const handleReplyInputChange = (commentId, value) => {
    setReplyInputs((prev) => ({ ...prev, [commentId]: value }));
  };

  const handleLikeReply = (commentId, replyId) => {
    fetch(`${API_URL}/api/posts/${post._id}/comments/${commentId}/replies/${replyId}/like`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to like reply");
        onRefreshPost();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="comments-modal-backdrop" onClick={onClose}>
      <div className="comments-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="comments-modal-header">
          <h2 className="comments-modal-title">Comments: {post.title}</h2>
          <button className="comments-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="comments-modal-body">
          {!post.comments || post.comments.length === 0 ? (
            <p className="no-comments-message">No comments found for this post yet.</p>
          ) : (
            post.comments.map((comment) => (
              <div className="admin-comment-card" key={comment._id}>
                <div className="admin-comment-meta">
                  <span className="admin-comment-author">{comment.author}</span>
                  <span className="admin-comment-likes">❤️ {comment.likes || 0} Likes</span>
                </div>
                <p className="admin-comment-text">{comment.content}</p>

                {/* Replies list */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="admin-replies-list">
                    {comment.replies.map((reply, rIdx) => (
                      <div className="admin-reply-item" key={reply._id || rIdx}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span className="admin-reply-author">{reply.author}</span>
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              fontSize: "11px",
                            }}
                            onClick={() => handleLikeReply(comment._id, reply._id)}
                          >
                            ❤️ {reply.likes || 0}
                          </button>
                        </div>
                        <p className="admin-reply-text">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <form
                  className="admin-reply-form"
                  onSubmit={(e) => handleReplySubmit(e, comment._id)}
                >
                  <input
                    type="text"
                    placeholder="Reply as Author..."
                    className="admin-reply-input"
                    value={replyInputs[comment._id] || ""}
                    onChange={(e) => handleReplyInputChange(comment._id, e.target.value)}
                    disabled={replySubmitting[comment._id]}
                    required
                  />
                  <button
                    type="submit"
                    className="admin-reply-btn"
                    disabled={replySubmitting[comment._id]}
                  >
                    {replySubmitting[comment._id] ? "Replying..." : "Reply"}
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCommentsModal;
