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

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 URL Dashboard</h1>

      <input
        type="text"
        placeholder="Search URLs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          width: "300px",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      />

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
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
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No URLs found
              </td>
            </tr>
          ) : (
            filteredUrls.map((url) => (
              <tr key={url.shortId}>
                <td>{url.shortId}</td>
                <td>{url.longUrl}</td>
                <td>{url.totalClicks}</td>
                <td>
                  <button onClick={() => copyToClipboard(url.shortId)}>
                    Copy
                  </button>

                  <button
                    onClick={() => navigate(`/stats/${url.shortId}`)}
                    style={{ marginLeft: "10px" }}
                  >
                    Stats
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}