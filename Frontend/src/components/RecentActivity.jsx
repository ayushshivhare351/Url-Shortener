function Badge({ children, tone }) {
  const tones = {
    purple: { bg: "rgba(139,92,246,0.12)", color: "#c4b5fd", border: "rgba(139,92,246,0.25)" },
    cyan: { bg: "rgba(34,211,238,0.12)", color: "#67e8f9", border: "rgba(34,211,238,0.25)" }
  };
  const t = tones[tone] || tones.purple;

  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "0.75rem",
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: "999px",
        background: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`
      }}
    >
      {children}
    </span>
  );
}

export default function RecentActivity({ clicks, limit = 5 }) {
  const visibleClicks = clicks.slice(0, limit);

  return (
    <div
      style={{
        background: "#121217",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "20px",
        padding: "22px"
      }}
    >
      <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#e4e4e7", margin: "0 0 16px" }}>
        Recent activity
      </h3>

      {visibleClicks.length === 0 ? (
        <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0 }}>
          No activity yet — clicks will show up here.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Time", "Device", "Browser"].map((h) => (
                  <th
                    key={h}
                    align="left"
                    style={{
                      paddingBottom: "10px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "#6b7280",
                      borderBottom: "1px solid rgba(255,255,255,0.06)"
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {visibleClicks.map((click, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom:
                      index === visibleClicks.length - 1 ? "none" : "1px solid rgba(255,255,255,0.04)"
                  }}
                >
                  <td style={{ padding: "12px 0", fontSize: "0.85rem", color: "#a1a1aa" }}>
                    {new Date(click.clickedAt).toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 8px 12px 0" }}>
                    <Badge tone="purple">{click.device}</Badge>
                  </td>
                  <td style={{ padding: "12px 0" }}>
                    <Badge tone="cyan">{click.browser}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}