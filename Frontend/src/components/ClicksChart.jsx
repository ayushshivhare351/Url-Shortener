import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function ClicksChart({ daily }) {
  const data = {
    labels: (daily || []).map((item) =>
      new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    ),
    datasets: [
      {
        data: (daily || []).map((item) => item.clicks),
        borderColor: "#8b5cf6",
        backgroundColor: (ctx) => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return "rgba(139,92,246,0.2)";
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(139,92,246,0.35)");
          gradient.addColorStop(1, "rgba(139,92,246,0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#8b5cf6",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1c1c22",
        borderColor: "rgba(139,92,246,0.35)",
        borderWidth: 1,
        titleColor: "#f4f4f5",
        titleFont: { size: 12, weight: 600 },
        bodyColor: "#a78bfa",
        bodyFont: { size: 13, weight: 600 },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} click${ctx.parsed.y === 1 ? "" : "s"}`
        }
      }
    },
    scales: {
      x: {
        border: { display: false },
        ticks: { color: "#6b7280", font: { size: 11 } },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        ticks: { color: "#6b7280", font: { size: 11 }, precision: 0, padding: 8 },
        grid: { color: "rgba(255,255,255,0.04)" }
      }
    }
  };

  const total = (daily || []).reduce((sum, d) => sum + d.clicks, 0);

  return (
    <div
      style={{
        background: "#121217",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "20px",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "100%"
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#e4e4e7", margin: 0 }}>
            Clicks over time
          </h3>
          <p style={{ fontSize: "0.78rem", color: "#6b7280", margin: "2px 0 0" }}>
            Last {(daily || []).length} days
          </p>
        </div>
        <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff" }}>{total}</span>
      </div>

      <div style={{ flex: 1, minHeight: "200px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
