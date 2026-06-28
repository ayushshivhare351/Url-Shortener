import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyDashboard() {
  const [urls, setUrls] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchMyUrls = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/myurls`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUrls(res.data);
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchMyUrls();
  }, []);

  const copy = (shortId) => {
    const url = `${import.meta.env.VITE_API_URL}/${shortId}`;
    navigator.clipboard.writeText(url);
    alert("Copied");
  };

  const deleteUrl = async (shortId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this URL?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/urls/${shortId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUrls(urls.filter(u => u.shortId !== shortId));

      alert("URL deleted");

    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);

  const customAliases = urls.filter(u =>
    /^[a-zA-Z]/.test(u.shortId)
  ).length;

  return (
    <div className="dashboard-page">
      <span className="eyebrow">Your Links</span>

      <div className="dashboard-header">
        <div className="dashboard-header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
        </div>
        <h1>My <span>Dashboard</span></h1>
      </div>

      <p className="dashboard-subtitle">
        Every link you've created, all in one place.
      </p>

      <div className="stat-tiles">
        <div className="stat-tile">
          <span className="stat-tile-label">Total URLs</span>
          <span className="stat-tile-value">{urls.length}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile-label">Total Clicks</span>
          <span className="stat-tile-value">{totalClicks}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile-label">Custom Aliases</span>
          <span className="stat-tile-value">{customAliases}</span>
        </div>
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
            {urls.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="4">No URLs created yet.</td>
              </tr>
            ) : (
              urls.map((u) => (
                <tr key={u._id}>
                  <td className="short-id-cell">{u.shortId}</td>
                  <td className="long-url-cell">{u.longUrl}</td>
                  <td>{u.clicks}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-table-action" onClick={() => copy(u.shortId)}>
                        Copy
                      </button>
                      <button className="btn-table-action" onClick={() => window.open(`/stats/${u.shortId}`, "_blank")}>
                        Stats
                      </button>
                      <button className="btn-table-action danger" onClick={() => deleteUrl(u.shortId)}>
                        Delete
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