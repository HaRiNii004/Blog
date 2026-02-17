import React from "react";
import "./Blob.css";

const Blob = ({ children }) => {
  return (
    <div className="blob-wrapper">
      <div className="blob">
        <div className="blob-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Blob;
