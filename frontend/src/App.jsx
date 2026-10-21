
import { useState } from "react";
import "./App.css";

const universities = [
  {
    name: "University of Oklahoma",
    location: "Norman, Oklahoma",
    program: "Computer Science",
    tuition: 34335,
    scholarship: 17500,
  },
  {
    name: "University of Alabama",
    location: "Tuscaloosa, Alabama",
    program: "Computer Science",
    tuition: 33000,
    scholarship: 15000,
  },
  {
    name: "Iowa State University",
    location: "Ames, Iowa",
    program: "Software Engineering",
    tuition: 30000,
    scholarship: 12000,
  },
];

function App() {
  const [search, setSearch] = useState("");

  const filteredUniversities = universities.filter((university) =>
    `${university.name} ${university.location} ${university.program}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#">
          Uni<span>Path</span>
        </a>

        <nav>
          <a href="#universities">Universities</a>
          <a href="#about">About</a>
        </nav>

        <a className="nav-button" href="#universities">
          Explore universities
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">YOUR FUTURE STARTS HERE</span>

            <h1>
              Find your university.
              <br />
              <span>Build your future.</span>
            </h1>

            <p>
              Discover universities, explore scholarships, and plan
              your study-abroad journey in one place.
            </p>

            <a className="primary-button" href="#universities">
              Explore universities <span>→</span>
            </a>

            <div className="hero-note">
              <span className="status-dot" />
              Made for ambitious students worldwide
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-circle">
              <div className="graduation-icon">🎓</div>
            </div>
            <div className="floating-card scholarship-card">
              <span>Scholarship opportunities</span>
              <strong>Find your next opportunity.</strong>
            </div>
            <div className="floating-card future-card">
              <span>YOUR NEXT CHAPTER</span>
              <strong>Starts with a search.</strong>
            </div>
          </div>
        </section>

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
              <article className="university-card" key={university.name}>
                <div className="university-icon">🎓</div>

                <span className="program-tag">{university.program}</span>

                <h3>{university.name}</h3>
                <p className="location">📍 {university.location}</p>

                <div className="card-divider" />

                <div className="cost-row">
                  <span>Estimated annual tuition</span>
                  <strong>
                    ${university.tuition.toLocaleString("en-US")}
                  </strong>
                </div>

                <div className="cost-row scholarship-row">
                  <span>Example scholarship</span>
                  <strong>
                    ${university.scholarship.toLocaleString("en-US")}
                  </strong>
                </div>

                <p className="estimate-note">
                  Illustrative figures — verify official university costs
                  and scholarship eligibility.
                </p>
              </article>
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
