import React, { useState, useEffect, useRef } from "react";
import "./about.css";

/**
 * CardSwapLite
 * A dependency-free reimplementation of the CardSwap "stacked card" effect
 * using only CSS transitions + React state (no gsap required).
 *
 * Props:
 *  - cards: array of { title, subtitle, content } OR any React nodes
 *  - delay: ms between swaps (default 4000)
 *  - pauseOnHover: boolean (default true)
 *  - width / height: size of each card
 */
const CardSwapLite = ({
  cards = [],
  delay = 4000,
  pauseOnHover = true,
  width = 220,
  height = 160,
}) => {
  const [order, setOrder] = useState(cards.map((_, i) => i));
  const [dropping, setDropping] = useState(null); // index (within `cards`) currently animating out
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  const swap = () => {
    if (cards.length < 2) return;
    setOrder((prev) => {
      const [front, ...rest] = prev;
      setDropping(front);
      // after the drop animation finishes, move front card to the back
      window.setTimeout(() => {
        setDropping(null);
      }, 500);
      return [...rest, front];
    });
  };

  useEffect(() => {
    intervalRef.current = window.setInterval(swap, delay);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, cards.length]);

  const handleMouseEnter = () => {
    if (pauseOnHover) clearInterval(intervalRef.current);
  };
  const handleMouseLeave = () => {
    if (pauseOnHover) intervalRef.current = window.setInterval(swap, delay);
  };

  return (
    <div
      className="cardswap-lite-container"
      ref={containerRef}
      style={{ width, height }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {order.map((cardIdx, stackPos) => {
        const card = cards[cardIdx];
        const isDropping = dropping === cardIdx;
        return (
          <div
            key={cardIdx}
            className={`cardswap-lite-card ${isDropping ? "is-dropping" : ""}`}
            style={{
              width,
              height,
              zIndex: cards.length - stackPos,
              transform: `translate(${stackPos * 10}px, ${-stackPos * 8}px) scale(${1 - stackPos * 0.04})`,
            }}
          >
            {card}
          </div>
        );
      })}
    </div>
  );
};

export default CardSwapLite;
