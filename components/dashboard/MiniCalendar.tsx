"use client";
import { useState } from "react";

const VAC_DAYS  = [19, 20, 21, 22, 23];
const EVENT_DAYS = [8, 5];
const TODAY = 23;
const FIRST_DAY = 4; // Mayo 2026 empieza en viernes (índice Mon-based)
const DAYS_IN_MONTH = 31;
const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

export default function MiniCalendar() {
  const [hoverDay, setHoverDay] = useState<number | null>(null);

  const cells: (number | null)[] = [
    ...Array(FIRST_DAY).fill(null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];

  return (
    <div style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(16px) saturate(160%)", WebkitBackdropFilter: "blur(16px) saturate(160%)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.9)", overflow: "hidden", boxShadow: "0 1px 4px rgba(28,43,74,0.06)" }}>
      <div style={{ padding: "18px 22px 12px", borderBottom: "1px solid #EAEDF2" }}>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#1E2A4A" }}>Mayo 2026</span>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "12px 16px 4px" }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "10px", color: "#6B83A8", fontWeight: 600, textTransform: "uppercase" }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", padding: "4px 16px 16px" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const isToday   = day === TODAY;
          const isVac     = VAC_DAYS.includes(day);
          const hasEvent  = EVENT_DAYS.includes(day);
          const isHover   = hoverDay === day;

          return (
            <div
              key={i}
              onMouseEnter={() => setHoverDay(day)}
              onMouseLeave={() => setHoverDay(null)}
              style={{
                aspectRatio: "1", borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", cursor: "pointer", position: "relative",
                transition: "all .15s",
                background: isToday ? "#0F9DA6" : isVac ? "rgba(15,157,166,0.10)" : isHover ? "#FFFFFF" : "transparent",
                color: isToday ? "#1E2A4A" : isVac ? "#0F9DA6" : "#5C6579",
                fontWeight: isToday ? 700 : 400,
                transform: isHover && !isToday ? "scale(1.15)" : "scale(1)",
              }}
            >
              {day}
              {hasEvent && !isToday && (
                <div style={{
                  position: "absolute", bottom: "3px", left: "50%",
                  transform: "translateX(-50%)", width: "4px", height: "4px",
                  borderRadius: "50%", background: "#C0392B",
                }}/>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", padding: "0 18px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0F9DA6" }}/>
          <span style={{ fontSize: "10px", color: "#6B83A8" }}>Vacaciones</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C0392B" }}/>
          <span style={{ fontSize: "10px", color: "#6B83A8" }}>Retardo</span>
        </div>
      </div>
    </div>
  );
}
