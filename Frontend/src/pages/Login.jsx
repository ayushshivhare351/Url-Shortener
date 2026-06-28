import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/mydashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="auth-page">
      <div className="hero-glow" aria-hidden="true" />

      <span className="eyebrow">Welcome Back</span>

      <h1 style={{ fontSize: "2.4rem", marginBottom: "8px" }}>
        Log in to <span>SwiftLink</span>
      </h1>

      <p className="subtitle" style={{ marginBottom: "30px" }}>
        Pick up right where you left off and manage all your links in one place.
      </p>

      <div
        className="glass-card auth-card"
        style={{ background: "#121215", border: "1px solid rgba(255, 255, 255, 0.05)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
      >
        <div className="auth-input-group">
          <div className="input-wrapper">
            <span className="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 6 12 13 2 6" />
                <path d="M2 6h20v12H2z" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ background: "#09090b", border: "1px solid rgba(255, 255, 255, 0.08)", color: "#ffffff" }}
            />
          </div>

          <div className="input-wrapper">
            <span className="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ background: "#09090b", border: "1px solid rgba(255, 255, 255, 0.08)", color: "#ffffff" }}
            />
          </div>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button
          className="btn-gradient-purple-white"
          onClick={handleLogin}
          disabled={loading || !email || !password}
        >
          {loading ? "Logging in..." : (
            <>
              Login
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </>
          )}
        </button>

        <p className="auth-switch-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}