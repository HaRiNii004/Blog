import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './viewposts.css';
import Sidebar from '../../../components/write/sidebar/sidebar';

const ViewPosts = () => {
  const navigate = useNavigate();
  // State to track if we are viewing 'posts' or 'drafts'
  const [activeTab, setActiveTab] = useState('posts');

  // Mock data - In a real app, this would come from your DB/API
  const content = [
    { id: 1, title: 'My First Blog', type: 'posts', category: 'Tech' },
    { id: 2, title: 'Learning React', type: 'posts', category: 'Dev' },
    { id: 3, title: 'Draft Idea #1', type: 'drafts', category: 'Life' },
    { id: 4, title: 'Draft Idea #2', type: 'drafts', category: 'Tech' },
  ];

  // Filter content based on activeTab
  const filteredItems = content.filter(item => item.type === activeTab);

  return (
    <>
      <Sidebar />
      <div className="viewposts-container">
        {/* 1. Create Post Section (Flexbox) */}
        <div className="create-post-header">
          <button
            className="create-btn"
            onClick={() => navigate('/create-post')}
          >
            Create a new post <span className="plus-icon">+</span>
          </button>
        </div>

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

            <div className="filter-dropdown">
              <select>
                <option>Filter by category</option>
                <option>Tech</option>
                <option>Dev</option>
              </select>
            </div>
          </div>

          {/* 3. Grid Container (Flexbox) */}
          <div className="posts-grid">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="post-card"
                onClick={() => navigate(`/edit/${item.id}`)}
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