
import { useEffect, useState } from "react";
import "./Rankings.css";

const API_URL = "http://localhost:5000/api/rankings";

function Rankings() {
  const [universities, setUniversities] = useState([]);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRankings() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          search,
          country,
          page: String(page),
          limit: "20",
        });

        const response = await fetch(`${API_URL}?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Universitetlarni yuklashda xatolik.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error("Server ma'lumotlarni qaytarmadi.");
        }

        setUniversities(result.data);
        setPagination(result.pagination);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Noma'lum xatolik yuz berdi.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchRankings();

    return () => controller.abort();
  }, [search, country, page]);

  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
  }

  function handleCountryChange(value) {
    setCountry(value);
    setPage(1);
  }

  return (
    <section className="rankings-section">
      <div className="rankings-heading">
        <p className="rankings-eyebrow">GLOBAL UNIVERSITY GUIDE</p>
        <h1>Top Universities in the World</h1>
        <p>
          Explore universities using the QS World University Rankings 2026.
        </p>
      </div>

      <div className="rankings-filters">
        <input
          type="search"
          placeholder="Search university or country..."
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          aria-label="Search universities"
        />

        <input
          type="text"
          placeholder="Filter by country..."
          value={country}
          onChange={(event) => handleCountryChange(event.target.value)}
          aria-label="Filter by country"
        />
      </div>

      <div className="rankings-summary">
        <span>{pagination.total} universities found</span>
        <span>
          Page {page} of {pagination.totalPages || 1}
        </span>
      </div>

      {loading && <p className="rankings-message">Loading universities...</p>}

      {!loading && error && (
        <p className="rankings-error" role="alert">{error}</p>
      )}

      {!loading && !error && universities.length === 0 && (
        <p className="rankings-message">
          No universities found. Try another search.
        </p>
      )}

      {!loading && !error && universities.length > 0 && (
        <div className="rankings-grid">
          {universities.map((university) => (
            <article className="ranking-card" key={university.id}>
              <div className="ranking-card-top">
                <span className="ranking-position">
                  #{university.rank_numeric}
                </span>
                <span className="ranking-score">
                  Score: {university.overall_score ?? "N/A"}
                </span>
              </div>

              <h2>{university.university_name}</h2>

              <p className="ranking-country">
                {university.country_or_territory}
              </p>

              <div className="ranking-card-footer">
                <span>{university.region || "Region unavailable"}</span>
                <span>
                  2025 rank: {university.rank_2025 || "N/A"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="rankings-pagination">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => setPage((current) => current - 1)}
        >
          ← Previous
        </button>

        <span>
          {page} / {pagination.totalPages || 1}
        </span>

        <button
          type="button"
          disabled={page >= pagination.totalPages || loading}
          onClick={() => setPage((current) => current + 1)}
        >
          Next →
        </button>
      </div>
    </section>
  );
}

export default Rankings;
