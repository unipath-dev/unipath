
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UniversityCard from "./components/UniversityCard";
import { universities } from "./data/universities";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");

  const filteredUniversities = universities.filter((university) =>
    `${university.name} ${university.location} ${university.program}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <Navbar />

      <main>
        <Hero />

        <section className="universities" id="universities">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORE YOUR OPTIONS</span>
              <h2>Find your perfect fit</h2>
              <p>Discover universities that match your goals.</p>
            </div>

            <div className="university-count">
              <strong>{filteredUniversities.length}</strong>
              <span>universities</span>
            </div>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search university, location, or major..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search universities"
            />
          </div>

          <div className="university-grid">
            {filteredUniversities.map((university) => (
              <UniversityCard
                key={university.id}
                university={university}
              />
            ))}
          </div>

          {filteredUniversities.length === 0 && (
            <p className="empty-state">
              No universities found. Try another search.
            </p>
          )}
        </section>

        <section className="about" id="about">
          <span className="eyebrow">OUR MISSION</span>
          <h2>Make your next step a smarter one.</h2>
          <p>
            UniPath is a student-focused project designed to make
            university research and scholarship planning easier.
          </p>
        </section>
      </main>

      <footer>
        <a className="logo" href="#">
          Uni<span>Path</span>
        </a>
        <p>Explore opportunities. Plan your future.</p>
        <span>Student portfolio project · 2026</span>
      </footer>
    </div>
  );
}

export default App;
