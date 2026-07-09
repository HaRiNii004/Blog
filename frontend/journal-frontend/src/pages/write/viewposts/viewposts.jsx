import React, { useState , useEffect , useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './viewposts.css';
import Sidebar from '../../../components/write/sidebar/sidebar';
import { fetchPosts } from "../../../api/fetchposts";

const ViewPosts = () => {
  const navigate = useNavigate();
  // State to track if we are viewing 'posts' or 'drafts'
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter content based on activeTab
  const filteredItems = useMemo(() => {
    return posts.filter(post =>
      activeTab === "posts"
        ? !post.isDraft
        : post.isDraft
    );
  }, [posts, activeTab]);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="viewposts-container">
        {/* Main Content Container */}
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
            /* Grid Container */
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
    </>
  );
};

export default ViewPosts;