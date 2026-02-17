
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/sidebar";
import Home from "./pages/home/homepage";
import "./index.css";
import "./App.css";

const Blogs = () => <h1 style={{ padding: "100px" }}>Blogs Page</h1>;
const About = () => <h1 style={{ padding: "100px" }}>About Page</h1>;

function App() {
  return (
    <Router>
      <Sidebar />

      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>

    </Router>
  );
}


export default App;
