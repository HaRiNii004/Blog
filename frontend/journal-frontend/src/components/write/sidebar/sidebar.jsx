import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Gauge,
  CloudDownload,
  Plus,
  Layers,
  Settings,
  BookOpen,
} from "lucide-react";
import "./sidebar.css";

const SidebarItem = ({ icon: Icon, label, path, active }) => {
  return (
    <div className="sidebar-item">
      <Link
        to={path}
        className={`sidebar-icon ${active ? "active" : ""}`}
      >
        <Icon size={22} />
      </Link>

      {/* Tooltip */}
      <span className="sidebar-tooltip">{label}</span>
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "posts", path: "/" },
    { icon: Plus, label: "create", path: "/createnew" },
    { icon: BookOpen, label: "reading", path: "/reading-manage" },

  ];

  return (
    <aside className="sidebar">
      {/* Top Brand */}
      <div className="sidebar-brand">H</div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.label}
            {...item}
            active={location.pathname === item.path}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
