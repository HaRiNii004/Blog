import React, { useState, useRef, useEffect } from "react";
import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import "./about.css";

/* ---------------------------------------------------------
   DEMO DATA — replace these with real data later.

   tracks: swap this with data pulled from the Spotify Web API
   (you'll need an access token + the Web Playback SDK to
   actually stream audio in-browser).

   photos: swap this with images fetched from the Google Drive
   API (drive.files.list on a specific folder), or just paste
   public image URLs here for now.
--------------------------------------------------------- */
const tracks = [
  { title: "Circles", artist: "Mac Miller", cover: "https://picsum.photos/300/300?music1" },
  { title: "Buttercup", artist: "Jack Stauber", cover: "https://picsum.photos/300/300?music2" },
  { title: "Adore U", artist: "Fred again..", cover: "https://picsum.photos/300/300?music3" },
];

const photos = [
  "https://picsum.photos/500/500?travel1",
  "https://picsum.photos/500/500?travel2",
  "https://picsum.photos/500/500?travel3",
];

const quotes = [
  "Jack of all trades is a master of none; oftentimes better than master of one.",
  "Done is better than perfect.",
  "Stay curious.",
];

const About = () => {
  /* ---------- music player state ---------- */
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTrack = tracks[trackIndex];

  const nextTrack = () => {
    setTrackIndex((i) => (i + 1) % tracks.length);
    setIsPlaying(true);
  };
  const prevTrack = () => {
    setTrackIndex((i) => (i - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };
  const togglePlay = () => setIsPlaying((p) => !p);

  /* ---------- photo slideshow state ---------- */
  const [photoIndex, setPhotoIndex] = useState(0);

  // auto-advance the slideshow every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer); // cleanup so timers don't pile up
  }, []);

  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % photos.length);
  const prevPhoto = () =>
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);

  /* ---------- quote rotation (small box) ---------- */
  const [quoteIndex] = useState(0);

  return (
    <div className="about-page">
      {/* LEFT: big bio box */}
      <div className="about-left">
        <h1 className="about-title">What I'm bout.</h1>
        <hr />

        <section>
          <h4>WHERE I'M FROM</h4>
          <p>
            Write your origin story here — where you grew up, what your
            parents did, what shaped you early on.
          </p>
        </section>

        <section>
          <h4>WHAT I USED TO DO</h4>
          <p>
            List your past jobs / experiences in a casual, human voice.
            This is the section that makes you feel like a real person,
            not a resume.
          </p>
        </section>

        <section>
          <h4>WHAT I DO NOW</h4>
          <p>
            Today I'm a <strong>Developer</strong> building{" "}
            <strong>my own projects</strong>. Previously I was{" "}
            <strong>...</strong>
          </p>
        </section>
      </div>

      {/* RIGHT: 2x2 grid */}
      <div className="about-right">
        {/* Box 1: quote */}
        <div className="about-box quote-box">
          <p className="quote-text">&ldquo;{quotes[quoteIndex]}&rdquo;</p>
        </div>

        {/* Box 2: music player */}
        <div className="about-box music-box">
          <img src={currentTrack.cover} alt={currentTrack.title} className="music-cover" />
          <div className="music-info">
            <p className="music-title">{currentTrack.title}</p>
            <p className="music-artist">{currentTrack.artist}</p>
          </div>
          <div className="music-controls">
            <button onClick={prevTrack} aria-label="Previous track">
              <SkipBack size={18} />
            </button>
            <button onClick={togglePlay} aria-label="Play or pause">
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button onClick={nextTrack} aria-label="Next track">
              <SkipForward size={18} />
            </button>
          </div>
        </div>

        {/* Box 3: photo slideshow */}
        <div className="about-box photo-box">
          <img src={photos[photoIndex]} alt="slideshow" className="slideshow-img" />
          <button className="slide-arrow left" onClick={prevPhoto} aria-label="Previous photo">
            <ChevronLeft size={20} />
          </button>
          <button className="slide-arrow right" onClick={nextPhoto} aria-label="Next photo">
            <ChevronRight size={20} />
          </button>
          <div className="slide-dots">
            {photos.map((_, i) => (
              <span key={i} className={`dot ${i === photoIndex ? "active" : ""}`} />
            ))}
          </div>
        </div>

        {/* Box 4: social links */}
        <div className="about-box social-box">
          <a
            href="https://github.com/your-username"
            target="_blank"
            rel="noreferrer"
            className="social-link github"
          >
            <Github size={20} />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/your-username"
            target="_blank"
            rel="noreferrer"
            className="social-link linkedin"
          >
            <Linkedin size={20} />
            <span>LinkedIn</span>
          </a>
          <a
            href="mailto:you@example.com"
            className="social-link gmail"
          >
            <Mail size={20} />
            <span>Email</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
