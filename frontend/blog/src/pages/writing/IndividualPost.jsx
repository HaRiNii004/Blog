import React from "react";
import CommentsSection from "./CommentsSection";

const IndividualPost = ({ post, onClose, onRefreshPost, API_URL }) => {
  const formatImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="post-detail-overlay">
      <div className="post-detail-container">
        <button className="back-button" onClick={onClose}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Writing
        </button>

        <div className="post-detail-layout">
          {/* Left Column: Post Contents (Occupies 75% on desktop grid) */}
          <div className="post-detail-main">
            {post.frontImage && (
              <div className="post-detail-image-wrapper">
                <img
                  src={formatImageUrl(post.frontImage)}
                  alt={post.title}
                  className="post-detail-image"
                />
              </div>
            )}

            <div className="post-detail-header">
              {post.tags && post.tags.length > 0 && (
                <div className="post-detail-tags">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="tag-pill">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="post-detail-title">{post.title}</h1>

              <div className="post-detail-meta">
                <time>
                  Published on{" "}
                  {new Date(post.postingDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>

            <div className="post-detail-summary-block">
              <p className="post-detail-summary">{post.summary}</p>
            </div>

            <div
              className="post-detail-content ql-editor"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Right Column: Comments Section (Occupies 25% on desktop grid) */}
          <CommentsSection
            postId={post._id}
            comments={post.comments}
            onRefreshPost={onRefreshPost}
            API_URL={API_URL}
          />
        </div>
      </div>
    </div>
  );
};

export default IndividualPost;
