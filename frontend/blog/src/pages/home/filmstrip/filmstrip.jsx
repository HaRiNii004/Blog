import React from "react";
import "./filmstrip.css";

// Pass your media items as a prop: 
// [{ type: 'image', src: '...', label: 'TX 5063' }, { type: 'video', src: '...' }]
const FilmStrip = ({ items = [] }) => {
  // CONCEPT: We duplicate the array so the seamless loop trick works.
  // When translateX(-50%) is reached, it visually looks identical to 0%,
  // so the animation resets without a visible jump.
  const doubled = [...items, ...items];

  return (
    <div className="filmstrip-outer">
      {/* Sprocket holes — top row */}
      <div className="filmstrip-sprockets top" aria-hidden="true" />

      <div className="filmstrip-track-wrapper">
        <div className="filmstrip-track">
          {doubled.map((item, index) => (
            <div className="filmstrip-cell" key={index}>
              {item.type === "video" ? (
                // CONCEPT: muted + autoPlay + playsInline = required for browser autoplay
                <video
                  src={item.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                // CONCEPT: object-fit: cover keeps aspect ratio while filling the frame
                <img src={item.src} alt={item.label || `frame ${index + 1}`} />
              )}
              {item.label && (
                <span className="filmstrip-label">{item.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sprocket holes — bottom row */}
      <div className="filmstrip-sprockets bottom" aria-hidden="true" />
    </div>
  );
};

export default FilmStrip;