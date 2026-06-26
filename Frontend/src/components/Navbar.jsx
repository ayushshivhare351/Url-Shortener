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
        width: "90%",
        maxWidth: "1100px",
        margin: "20px auto",
        padding: "16px 28px",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ margin: 0 }}>
        <span style={{ color: "#7c5cff" }}>Swift</span>Link
      </h2>

      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>

        <Link style={linkStyle} to="/">Home</Link>

        <Link style={linkStyle} to="/dashboard">
          Dashboard
        </Link>

        {token ? (
          <>
            <Link style={linkStyle} to="/mydashboard">
              My Dashboard
            </Link>

            <button style={buttonStyle} onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link style={linkStyle} to="/login">
              Login
            </Link>

            <Link style={buttonStyle} to="/register">
              Register
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: 500,
};

const buttonStyle = {
  background: "#7c5cff",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
};