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
        <span className="eyebrow">Dashboard</span>
        <h1 style={{ fontSize: "2rem", color: "#6b6f76", fontWeight: 200 }}>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <span className="eyebrow">All Links</span>

      <div className="dashboard-header">
        <div className="dashboard-header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="20" x2="12" y2="10" />
            <line x1="18" y1="20" x2="18" y2="4" />
            <line x1="6" y1="20" x2="6" y2="16" />
          </svg>
        </div>
        <h1>URL <span>Dashboard</span></h1>
      </div>

      <p className="dashboard-subtitle">
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

      <div className="url-table-wrapper">
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
  );
}