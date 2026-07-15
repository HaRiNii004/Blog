import { NavLink } from "react-router-dom";
import "./navbar.css";

const NAV_LINKS = [
    { to: "/h", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/writing", label: "Writing" },
    { to: "/reading", label: "Reading" },

];
const Topbar = () => {
    return (
        <header className="site-topbar">
            {/* <a href="#home" className="site-brand">
        Mosaic<span>.</span>
      </a> */}

            <nav className="site-nav">
                {NAV_LINKS.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className="site-nav-link"
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

        </header >
    );
};

export default Topbar;