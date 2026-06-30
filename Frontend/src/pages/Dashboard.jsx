import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchUrls = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/urls`
      );
      setUrls(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const copyToClipboard = (shortId) => {
    const fullUrl = `${import.meta.env.VITE_API_URL}/${shortId}`;
    navigator.clipboard.writeText(fullUrl);
    alert("Copied!");
  };

  const filteredUrls = urls.filter(
    (url) =>
      url.shortId.toLowerCase().includes(search.toLowerCase()) ||
      url.longUrl.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="hero-glow" aria-hidden="true" />
        <span className="eyebrow">Dashboard</span>
        <h1 style={{ fontSize: "2rem", color: "#6b6f76", fontWeight: 200, textAlign: "center" }}>
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="hero-glow" aria-hidden="true" />

      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span className="eyebrow">All Links</span>

        <div className="dashboard-header" style={{ justifyContent: "center" }}>
          <h1><span>URL Dashboard</span></h1>
        </div>

        <p className="dashboard-subtitle" style={{ textAlign: "center", maxWidth: "480px" }}>
          Browse and search every link that's been shortened on SwiftLink.
        </p>

        <div className="dashboard-search-wrapper">
          <span className="dashboard-search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="dashboard-search-input"
            placeholder="Search URLs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div
        className="glass-card"
        style={{
          background: "#121215",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          position: "relative",
          overflow: "hidden",
          padding: "8px",
          width: "100%",
          maxWidth: "1080px",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "560px",
            height: "240px",
            background: "radial-gradient(closest-side, rgba(139,92,246,0.18), transparent)",
            pointerEvents: "none"
          }}
        />

        <div className="url-table-wrapper" style={{ position: "relative" }}>
          <table className="url-table">
            <thead>
              <tr>
                <th>Short ID</th>
                <th>Original URL</th>
                <th>Clicks</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUrls.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="4">No URLs found</td>
                </tr>
              ) : (
                filteredUrls.map((url) => (
                  <tr key={url.shortId}>
                    <td className="short-id-cell">{url.shortId}</td>
                    <td className="long-url-cell">{url.longUrl}</td>
                    <td>{url.totalClicks}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn-table-action" onClick={() => copyToClipboard(url.shortId)}>
                          Copy
                        </button>
                        <button className="btn-table-action" onClick={() => navigate(`/stats/${url.shortId}`)}>
                          Stats
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}