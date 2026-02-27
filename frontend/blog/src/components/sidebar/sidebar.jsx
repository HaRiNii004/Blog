import React from "react";
import { Home, BookOpen, User, Moon } from "lucide-react";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <>
      {/* LEFT SIDE */}
      <div className="sidebar left">
        <a href="#home" className="sidebar-item">
          <Home size={22} />
          <span className="tooltip right-tip">Home</span>
        </a>

        <a href="#blogs" className="sidebar-item">
          <BookOpen size={22} />
          <span className="tooltip right-tip">Blogs</span>
        </a>
      </div>

      {/* RIGHT SIDE */}
      <div className="sidebar right">
        <a href="#contact" className="sidebar-item">
          <User size={22} />
          <span className="tooltip left-tip">Contact</span>
        </a>

        <div className="sidebar-item">
          <Moon size={22} />
          <span className="tooltip left-tip">Theme</span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;