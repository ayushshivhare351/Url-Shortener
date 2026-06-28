import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "28px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>
        <span style={{ color: "#8b5cf6" }}>Swift</span>
        <span style={{ color: "#ffffff" }}>Link</span>
      </h2>

      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        <Link style={linkStyle} to="/">Home</Link>
        <Link style={linkStyle} to="/dashboard">Dashboard</Link>

        {token ? (
          <>
            <Link style={linkStyle} to="/mydashboard">My Dashboard</Link>
            <button style={buttonStyle} onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link style={linkStyle} to="/login">Login</Link>
            <Link style={buttonStyle} to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "#9ca3af",
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "0.95rem",
  transition: "color 0.2s",
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