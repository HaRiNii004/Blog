import React from "react";
import { NavLink } from "react-router-dom";
import { Home, BookOpen, User, Moon } from "lucide-react";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <>
      {/* LEFT SIDE */}
      <div className="sidebar left">
        <NavLink to="/" className="sidebar-item">
          <Home size={22} />
          <span className="tooltip right-tip">Home</span>
        </NavLink>

        <NavLink to="/blogs" className="sidebar-item">
          <BookOpen size={22} />
          <span className="tooltip right-tip">Blogs</span>
        </NavLink>
      </div>

      {/* RIGHT SIDE */}
      <div className="sidebar right">
        <NavLink to="/about" className="sidebar-item">
          <User size={22} />
          <span className="tooltip left-tip">About</span>
        </NavLink>

        <div className="sidebar-item">
          <Moon size={22} />
          <span className="tooltip left-tip">Theme</span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
