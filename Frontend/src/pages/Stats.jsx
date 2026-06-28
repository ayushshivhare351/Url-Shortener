import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function Stats() {
  const { shortId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/stats/${shortId}`)
      .then((res) => setData(res.data))
      .catch(() => setError(true));
  }, [shortId]);

  if (error) {
    return (
      <div className="auth-page">
        <div className="hero-glow" aria-hidden="true" />
        <span className="eyebrow">Stats</span>
        <h1 style={{ fontSize: "2.2rem", marginBottom: "8px" }}>
          Couldn't load <span>that link</span>
        </h1>
        <p className="subtitle" style={{ marginBottom: "10px" }}>
          It may have expired, or the short ID might be incorrect.
        </p>
        <Link to="/dashboard" style={{ color: "var(--accent-primary)", textDecoration: "none", fontWeight: 600 }}>
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="auth-page">
        <div className="hero-glow" aria-hidden="true" />
        <span className="eyebrow">Stats</span>
        <h1 style={{ fontSize: "2.2rem" }}>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="hero-glow" aria-hidden="true" />

      <span className="eyebrow">Link Performance</span>

      <h1 style={{ fontSize: "2.4rem", marginBottom: "8px", textAlign: "center" }}>
        Stats for <span>{data.shortId}</span>
      </h1>

      <p
        className="subtitle"
        style={{ marginBottom: "30px", wordBreak: "break-all", maxWidth: "560px" }}
      >
        {data.longUrl}
      </p>

      <div
        className="glass-card"
        style={{
          background: "#121215",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          maxWidth: "500px",
        }}
      >
        <div className="stats-grid">
          <div className="stat-block">
            <span className="stat-label">Short ID</span>
            <span className="stat-value">{data.shortId}</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-block">
            <span className="stat-label">Total Clicks</span>
            <span className="stat-value">{data.totalClicks}</span>
          </div>
        </div>
      </div>
    </div>
  );
}