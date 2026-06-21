import React, { useState } from "react";
import axios from "axios";

function App() {
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
      // "https://url-shortener-ti4q.onrender.com/shorten"
      'http://localhost:3000/shorten',
      {
        longUrl: url,
        customAlias: customAlias || undefined,
      }
    );

    setShortUrl(res.data.shortUrl);
    setUrl("");
    setCustomAlias("");
  } catch (error) {
    console.error("Shortening failed:", error);
    alert(error.response?.data?.error || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="root">
      <div className="top-badge">Ayush Shivhare</div>

      <h1>The Smartest <span>URL Shortener</span></h1>
      <h1><span>SwiftLink</span> v2.0</h1>
      
      <p className="subtitle">
        A professional link management tool designed for modern developers. 
        Fast, secure, and built for scale.
      </p>

      <div className="glass-card">
        <p style={{ color: "var(--text-dim)", fontSize: "14px", textAlign: "center", margin: "0 0 10px 0" }}>
          Paste your long destination link below
        </p>

        <div className="input-group">
  
          {/* URL INPUT */}
          <div className="input-wrapper">
            <svg className="input-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>

            <input
              type="text"
              placeholder="https://example.com/very-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* 🔥 CUSTOM ALIAS INPUT (NEW) */}
          <div className="input-wrapper" style={{ marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Custom alias (optional) → e.g. github"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* BUTTON */}
          <button onClick={handleShorten} disabled={loading || !url}>
            {loading ? "..." : "Shorten"}
          </button>

        </div>

        {shortUrl && (
          <div className="result-box">
            <p style={{ color: "var(--text-dim)", fontSize: "12px", marginBottom: "12px" }}>
              Your link is ready to share:
            </p>
            <div className="result-content">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="short-link">
                {shortUrl}
              </a>
              <button style={{ padding: '10px 24px', fontSize: '13px' }} onClick={handleCopy}>
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
