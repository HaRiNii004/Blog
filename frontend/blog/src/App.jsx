
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Topbar from "./components/navbar/navbar";
import Home from "./pages/home/homepage";
import Writing from "./pages/writing/writing";
// import Blogs from "./pages/blog/blog";
import About from "./pages/about/about";
import "./index.css";
import "./App.css";

// const About = () => <h1 style={{ padding: "100px" }}>About Page</h1>;

function App() {
  return (
    <>
        <Topbar />

        <Routes>
          <Route path="/h" element={<Home />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        </Routes>

    </>
  );
}


export default App;




