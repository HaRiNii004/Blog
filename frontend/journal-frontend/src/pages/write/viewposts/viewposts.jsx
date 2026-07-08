import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './viewposts.css';
import Sidebar from '../../../components/write/sidebar/sidebar';
import { fetchPosts } from "../../../api/fetchposts";

const ViewPosts = () => {
  const navigate = useNavigate();
  // State to track if we are viewing 'posts' or 'drafts'
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);


  // Filter content based on activeTab
  const filteredItems = posts.filter((item) =>
    activeTab === "posts"
      ? item.isDraft === false
      : item.isDraft === true
  );

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    getPosts();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="viewposts-container">
   

        {/* 2. Main Content Container (Flexbox) */}
        <div className="content-box">
          <div className="content-navbar">
            <div className="tab-group">
              <button
                className={`tab-link ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                Posts
              </button>
              <button
                className={`tab-link ${activeTab === 'drafts' ? 'active' : ''}`}
                onClick={() => setActiveTab('drafts')}
              >
                Drafts
              </button>
            </div>

            
          </div>

          {/* 3. Grid Container (Flexbox) */}
          <div className="posts-grid">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="post-card"
                onClick={() => navigate(`/edit/${item._id}`)}
              >
                <div className="card-placeholder"></div>
                <p className="card-title">{item.title}</p>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <p className="empty-msg">No {activeTab} found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPosts;