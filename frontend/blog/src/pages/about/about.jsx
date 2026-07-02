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
import CardSwapLite from "./CardSwapLite";
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

const quotes = [
  "Jack of all trades is a master of none; oftentimes better than master of one.",
  "Done is better than perfect.",
  "Stay curious.",
];

/* ---------------------------------------------------------
   Box 5 content — swap these out for whatever you want the
   cards to show (skills, fun facts, projects, etc.)
--------------------------------------------------------- */
const cardSwapItems = [
  <div key="c1"><h4>Currently building</h4><p>This portfolio site, one animated box at a time.</p></div>,
  <div key="c2"><h4>Currently reading</h4><p>Whatever's next on the ever-growing list.</p></div>,
  <div key="c3"><h4>Currently learning</h4><p>A little bit of everything, as always.</p></div>,
];

const About = () => {
  /* ---------- music player state ---------- */
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTrack = tracks[trackIndex];
  const [photos, setPhotos] = useState([]);

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
  }, [photos.length]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const folderId = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID;
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,mimeType)&key=${apiKey}`
        );

        const data = await response.json();

        const imageUrls = data.files
          .filter((file) => file.mimeType.startsWith("image/"))
          .map((file) => `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`);

        setPhotos(imageUrls);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, []);

  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % photos.length);
  const prevPhoto = () => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);

  /* ---------- quote rotation (small box) ---------- */
  const [quoteIndex] = useState(0);

  return (
    <div className="about-page">
      {/* LEFT: big bio box */}
      <div className="about-left">
        <h1 className="about-title">What I'm bout.</h1>
        <hr />

        <section>
          <h4>THE EARLY YEARS</h4>
          <p>
            I am Harini , born in Palani, a town in Tamil Nadu, and grew up as an only child. Most people look back at their childhood summers and see spending them running around the streets and playing under the sun, and I had plenty of that. But I probably spent just as much time hopping between classes. My parents signed me up for everything they could think of—art, languages, music, dance, swimming... you name it.
            You'd expect a story like this to end with me becoming a prodigy at at least one of those things. It didn't.
            Instead, I grew up curious about a little bit of everything, and I wouldn't trade that childhood for anything. These days, I'm making up for all the hobbies I never quite mastered, and I'm enjoying the process just as much. Looking back, I love both versions of me—the kid who tried everything and the adult who's still happily trying.
            I'm still waiting for one of those childhood classes to pay off dramatically, but until then, I'm having a great time learning new things.
          </p>
        </section>

        <section>
          <h4>HOME AWAY FROM HOME</h4>
          <p>
            College took me to BIT, where I earned my degree in Electronics and Communication Engineering (ECE). It was my first real home away from home.

            Somewhere between lectures, late-night conversations, and trying things I'd never imagined doing, I found my people. College gave me more than a degree—it gave me friendships that felt like family, the confidence to step outside my comfort zone, and the realization that life has so much more to offer than following a plan.
            Ironically, it was in my last three months of college that I tried the most new things. I said yes more often, made memories I never expected, and experienced moments that I'll always look back on with a smile.

            Looking back, it wasn't just four years of studying. It was where my world became a little bigger, and so did I.
          </p>
        </section>

        <section>
          <h4>OUTSIDE OF WORK</h4>
          <p>
            When I'm not engineering at work , you'll probably find me sketching, getting lost in a good book, building something just because I wanted to see if I could, or watching films and anime that leave me thinking long after the credits roll.
            I have a soft spot for the films I grew up with — disney classics, Avatar, Harry potter and the kind of stories that make you want to believe in a little bit of magic. I like stories in every form. Some I read, some I watch, and some I end up creating myself.
          </p>
        </section>
      </div>

      {/* RIGHT: grid of boxes */}
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
          {photos.length > 0 && (
            <img src={photos[photoIndex]} alt="slideshow" className="slideshow-img" />
          )}
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
          <a href="mailto:you@example.com" className="social-link gmail">
            <Mail size={20} />
            <span>Email</span>
          </a>
        </div>

        {/* Box 5: CardSwap feature */}
        <div className="about-box cardswap-box">
          <CardSwapLite
            cards={cardSwapItems}
            delay={3500}
            pauseOnHover={true}
            width={200}
            height={140}
          />
        </div>
      </div>
    </div>
  );
};

export default About;
