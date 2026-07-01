import { NavLink } from "react-router-dom";
import "./TopBar.css";

const TopBar = () => {
  return (
    <nav className="topbar">
      <NavLink
        to="/about"
        className={({ isActive }) => isActive ? "active" : ""}
      >
        About
      </NavLink>

      <NavLink
        to="/writing"
        className={({ isActive }) => isActive ? "active" : ""}
      >
        Writing
      </NavLink>

      <NavLink
        to="/reading"
        className={({ isActive }) => isActive ? "active" : ""}
      >
        Reading
      </NavLink>
    </nav>
  );
};

export default TopBar;