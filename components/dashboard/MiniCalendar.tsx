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
    <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1.5px solid #D7D9D2", overflow: "hidden", boxShadow: "0 1px 4px rgba(10,22,40,0.06)" }}>
      <div style={{ padding: "18px 22px 12px", borderBottom: "1px solid #F1F2ED" }}>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#1C2B39" }}>Mayo 2026</span>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "12px 16px 4px" }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "10px", color: "#5A7896", fontWeight: 600, textTransform: "uppercase" }}>{d}</div>
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
                background: isToday ? "#C9A227" : isVac ? "rgba(0,180,216,0.10)" : isHover ? "#F1F2ED" : "transparent",
                color: isToday ? "#1C2B39" : isVac ? "#C9A227" : "#3B4B5C",
                fontWeight: isToday ? 700 : 400,
                transform: isHover && !isToday ? "scale(1.15)" : "scale(1)",
              }}
            >
              {day}
              {hasEvent && !isToday && (
                <div style={{
                  position: "absolute", bottom: "3px", left: "50%",
                  transform: "translateX(-50%)", width: "4px", height: "4px",
                  borderRadius: "50%", background: "#B23A2E",
                }}/>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", padding: "0 18px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C9A227" }}/>
          <span style={{ fontSize: "10px", color: "#5A7896" }}>Vacaciones</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#B23A2E" }}/>
          <span style={{ fontSize: "10px", color: "#5A7896" }}>Retardo</span>
        </div>
      </div>
    </div>
  );
}
