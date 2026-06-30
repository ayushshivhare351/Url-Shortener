import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import ClicksChart from "../components/ClicksChart";
import DeviceChart from "../components/DeviceChart";
import BrowserChart from "../components/BrowserChart";
import RecentActivity from "../components/RecentActivity";

function Details({ shortId, totalClicks, uniqueVisitors, longUrl }) {
  const rows = [
    { label: "Short ID", value: shortId, icon: "🔗" },
    { label: "Total clicks", value: totalClicks, icon: "📈" },
    { label: "Unique visitors", value: uniqueVisitors, icon: "👤" }
  ];

  return (
    <div
      style={{
        background: "#121217",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        height: "100%"
      }}
    >
      <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#e4e4e7", margin: 0 }}>
        Details
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, justifyContent: "space-between" }}>
        {rows.map((row) => (
          <div key={row.label} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                flexShrink: 0
              }}
            >
              {row.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#6b7280"
                }}
              >
                {row.label}
              </div>
              <div
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#fff",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {row.value}
              </div>
            </div>
          </div>
        ))}

        <div
          style={{
            paddingTop: "12px",
            borderTop: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#6b7280",
              marginBottom: "4px"
            }}
          >
            Destination
          </div>
          <div style={{ fontSize: "0.85rem", color: "#a1a1aa", wordBreak: "break-all" }}>
            {longUrl}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Stats() {
  const { shortId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/analytics/${shortId}`)
      .then((res) => setAnalytics(res.data))
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

  if (!analytics) {
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

      <span className="eyebrow">Link performance</span>

      <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "10px", textAlign: "center", color: "#fff" }}>
        Analytics
      </h1>

      <p
        className="subtitle"
        style={{ marginBottom: "30px", textAlign: "center", maxWidth: "480px" }}
      >
        A breakdown of how people are finding and clicking your link.
      </p>

      {/* Analytics */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "1080px",
          background: "#0e0e12",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          padding: "24px",
          borderRadius: "22px",
          overflow: "hidden"
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
            gridTemplateRows: "auto auto",
            gap: "20px",
            position: "relative"
          }}
        >
          {/* Top-left: Details, stretched to match the right column's top row */}
          <Details
            shortId={analytics.shortId}
            totalClicks={analytics.totalClicks}
            uniqueVisitors={analytics.uniqueVisitors}
            longUrl={analytics.longUrl}
          />

          {/* Top-right: Devices + Browsers stacked */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <DeviceChart devices={analytics.devices} />
            <BrowserChart browsers={analytics.browsers} />
          </div>

          {/* Bottom-left: Clicks over time */}
          <div style={{ height: "300px" }}>
            <ClicksChart daily={analytics.daily} />
          </div>

          {/* Bottom-right: Recent activity */}
          <RecentActivity clicks={analytics.recentClicks.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}