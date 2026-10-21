
function Hero() {
  return (
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
  );
}

export default Hero;
