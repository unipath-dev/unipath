
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Universities from "./pages/Universities";
import "./App.css";

function Home() {
  return (
    <main>
      <Hero />

      <section className="about" id="about">
        <span className="eyebrow">OUR MISSION</span>
        <h2>Make your next step a smarter one.</h2>
        <p>
          UniPath is a student-focused project designed to make
          university research and scholarship planning easier.
        </p>
      </section>
    </main>
  );
}

function App() {
  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/universities" element={<Universities />} />
      </Routes>

      <footer>
        <a className="logo" href="/">
          Uni<span>Path</span>
        </a>
        <p>Explore opportunities. Plan your future.</p>
        <span>Student portfolio project · 2026</span>
      </footer>
    </div>
  );
}

export default App;
