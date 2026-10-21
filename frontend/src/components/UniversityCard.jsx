
function UniversityCard({ university }) {
  return (
    <article className="university-card">
      <div className="university-icon">🎓</div>

      <span className="program-tag">{university.program}</span>

      <h3>{university.name}</h3>
      <p className="location">📍 {university.location}</p>

      <div className="card-divider" />

      <div className="cost-row">
        <span>Estimated annual tuition</span>
        <strong>${university.tuition.toLocaleString("en-US")}</strong>
      </div>

      <div className="cost-row scholarship-row">
        <span>Example scholarship</span>
        <strong>${university.scholarship.toLocaleString("en-US")}</strong>
      </div>

      <p className="estimate-note">
        Illustrative figures — verify official university costs
        and scholarship eligibility.
      </p>
    </article>
  );
}

export default UniversityCard;
