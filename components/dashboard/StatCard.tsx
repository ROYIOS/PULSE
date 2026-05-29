"use client";
import { useState } from "react";

interface Props {
  label: string;
  value: string;
  sub: string;
  color: string;
  progress: number;
}

export default function StatCard({ label, value, sub, color, progress }: Props) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#FFFFFF",
        border: `1.5px solid ${hover ? color : "#D8E6F0"}`,
        borderRadius: "14px", padding: "22px 20px",
        boxShadow: hover ? `0 8px 24px rgba(0,0,0,0.08)` : "0 1px 4px rgba(10,22,40,0.06)",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        transition: "all .25s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "default",
      }}
    >
      <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#8BA3BF", fontWeight: 600, marginBottom: "10px" }}>
        {label}
      </p>
      <p style={{ fontSize: "36px", fontWeight: 700, color, lineHeight: 1, margin: 0 }}>
        {value}
      </p>
      <p style={{ fontSize: "12px", color: "#8BA3BF", marginTop: "6px" }}>{sub}</p>
      <div style={{ height: "3px", borderRadius: "2px", background: "#D8E6F0", marginTop: "16px", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: "2px",
          background: color, width: `${progress}%`,
          transition: "width 1s ease",
        }}/>
      </div>
    </div>
  );
}