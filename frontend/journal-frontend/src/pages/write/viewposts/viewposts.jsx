import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './viewposts.css';
import Sidebar from '../../../components/write/sidebar/sidebar';
import { fetchPosts } from "../../../api/fetchposts";
import { replyToComment, getPostById } from "../../../api/posts";
import toast from "react-hot-toast";

const ViewPosts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comments modal state
  const [selectedPostComments, setSelectedPostComments] = useState(null);
  const [replyInputs, setReplyInputs] = useState({}); // { [commentId]: replyText }
  const [replySubmitting, setReplySubmitting] = useState({});

  const filteredItems = useMemo(() => {
    return posts.filter(post =>
      activeTab === "posts" ? !post.isDraft : post.isDraft
    );
  }, [posts, activeTab]);

  useEffect(() => {
    loadAllPosts();
  }, []);

  const loadAllPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      toast.error("Failed to load journal entries");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenComments = async (post) => {
    setSelectedPostComments(post);
    // Fetch latest post comments from server
    try {
      const freshPost = await getPostById(post._id);
      setSelectedPostComments(freshPost);
    } catch (err) {
      console.error("Failed to load latest comments:", err);
    }
  };

  const handleCloseComments = () => {
    setSelectedPostComments(null);
    setReplyInputs({});
    // Reload posts to update main view with new comment counters
    loadAllPosts();
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    const replyText = replyInputs[commentId]?.trim();
    if (!replyText) return;

    setReplySubmitting(prev => ({ ...prev, [commentId]: true }));

    try {
      await replyToComment(selectedPostComments._id, commentId, replyText);
      toast.success("Reply posted as Author");

      // Clear specific reply text field
      setReplyInputs(prev => ({ ...prev, [commentId]: "" }));

      // Refresh current comments modal content
      const freshPost = await getPostById(selectedPostComments._id);
      setSelectedPostComments(freshPost);
    } catch (err) {
      console.error("Failed to reply:", err);
      toast.error("Failed to send reply");
    } finally {
      setReplySubmitting(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleReplyInputChange = (commentId, value) => {
    setReplyInputs(prev => ({ ...prev, [commentId]: value }));
  };

  return (
    <>
      <Sidebar />
      <div className="viewposts-container">
        <div className="content-box">
          <div className="content-navbar">
            <h1 className="page-title">My Journal Entries</h1>
            <div className="tab-group">
              <button
                className={`tab-link ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                Published
              </button>
              <button
                className={`tab-link ${activeTab === 'drafts' ? 'active' : ''}`}
                onClick={() => setActiveTab('drafts')}
              >
                Drafts
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading entries...</p>
            </div>
          ) : (
            <div className="posts-grid">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="post-card"
                  onClick={() => navigate(`/edit/${item._id}`)}
                >
                  <div className="card-image-wrapper">
                    {item.frontImage ? (
                      <img src={item.frontImage} alt={item.title} className="card-image" />
                    ) : (
                      <div className="card-image-placeholder sunset-gradient">
                        <span className="placeholder-text">{item.category || "Journal"}</span>
                      </div>
                    )}
                    {item.category && (
                      <span className="card-category-badge">{item.category}</span>
                    )}
                  </div>

                  <div className="card-content">
                    <div className="card-date">
                      {new Date(item.postingDate || item.createdAt).toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-summary">{item.summary || "No summary provided."}</p>

                    {item.tags && item.tags.length > 0 && (
                      <div className="card-tags">
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="card-tag">#{tag}</span>
                        ))}
                      </div>
                    )}

                    <button
                      className="card-comments-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenComments(item);
                      }}
                    >
                      💬 {item.comments ? item.comments.length : 0} Comments
                    </button>
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="empty-state">
                  <p className="empty-msg">No {activeTab === 'posts' ? 'published posts' : 'drafts'} found.</p>
                  <button className="create-new-btn" onClick={() => navigate('/createnew')}>
                    Create New Entry
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Admin Comments Modal */}
      {selectedPostComments && (
        <div className="comments-modal-backdrop" onClick={handleCloseComments}>
          <div className="comments-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="comments-modal-header">
              <h2 className="comments-modal-title">Comments for: {selectedPostComments.title}</h2>
              <button className="comments-modal-close" onClick={handleCloseComments}>&times;</button>
            </div>

            <div className="comments-modal-body">
              {!selectedPostComments.comments || selectedPostComments.comments.length === 0 ? (
                <p className="no-comments-message">No comments found for this post yet.</p>
              ) : (
                selectedPostComments.comments.map((comment) => (
                  <div className="admin-comment-card" key={comment._id}>
                    <div className="admin-comment-meta">
                      <span className="admin-comment-author">{comment.author}</span>
                      <span className="admin-comment-likes">❤️ {comment.likes || 0} Likes</span>
                    </div>
                    <p className="admin-comment-text">{comment.content}</p>

                    {/* Replies thread list */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="admin-replies-list">
                        {comment.replies.map((reply, rIdx) => (
                          <div className="admin-reply-item" key={reply._id || rIdx}>
                            <span className="admin-reply-author">{reply.author}</span>
                            <p className="admin-reply-text">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply form */}
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
      )}
    </>
  );
};

export default ViewPosts;