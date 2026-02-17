import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Gauge,
  CloudDownload,
  Layers,
  Settings,
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
    { icon: LayoutDashboard, label: "H writes", path: "/" },
    { icon: Gauge, label: "Dashboard One", path: "/dash1" },
    { icon: Gauge, label: "Dashboard Two", path: "/dash2" },
    { icon: CloudDownload, label: "Downloads", path: "/downloads" },
    { icon: Layers, label: "Projects", path: "/projects" },
  ];

  return (
    <aside className="sidebar">
      {/* Top Brand */}
      <div className="sidebar-brand">CUI</div>

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

      {/* Bottom Settings */}
      <div className="sidebar-bottom">
        <SidebarItem
          icon={Settings}
          label="Settings"
          path="/settings"
          active={location.pathname === "/settings"}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
