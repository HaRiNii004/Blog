import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import IndividualPost from "../writing/IndividualPost";
import "./reading.css";
import "../writing/writing.css";
import "../writing/individualpost.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Reading = () => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  // Reading states
  const [currentRead, setCurrentRead] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingReading, setLoadingReading] = useState(true);

  // Slideshow state
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetchPosts();
    fetchReadingItems();
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (recommendations.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % recommendations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [recommendations]);

  const fetchPosts = () => {
    setLoadingPosts(true);
    fetch(`${API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        const readingPosts = data.filter(
          (p) =>
            p.isPublic &&
            !p.isDraft &&
            p.category &&
            p.category.toLowerCase() === "reading"
        );
        setPosts(readingPosts);
      })
      .catch((err) => console.error("Failed to load reading posts:", err))
      .finally(() => setLoadingPosts(false));
  };

  const fetchReadingItems = () => {
    setLoadingReading(true);
    fetch(`${API_URL}/api/reading`)
      .then((res) => res.json())
      .then((data) => {
        const current = data.find((item) => item.type === "current");
        const recs = data.filter((item) => item.type === "recommendation");
        setCurrentRead(current || null);
        setRecommendations(recs);
      })
      .catch((err) => console.error("Failed to load reading data:", err))
      .finally(() => setLoadingReading(false));
  };

  const formatImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const handleOpenPost = (post) => {
    setSelectedPost(post);
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
    fetchPosts();
  };

  return (
    <div className="reading-page-container">
      {selectedPost ? (
        <IndividualPost
          post={selectedPost}
          onClose={handleClosePost}
          onRefreshPost={() => fetchPostDetails(selectedPost._id)}
          API_URL={API_URL}
          backText="Back to Reading"
        />
      ) : (
        <div className="reading-layout">
          {/* LEFT COLUMN: Sidebar info (Current read & Slideshow Recommendations) */}
          <aside className="reading-sidebar">
            <div className="sidebar-header-row">
              <h2 className="section-small-title">
                <BookOpen size={18} className="icon-gold" /> READING SHELF
              </h2>
            </div>

            <div className="sidebar-shelf-content">
              {/* CURRENT READ CARD */}
              <div className="shelf-box current-read-box">
                <h3 className="shelf-box-title">CURRENTLY READING</h3>
                {loadingReading ? (
                  <div className="shimmer-placeholder" style={{ height: "280px" }}></div>
                ) : currentRead ? (
                  <div className="current-read-card">
                    <div className="book-cover-container">
                      <img
                        src={formatImageUrl(currentRead.coverUrl)}
                        alt={currentRead.title}
                        className="book-cover"
                      />
                      <div className="book-cover-glow"></div>
                    </div>
                    <div className="book-details">
                      <h4 className="book-title">{currentRead.title}</h4>
                      <p className="book-author">by {currentRead.author || "Unknown"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="empty-book-card">
                    <div className="empty-book-outline">📖</div>
                    <p>Not reading anything at the moment.</p>
                  </div>
                )}
              </div>

              {/* RECOMMENDATIONS SLIDESHOW */}
              <div className="shelf-box recommendations-box">
                <h3 className="shelf-box-title">FAVORITE RECOMMENDATIONS</h3>
                {loadingReading ? (
                  <div className="shimmer-placeholder" style={{ height: "240px" }}></div>
                ) : recommendations.length > 0 ? (
                  <div className="slideshow-container">
                    <div className="slideshow-slides">
                      {recommendations.map((rec, index) => {
                        let position = "nextSlide";
                        if (index === activeSlide) {
                          position = "activeSlide";
                        } else if (
                          index === activeSlide - 1 ||
                          (activeSlide === 0 && index === recommendations.length - 1)
                        ) {
                          position = "lastSlide";
                        }

                        return (
                          <article className={`slide ${position}`} key={rec._id}>
                            <div className="recommendation-card">
                              <div className="rec-cover-wrapper">
                                <img
                                  src={formatImageUrl(rec.coverUrl)}
                                  alt={rec.title}
                                  className="rec-cover-img"
                                />
                              </div>
                              <div className="rec-book-info">
                                <h4 className="rec-book-title">{rec.title}</h4>
                                <p className="rec-book-author">by {rec.author || "Unknown"}</p>
                              </div>
                              {rec.quote && (
                                <p className="rec-book-quote">
                                  "{rec.quote}"
                                </p>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    {recommendations.length > 1 && (
                      <>
                        <button
                          className="slide-btn prev"
                          onClick={() =>
                            setActiveSlide((prev) => (prev === 0 ? recommendations.length - 1 : prev - 1))
                          }
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          className="slide-btn next"
                          onClick={() =>
                            setActiveSlide((prev) => (prev === recommendations.length - 1 ? 0 : prev + 1))
                          }
                        >
                          <ChevronRight size={16} />
                        </button>
                        <div className="slideshow-dots">
                          {recommendations.map((_, index) => (
                            <button
                              key={index}
                              className={`dot ${index === activeSlide ? "active" : ""}`}
                              onClick={() => setActiveSlide(index)}
                            ></button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="empty-book-card">
                    <div className="empty-book-outline">✨</div>
                    <p>No favorites recommended yet.</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Masonry Grid of Posts under Reading category */}
          <main className="reading-posts-main">
            <header className="reading-header">
              <p className="writing-eyebrow">Book Reviews & Literary Musings</p>
              <h1 className="writing-title">Reading Journal</h1>
              <p className="writing-subtitle">
                My collection of book thoughts, ratings, takeaways, and what I felt while losing myself in pages.
              </p>
            </header>

            {loadingPosts && <p className="writing-status">Loading posts…</p>}

            {!loadingPosts && posts.length === 0 && (
              <div className="no-posts-state">
                <p className="writing-status">No reading posts published yet.</p>
                <p className="no-posts-sub">
                  Create entries in your admin panel and choose the category <strong>Reading</strong>.
                </p>
              </div>
            )}

            {!loadingPosts && posts.length > 0 && (
              <div className="writing-masonry">
                {posts.map((post) => (
                  <article
                    className="writing-card reading-post-card"
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
                      <div className="writing-card-placeholder-image reading-placeholder">
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
          </main>
        </div>
      )}
    </div>
  );
};

export default Reading;
