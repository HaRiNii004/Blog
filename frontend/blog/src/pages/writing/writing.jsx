import React, { useEffect, useState } from "react";
import IndividualPost from "./IndividualPost";
import "./writing.css";
import "./individualpost.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Writing = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    fetch(`${API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        // Filter public, published posts in the "writing" category
        const writingPosts = data.filter(
          (p) =>
            p.isPublic &&
            !p.isDraft &&
            p.category &&
            p.category.toLowerCase() === "writing"
        );
        setPosts(writingPosts);
      })
      .catch((err) => console.error("Failed to load writing posts:", err))
      .finally(() => setLoading(false));
  };

  const handleOpenPost = (post) => {
    setSelectedPost(post);
    // Fetch fresh post details to get comments & replies
    fetchPostDetails(post._id);
  };

  const fetchPostDetails = (postId) => {
    fetch(`${API_URL}/api/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSelectedPost(data);
        }
      })
      .catch((err) => console.error("Failed to refresh post details:", err));
  };

  const handleClosePost = () => {
    setSelectedPost(null);
    fetchPosts(); // Refresh comment count on the grid
  };

  const formatImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="writing-page">
      {selectedPost ? (
        <IndividualPost
          post={selectedPost}
          onClose={handleClosePost}
          onRefreshPost={() => fetchPostDetails(selectedPost._id)}
          API_URL={API_URL}
        />
      ) : (
        <div className="writing-grid-view">
          <header className="writing-header">
            <p className="writing-eyebrow">Creative & Thoughtful Pieces</p>
            <h1 className="writing-title">Writing</h1>
            <p className="writing-subtitle">
              Browse through articles, essays, and stories on life, code, and everything in between.
            </p>
          </header>

          {loading && <p className="writing-status">Loading posts…</p>}
          
          {!loading && posts.length === 0 && (
            <p className="writing-status">
              No writing posts published yet — check back soon.
            </p>
          )}

          {!loading && posts.length > 0 && (
            <div className="writing-masonry">
              {posts.map((post) => (
                <article
                  className="writing-card"
                  key={post._id}
                  onClick={() => handleOpenPost(post)}
                >
                  {post.frontImage ? (
                    <div className="writing-card-image-wrapper">
                      <img
                        src={formatImageUrl(post.frontImage)}
                        alt={post.title}
                        className="writing-card-image"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="writing-card-placeholder-image">
                      <span className="placeholder-text">{post.title.charAt(0)}</span>
                    </div>
                  )}

                  <div className="writing-card-content">
                    {post.tags && post.tags.length > 0 && (
                      <div className="writing-card-tags">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="writing-card-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="writing-card-title">{post.title}</h3>
                    <p className="writing-card-summary">{post.summary}</p>
                    
                    <div className="writing-card-footer">
                      <time>
                        {new Date(post.postingDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                      {post.comments && post.comments.length > 0 && (
                        <span className="comments-count">
                          💬 {post.comments.length}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Writing;
