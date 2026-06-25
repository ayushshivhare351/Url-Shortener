import React, { useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";

function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customAlias, setCustomAlias] = useState("");

  const handleShorten = async () => {
    if (!url) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/shorten`,
        {
          longUrl: url,
          customAlias: customAlias || undefined,
        }
      );

      setShortUrl(res.data.shortUrl);
      setUrl("");
      setCustomAlias("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="root">
      <div className="top-badge">Ayush Shivhare</div>

      <h1>
        The Smartest <span>URL Shortener</span>
      </h1>

      <h1>
        <span>SwiftLink</span> v2.0
      </h1>

      <p className="subtitle">
        A professional link management tool designed for modern developers.
        Fast, secure, and built for scale.
      </p>

      <div className="glass-card">

        <p
          style={{
            color: "var(--text-dim)",
            fontSize: "14px",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Paste your long destination link below
        </p>

        <div className="input-group">

          <div className="input-wrapper">
            <input
              type="text"
              placeholder="https://example.com/very-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>

          <div
            className="input-wrapper"
            style={{ marginTop: "10px" }}
          >
            <input
              type="text"
              placeholder="Custom alias (optional)"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            onClick={handleShorten}
            disabled={loading || !url}
          >
            {loading ? "..." : "Shorten"}
          </button>

        </div>

        {shortUrl && (
          <div className="result-box">

            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "12px",
                marginBottom: "12px",
              }}
            >
              Your link is ready to share:
            </p>

            <div className="result-content">

              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="short-link"
              >
                {shortUrl}
              </a>

              <button
                onClick={handleCopy}
                style={{
                  padding: "10px 24px",
                  fontSize: "13px",
                }}
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>

            </div>

          </div>
        )}

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <Link to="/dashboard">
            <button>
              Go to Dashboard
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/stats/:shortId"
          element={<Stats />}
        />

      </Routes>

    </Router>
  );
}