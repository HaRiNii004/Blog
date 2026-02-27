
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/sidebar";
import Home from "./pages/home/homepage";
import Blogs from "./pages/blog/blog";
import "./index.css";
import "./App.css";

const About = () => <h1 style={{ padding: "100px" }}>About Page</h1>;

function App() {
  return (
    <>
      <Sidebar />

      <div className="scroll-container">
        <section id="home">
          <Home />
        </section>

        <section id="blogs">
          <Blogs />
        </section>

        {/* <section id="contact">
          <Contact />
        </section> */}
      </div>

    </>
  );
}


export default App;




