import React, { useEffect, useState } from "react";
import "./home.css";

// Set VITE_API_URL in a .env file when you deploy; falls back to local dev
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Home = () => {
  const [postsByCategory, setPostsByCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        const published = data.filter((p) => p.isPublic && !p.isDraft);

        // Group posts by category
        const grouped = published.reduce((acc, post) => {
          const category = post.category || "Uncategorized";
          if (!acc[category]) acc[category] = [];
          acc[category].push(post);
          return acc;
        }, {});

        // Sort each category by newest first, keep top 2 per category
        const grouped2Each = Object.entries(grouped).map(
          ([category, catPosts]) => {
            const sorted = [...catPosts].sort(
              (a, b) => new Date(b.postingDate) - new Date(a.postingDate)
            );
            return { category, posts: sorted.slice(0, 2) };
          }
        );

        setPostsByCategory(grouped2Each);
      })
      .catch((err) => console.error("Failed to load posts:", err))
      .finally(() => setLoading(false));
  }, []);

  // Flatten into one list — the masonry grid handles the visual mixing,
  // so posts don't need to be manually interleaved by category here.
  const previewPosts = postsByCategory.flatMap((group) => group.posts);

  return (
    <div className="home-page">
      {/* LEFT: About Me */}
      <aside className="about-sidebar">
        <p className="hero-eyebrow">Welcome to my corner of the internet</p>
        <h1 className="hero-title">
          Hey, I'm <span>[Your Name]</span> 👋
        </h1>
        <p className="hero-bio">
          I write about tech, thoughts, creativity, and life — a little
          mosaic of everything I'm learning and making. Have a look through
          my <a href="#blogs">writing</a>, or say{" "}
          <a href="#contact">hello</a>.
        </p>

        {/* Add more about-me content here — socials, a photo, tags, etc. */}
        <div className="about-extra">
          <h4>What I write about</h4>
          <ul className="about-tags">
            {postsByCategory.map(({ category }) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>
      </aside>

      {/* RIGHT: Masonry blog previews */}
      <section className="preview-section" id="blogs">
        <div className="preview-header">
          <h2>Latest Writing</h2>
          <a href="#blogs" className="preview-view-all">
            View all →
          </a>
        </div>

        {loading && <p className="preview-status">Loading posts…</p>}
        {!loading && previewPosts.length === 0 && (
          <p className="preview-status">
            No posts published yet — check back soon.
          </p>
        )}

        <div className="preview-masonry">
          {previewPosts.map((post) => (
            <article className="preview-card" key={post._id}>
              {post.category && (
                <span className="preview-tag">{post.category}</span>
              )}
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <time>
                {new Date(post.postingDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;