"use client";
import { useState } from "react";

const AREAS = ["Logística", "Ventas", "Finanzas", "CxC", "RH", "Planta A", "Planta B"];

const EVENTS: Record<string, { dia: number; nombre: string; tipo: "vacaciones" | "retardo" | "turno"; color: string }[]> = {
  "Logística": [
    { dia: 19, nombre: "M. García",   tipo: "vacaciones", color: "#0F9DA6" },
    { dia: 20, nombre: "M. García",   tipo: "vacaciones", color: "#0F9DA6" },
    { dia: 21, nombre: "M. García",   tipo: "vacaciones", color: "#0F9DA6" },
  ],
  "Ventas": [
    { dia: 22, nombre: "C. López",    tipo: "vacaciones", color: "#2E7D5B" },
    { dia: 23, nombre: "C. López",    tipo: "vacaciones", color: "#2E7D5B" },
    { dia: 8,  nombre: "A. Martínez", tipo: "retardo",    color: "#C0392B" },
  ],
  "Planta A": [
    { dia: 19, nombre: "Turno A",     tipo: "turno",      color: "#2D4A7A" },
    { dia: 20, nombre: "Turno A",     tipo: "turno",      color: "#2D4A7A" },
  ],
};

const DAYS   = ["L","M","X","J","V","S","D"];
const FIRST  = 4; // Mayo 2026
const TOTAL  = 31;

export default function CalendarioArea() {
  const [areaSeleccionada, setAreaSeleccionada] = useState("Logística");
  const [hoverDay, setHoverDay] = useState<number | null>(null);

  const events = EVENTS[areaSeleccionada] || [];
  const eventMap: Record<number, typeof events[0][]> = {};
  events.forEach(e => {
    if (!eventMap[e.dia]) eventMap[e.dia] = [];
    eventMap[e.dia].push(e);
  });

  const cells: (number | null)[] = [
    ...Array(FIRST).fill(null),
    ...Array.from({ length: TOTAL }, (_, i) => i + 1),
  ];

  return (
    <div style={{
      background: "rgba(255,255,255,0.72)", backdropFilter: "blur(16px) saturate(160%)", WebkitBackdropFilter: "blur(16px) saturate(160%)", borderRadius: "14px",
      border: "1px solid rgba(255,255,255,0.9)",
      boxShadow: "0 1px 4px rgba(28,43,74,0.06)", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "18px 22px", borderBottom: "1px solid #DDE1EA" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#1E2A4A" }}>Calendario por Área</span>
          <span style={{ fontSize: "11px", color: "#6B83A8" }}>Mayo 2026</span>
        </div>

        {/* Selector de área */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {AREAS.map(a => (
            <button key={a} onClick={() => setAreaSeleccionada(a)} style={{
              padding: "5px 12px", borderRadius: "20px", fontSize: "11px",
              fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              border: areaSeleccionada === a ? "1.5px solid #0F9DA6" : "1.5px solid #DDE1EA",
              background: areaSeleccionada === a ? "rgba(0,180,216,0.10)" : "transparent",
              color: areaSeleccionada === a ? "#0F9DA6" : "#6B83A8",
              transition: "all .2s",
            }}>{a}</button>
          ))}
        </div>
      </div>

      {/* Calendario */}
      <div style={{ padding: "16px 18px" }}>
        {/* Headers días */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: "4px" }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: "10px", color: "#6B83A8", fontWeight: 600, textTransform: "uppercase", padding: "4px 0" }}>{d}</div>
          ))}
        </div>

        {/* Grid días */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "3px" }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i}/>;
            const isToday   = day === 23;
            const dayEvents = eventMap[day] || [];
            const isHover   = hoverDay === day;
            const hasVac    = dayEvents.some(e => e.tipo === "vacaciones");
            const hasRet    = dayEvents.some(e => e.tipo === "retardo");
            const hasTurno  = dayEvents.some(e => e.tipo === "turno");

            return (
              <div key={i}
                onMouseEnter={() => setHoverDay(day)}
                onMouseLeave={() => setHoverDay(null)}
                style={{
                  borderRadius: "8px", padding: "6px 4px",
                  minHeight: "44px", cursor: dayEvents.length > 0 ? "pointer" : "default",
                  background: isToday ? "#0F9DA6"
                    : hasVac   ? "rgba(0,180,216,0.08)"
                    : hasRet   ? "rgba(216,90,48,0.07)"
                    : hasTurno ? "rgba(26,58,107,0.07)"
                    : isHover  ? "#FFFFFF"
                    : "transparent",
                  border: isToday ? "none" : "1px solid transparent",
                  transition: "all .15s",
                  position: "relative",
                }}
              >
                <div style={{
                  fontSize: "11px", fontWeight: isToday ? 700 : 400,
                  color: isToday ? "#1E2A4A" : "#5C6579",
                  textAlign: "center", marginBottom: "2px",
                }}>{day}</div>

                {/* Event dots */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "0 2px" }}>
                  {dayEvents.slice(0, 2).map((e, ei) => (
                    <div key={ei} style={{
                      fontSize: "8px", color: "#FFFFFF", fontWeight: 600,
                      background: e.color, borderRadius: "3px",
                      padding: "1px 3px", lineHeight: 1.3,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{e.nombre}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leyenda */}
      <div style={{
        display: "flex", gap: "16px", padding: "12px 22px",
        borderTop: "1px solid #EAEDF2", flexWrap: "wrap",
      }}>
        {[
          { color: "#0F9DA6", label: "Vacaciones" },
          { color: "#C0392B", label: "Retardo" },
          { color: "#2D4A7A", label: "Turno especial" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "2px", background: color }}/>
            <span style={{ fontSize: "10px", color: "#6B83A8" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
