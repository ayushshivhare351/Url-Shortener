import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

const PALETTE = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#5b21b6", "#3b0764"];

export default function DeviceChart({ devices }) {
  const labels = Object.keys(devices || {});
  const values = Object.values(devices || {});
  const total = values.reduce((a, b) => a + b, 0);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: PALETTE,
        borderColor: "#121217",
        borderWidth: 3,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    cutout: "74%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1c1c22",
        borderColor: "rgba(139,92,246,0.35)",
        borderWidth: 1,
        bodyColor: "#e4e4e7",
        padding: 10,
        displayColors: true,
        boxPadding: 4
      }
    }
  };

  return (
    <div
      style={{
        background: "#121217",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px"
      }}
    >
      <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#e4e4e7", margin: 0 }}>
        Devices
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div style={{ width: "92px", height: "92px", flexShrink: 0 }}>
          <Doughnut data={data} options={options} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: 0 }}>
          {labels.length === 0 && (
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>No data yet</span>
          )}
          {labels.map((label, i) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "2px",
                    background: PALETTE[i % PALETTE.length],
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: "0.8rem", color: "#a1a1aa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {label}
                </span>
              </div>
              <span style={{ fontSize: "0.8rem", color: "#e4e4e7", fontWeight: 600 }}>
                {total ? Math.round((values[i] / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}