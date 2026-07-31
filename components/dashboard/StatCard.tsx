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
        background: hover ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.65)",
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        border: `1.5px solid ${hover ? color : "rgba(255,255,255,0.9)"}`,
        borderRadius: "16px", padding: "22px 20px",
        boxShadow: hover ? `0 16px 36px rgba(28,43,74,0.14)` : "0 1px 4px rgba(28,43,74,0.05)",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "all .3s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "default",
      }}
    >
      <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#6B83A8", fontWeight: 600, marginBottom: "10px" }}>
        {label}
      </p>
      <p style={{ fontSize: "36px", fontWeight: 600, color, lineHeight: 1, margin: 0, fontFamily: "'Manrope', sans-serif" }}>
        {value}
      </p>
      <p style={{ fontSize: "12px", color: "#6B83A8", marginTop: "6px" }}>{sub}</p>
      <div style={{ height: "3px", borderRadius: "2px", background: "#DDE1EA", marginTop: "16px", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: "2px",
          background: color, width: `${progress}%`,
          transition: "width 1s ease",
        }}/>
      </div>
    </div>
  );
}