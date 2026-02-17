import React from "react";
import "./topbar.css";

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="topbar-overlay">
        <h1 className="topbar-title">
          A MOSAIC OF ALL I AM – <span>every fragment still alive</span>
        </h1>

        <p className="topbar-quote">
          Jack of all trades is a master of none ; oftentimes better than master of one
        </p>
      </div>
    </div>
  );
};

export default TopBar;
