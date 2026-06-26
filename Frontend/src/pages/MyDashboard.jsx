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
    <div style={{ padding: "20px" }}>
      <h1>My Dashboard</h1>

      {/* CARDS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <div style={{ padding: "10px", border: "1px solid black" }}>
          Total URLs: {urls.length}
        </div>

        <div style={{ padding: "10px", border: "1px solid black" }}>
          Total Clicks: {totalClicks}
        </div>

        <div style={{ padding: "10px", border: "1px solid black" }}>
          Custom Aliases: {customAliases}
        </div>
      </div>

      {/* TABLE */}
      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Short ID</th>
            <th>Original URL</th>
            <th>Clicks</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {urls.map((u) => (
            <tr key={u._id}>
              <td>{u.shortId}</td>
              <td>{u.longUrl}</td>
              <td>{u.clicks}</td>
              <td>
                <button onClick={() => copy(u.shortId)}>
                  Copy
                </button>

                <button
                  onClick={() =>
                    window.open(`/stats/${u.shortId}`, "_blank")
                  }
                  style={{ marginLeft: "10px" }}
                >
                  Stats
                </button>

                <button
                  onClick={() => deleteUrl(u.shortId)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>


              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {urls.length === 0 && (
        <p style={{ marginTop: "20px" }}>
          No URLs created yet.
        </p>
      )}
    </div>
  );
}