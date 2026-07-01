import React from "react";
import "./home.css";
import TopBar from "./topbar";
import FilmStrip from "./filmstrip/filmstrip";
import image1 from "../../assets/download (2).jpg";
import image2 from "../../assets/download (3).jpg";
import image3 from "../../assets/download (4).jpg";
import video1 from "../../assets/WhatsApp Video 2026-06-26 at 3.56.37 PM.mp4";

const mediaItems = [
  {type: 'image' , src: image1},
  {type: 'image' , src: image2},
  {type: 'image' , src: image3},
  {type: 'video' , src: video1},
]

const Home = () => {
  return (
    <>
    <div className="engulf-container">
      <TopBar />

      <div className="home-container">
       
        {/* <FilmStrip items={mediaItems}/> */}
      
      </div>
      </div>
    </>
  );
};

export default Home;
