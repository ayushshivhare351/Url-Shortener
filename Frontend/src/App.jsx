import React, { useState } from "react";
import axios from "axios";
import QRCode from "qrcode";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyDashboard from "./pages/MyDashboard";
import Navbar from "./components/Navbar";

function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customAlias, setCustomAlias] = useState("");
  const [mode, setMode] = useState("shorten"); // "shorten" | "qr"
  const [qrDataUrl, setQrDataUrl] = useState("");

  const switchMode = (newMode) => {
    setMode(newMode);
    setShortUrl("");
    setQrDataUrl("");
    setUrl("");
    setCustomAlias("");
  };

  const handleShorten = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/shorten`, {
        longUrl: url,
        customAlias: customAlias || undefined,
      });
      const newShortUrl = res.data.shortUrl;
      setShortUrl(newShortUrl);
      setUrl("");
      setCustomAlias("");

      // Generate the preview QR code automatically if generated inside the QR panel
      if (mode === "qr" || newShortUrl) {
        const dataUrl = await QRCode.toDataURL(newShortUrl, {
          width: 320,
          margin: 1,
          color: { dark: "#0a0a0b", light: "#ffffff" },
        });
        setQrDataUrl(dataUrl);
      }
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

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "swiftlink-qr.png";
    link.click();
  };

  const buttonStyle = {
    background: "linear-gradient(90deg, #0a0a0b 0%, #2a2a2e 100%)",
    color: "#e5e5e7",
    border: "none",
    padding: "10px 22px",
    borderRadius: "100px",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    fontWeight: 600,
    fontSize: "0.9rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  };

  return (
    <div id="root">
      <div className="hero-glow" aria-hidden="true" />
      <div className="card-glow" aria-hidden="true" />

      <span className="eyebrow">Fast. Free. Built for scale.</span>

      <h1>The <span>smartest way</span> to shorten</h1>
      <h1><span>any link</span>, instantly</h1>

      <p className="subtitle">
        A professional link management tool designed for modern developers. Fast, secure, and built for scale.
      </p>

      {/* Mode Tabs */}
      <div className="mode-tabs">
        <button
          type="button"
          className={`mode-tab ${mode === "shorten" ? "active" : ""}`}
          onClick={() => switchMode("shorten")}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07l-1.41 1.41" />
            <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 1 0 7.07 7.07l1.41-1.41" />
          </svg>
          Short Link
        </button>
        <button
          type="button"
          className={`mode-tab ${mode === "qr" ? "active" : ""}`}
          onClick={() => switchMode("qr")}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <line x1="14" y1="14" x2="14" y2="21" />
            <line x1="21" y1="14" x2="21" y2="21" />
            <line x1="14" y1="17.5" x2="21" y2="17.5" />
          </svg>
          QR Code
        </button>
      </div>

      {/* Main Glass Workspace Box */}
      <div
        className="glass-card theme-shorten"
        style={{
          background: "#121215",
          border: "1px solid rgba(139, 92, 246, 0.15)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Environment Ambient Purple Backdrop */}
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

        {mode === "shorten" ? (
          /* ==========================================
             LINK SHORTENER SIDE
             ========================================== */
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-primary)" }} />
              <p style={{ color: "var(--text-dim)", fontSize: "14.5px", margin: 0 }}>
                Paste your long URL down below.
              </p>
            </div>

            <div className="input-row">
              <div className="input-wrapper main-url-field">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07l-1.41 1.41" />
                    <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 1 0 7.07 7.07l1.41-1.41" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="https://example.com/very-long-url-here"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="input-wrapper alias-field">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="9" x2="20" y2="9" />
                    <line x1="4" y1="15" x2="20" y2="15" />
                    <line x1="10" y1="3" x2="8" y2="21" />
                    <line x1="16" y1="3" x2="14" y2="21" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Custom alias (optional)"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button onClick={handleShorten} disabled={loading || !url} className="shorten-btn">
                {loading ? "..." : (
                  <>
                    Shorten
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {shortUrl && (
              <div className="result-box">
                <div className="result-content">
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="short-link">
                    {shortUrl}
                  </a>
                  <button onClick={handleCopy} style={buttonStyle}>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* ==========================================
             QR CODE SIDE: REFACTORED SPLIT LAYOUT 
             ========================================== */
          <div className="card-split-container">
            {/* Left Box: Form Fields */}
            <div className="card-left-pane">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <div style={{ 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "50%", 
                  background: "rgba(139, 92, 246, 0.12)", 
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  color: "#8b5cf6"
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07l-1.41 1.41" />
                  </svg>
                </div>
                <p style={{ color: "var(--text-dim)", fontSize: "14.5px", margin: 0 }}>
                  Enter routing link for your live QR asset
                </p>
              </div>

              <div className="vertical-input-group">
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07l-1.41 1.41" />
                      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 1 0 7.07 7.07l1.41-1.41" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="https://example.com/link-to-encode"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    style={{ background: "#09090b", border: "1px solid rgba(255, 255, 255, 0.08)", color: "#ffffff", width: "100%" }}
                  />
                </div>

                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="9" x2="20" y2="9" />
                      <line x1="4" y1="15" x2="20" y2="15" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Custom alias (optional)"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    disabled={loading}
                    style={{ background: "#09090b", border: "1px solid rgba(255, 255, 255, 0.08)", color: "#ffffff", width: "100%" }}
                  />
                </div>

                <button
                  onClick={handleShorten}
                  disabled={loading || !url}
                  style={{
                    background: "linear-gradient(100deg, #8b5cf6 0%, #b9a6f9 100%)",
                    color: "#0c0a12",
                    width: "100%",
                    boxShadow: "0 4px 20px rgba(139, 92, 246, 0.25)",
                    transition: "all 0.3s ease",
                    padding: "14px",
                    borderRadius: "12px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  {loading ? "..." : (
                    <>
                      Generate QR
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Box: Live Canvas/Demo Preview Wrapper */}
            <div className="card-right-pane">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <div className="qr-image-wrapper" style={{ 
                  background: "#ffffff", 
                  padding: "12px", 
                  borderRadius: "16px",
                  opacity: qrDataUrl ? 1 : 0.12,
                  transition: "all 0.3s ease"
                }}>
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR asset" style={{ width: "125px", height: "125px", display: "block" }} />
                  ) : (
                    /* Clean default template matrix placeholder graphic */
                    <svg width="125" height="125" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5">
                      <rect x="2" y="2" width="6" height="6" />
                      <rect x="16" y="2" width="6" height="6" />
                      <rect x="2" y="16" width="6" height="6" />
                      <rect x="9" y="9" width="6" height="6" />
                      <path d="M19 19h.01M16 19h.01M19 16h.01" strokeLinecap="round" strokeWidth="2"/>
                    </svg>
                  )}
                </div>

                {/* Bottom interactive items appear dynamically inside right panel when generated */}
                {qrDataUrl && (
                  <div style={{ marginTop: "16px", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="qr-link-text" style={{ color: "#a78bfa", textDecoration: "none", fontSize: "13px", marginBottom: "12px", display: "block" }}>
                      {shortUrl}
                    </a>
                    <button onClick={handleDownloadQR} style={buttonStyle}>
                      Download QR
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="feature-strip">
          <span className="feature-strip-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure & Reliable
          </span>
          <span className="feature-strip-divider" />
          <span className="feature-strip-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
            Instant Shortening
          </span>
          <span className="feature-strip-divider" />
          <span className="feature-strip-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="20" x2="12" y2="10" />
              <line x1="18" y1="20" x2="18" y2="4" />
              <line x1="6" y1="20" x2="6" y2="16" />
            </svg>
            Track & Analyze
          </span>
        </div>
      </div>

      <section className="benefits-section">
        <div className="benefits-header">
          <div className="benefits-heading">
            <span className="eyebrow">Why SwiftLink</span>
            <h2>Built <span>for Speed</span>. Designed<br />for <span>Control</span>.</h2>
          </div>
          <p className="benefits-subtext">
            Every link you shorten is built to move fast, stay yours, and tell you exactly how it performed.
          </p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
              </svg>
            </div>
            <h3>Instant Shortening</h3>
            <p>Paste a link and get a short URL back in milliseconds. No delays, no loading screens, no waiting around.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="9" x2="20" y2="9" />
                <line x1="4" y1="15" x2="20" y2="15" />
                <line x1="10" y1="3" x2="8" y2="21" />
                <line x1="16" y1="3" x2="14" y2="21" />
              </svg>
            </div>
            <h3>Custom Aliases</h3>
            <p>Pick your own ending instead of a random string, so the links you share actually look like yours.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="6" y1="20" x2="6" y2="16" />
              </svg>
            </div>
            <h3>Click Analytics</h3>
            <p>See exactly how many people clicked, and when, so you know what's actually working.</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <span className="eyebrow">Everything You Need</span>
        <h2>One Tool for <span>Every Link</span><br />You Ever Share</h2>
        <p className="features-subtext">
          From quick one-off links to long-term campaigns, SwiftLink gives you the controls to manage every link with confidence.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
            </div>
            <h4>Link Expiration</h4>
            <p>Set links to expire automatically after a set time, so temporary content doesn't outlive its purpose.</p>
          </div>

          <div className="feature-card">
            <div className="feature-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
              </svg>
            </div>
            <h4>User Dashboard</h4>
            <p>See and manage every link you've created in one place, all organized and ready when you need them.</p>
          </div>

          <div className="feature-card">
            <div className="feature-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <line x1="14" y1="14" x2="14" y2="21" />
                <line x1="21" y1="14" x2="21" y2="21" />
                <line x1="14" y1="17.5" x2="21" y2="17.5" />
              </svg>
            </div>
            <h4>QR Code Generation</h4>
            <p>Generate a scannable QR code for any shortened link, perfect for print materials and offline sharing.</p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h2 className="footer-logo">
              <span style={{ color: "var(--accent-primary)" }}>Swift</span>
              <span style={{ color: "#ffffff" }}>Link</span>
            </h2>
            <p className="footer-tagline">
              A professional link management tool built for modern developers. Fast, secure, and built for scale.
            </p>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Menu</h3>
            <a className="footer-link" href="/">Home</a>
            <a className="footer-link" href="/dashboard">Dashboard</a>
            <a className="footer-link" href="/login">Login</a>
            <a className="footer-link" href="/register">Register</a>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Ready to start?</h3>
            <p className="footer-cta-text">
              Create your first shortened link in seconds. No credit card, no setup, just paste and go.
            </p>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Legal</h3>
            <a className="footer-link" href="#">Terms & Conditions</a>
            <a className="footer-link" href="#">Privacy Policy</a>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} SwiftLink. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stats/:shortId" element={<Stats />} />
        <Route path="/mydashboard" element={<MyDashboard />} />
      </Routes>
    </Router>
  );
}