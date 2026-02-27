import React from "react";
import "./blogs.css";

const Blogs = () => {
  return (
    <div className="blogs-page">

      {/* LEFT SECTION */}
      <div className="blogs-left">

        <h2 className="filter-title">Filter by Category</h2>

        <div className="blogs-grid">
          {[...Array(8)].map((_, index) => (
            <div className="blog-card" key={index}>
              <div className="blog-image"></div>
              <div className="blog-content"></div>
            </div>
          ))}
        </div>

      </div>

      {/* RIGHT SECTION */}
      <div className="blogs-right">

        <div className="right-box small">
          Running Quotes
        </div>

        <div className="right-box medium">
          Most liked blog
        </div>

        <div className="right-box medium">
          Running Images
        </div>

      </div>

    </div>
  );
};

export default Blogs;
