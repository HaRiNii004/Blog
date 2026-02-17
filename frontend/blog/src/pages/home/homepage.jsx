import React from "react";
import "./home.css";
import Blob from "./blob";
import TopBar from "./topbar";

const images = [
  "https://picsum.photos/300/300?1",
  "https://picsum.photos/300/300?2",
  "https://picsum.photos/300/300?3",
  "https://picsum.photos/300/300?4",
  "https://picsum.photos/300/300?5",
];

const Home = () => {
  return (
    <>
    <div className="engulf-container">
      <TopBar />

      <div className="home-container">
        <div className="photos-container">
          {images.map((img, index) => (
            <div className="polaroid" key={index}>
              <img src={img} alt="memory" />
              <p>Memory {index + 1}</p>
            </div>
          ))}
        </div>

        <div className="about-container">
          <Blob>
            <h2>About Me</h2>
            <p>
              Welcome to my little corner of the internet.
              I write about tech, thoughts, creativity, and life.
            </p>
          </Blob>
        </div>
      </div>
      </div>
    </>
  );
};

export default Home;
