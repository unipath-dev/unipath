
import { useEffect, useState } from "react";
import "./Universities.css";

const API_URL = "http://localhost:5000/api/rankings";
const PAGE_SIZE = 12;

function Universities() {
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

    async function loadUniversities() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        if (search.trim()) params.set("search", search.trim());
        if (country.trim()) params.set("country", country.trim());

        const response = await fetch(`${API_URL}?${params}`, {
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Universities could not be loaded."
          );
        }

        setUniversities(result.data);
        setPagination(result.pagination);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadUniversities();
    return () => controller.abort();
  }, [search, country, page]);

  function getPageNumbers() {
    const total = pagination.totalPages;
    const pages = new Set([1, total, page - 1, page, page + 1]);

    return [...pages]
      .filter((number) => number >= 1 && number <= total)
      .sort((a, b) => a - b);
  }

  const pageNumbers = getPageNumbers();

  function changeSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function changeCountry(value) {
    setCountry(value);
    setPage(1);
  }

  return (
    <section className="universities-page">
      <div className="universities-hero">
        <span className="eyebrow">EXPLORE THE WORLD</span>
        <h1>Find Your University</h1>
        <p>
          Explore universities around the world and discover your
          next academic opportunity.
        </p>
      </div>

      <div className="universities-toolbar">
        <input
          type="search"
          placeholder="Search university or country..."
          value={search}
          onChange={(event) => changeSearch(event.target.value)}
          aria-label="Search universities"
        />

        <input
          type="search"
          placeholder="Filter by country..."
          value={country}
          onChange={(event) => changeCountry(event.target.value)}
          aria-label="Filter by country"
        />
      </div>

      <div className="universities-results">
        <span>
          {pagination.total} universities found
        </span>
        <span>
          Page {page} of {pagination.totalPages || 1}
        </span>
      </div>

      {loading && (
        <p className="universities-message">Loading universities...</p>
      )}

      {!loading && error && (
        <p className="universities-error" role="alert">{error}</p>
      )}

      {!loading && !error && universities.length === 0 && (
        <p className="universities-message">
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

      {!loading && !error && pagination.totalPages > 1 && (
        <nav className="universities-pagination" aria-label="University pages">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
          >
            ←
          </button>

          {pageNumbers.map((number, index) => (
            <span className="page-number-group" key={number}>
              {index > 0 && number - pageNumbers[index - 1] > 1 && (
                <span className="page-ellipsis">…</span>
              )}

              <button
                type="button"
                className={page === number ? "active" : ""}
                aria-current={page === number ? "page" : undefined}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            </span>
          ))}

          <button
            type="button"
            disabled={page === pagination.totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            →
          </button>
        </nav>
      )}
    </section>
  );
}

export default Universities;
