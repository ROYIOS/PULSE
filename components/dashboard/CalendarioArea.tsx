"use client";
import { useState, useEffect } from "react";
import { EMPLEADOS, VAC_DEFAULT } from "@/lib/pulseData";

const AREAS = ["Logística", "Ventas", "Finanzas", "CxC", "RH", "Planta A", "Planta B", "Producción"];

type EventoDia = { dia: number; nombre: string; tipo: "vacaciones" | "retardo" | "turno"; color: string };

const EVENTS_BASE: Record<string, EventoDia[]> = {
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

/** M6: agrega al calendario las vacaciones ya aprobadas (localStorage), ubicadas en el área real del empleado. */
function useEventsConVacacionesReales() {
  const [events, setEvents] = useState(EVENTS_BASE);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pulse_vacaciones");
      const vacaciones: typeof VAC_DEFAULT = raw ? JSON.parse(raw) : VAC_DEFAULT;
      const merged: Record<string, EventoDia[]> = JSON.parse(JSON.stringify(EVENTS_BASE));

      vacaciones
        .filter(v => v.status === "aprobada")
        .forEach(v => {
          const emp = EMPLEADOS.find(e => e.nombre === v.empleado);
          const area = emp?.area || "RH";
          if (!merged[area]) merged[area] = [];
          const d1 = new Date(v.inicio + "T00:00:00");
          const d2 = new Date(v.fin + "T00:00:00");
          for (let d = new Date(d1); d <= d2; d.setDate(d.getDate() + 1)) {
            merged[area].push({
              dia: d.getDate(), nombre: v.empleado.split(" ")[0] + " " + (v.empleado.split(" ")[1]?.[0] || "") + ".",
              tipo: "vacaciones", color: "#0F9DA6",
            });
          }
        });

      setEvents(merged);
    } catch(_) {
      setEvents(EVENTS_BASE);
    }
  }, []);

  return events;
}

const DAYS   = ["L","M","X","J","V","S","D"];
const FIRST  = 4; // Mayo 2026
const TOTAL  = 31;

export default function CalendarioArea() {
  const [areaSeleccionada, setAreaSeleccionada] = useState("Logística");
  const [hoverDay, setHoverDay] = useState<number | null>(null);

  const EVENTS = useEventsConVacacionesReales();
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
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #DDE1EA" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1E2A4A" }}>Calendario por Área</span>
          <span style={{ fontSize: "10px", color: "#6B83A8" }}>Mayo 2026</span>
        </div>

        {/* Selector de área */}
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {AREAS.map(a => (
            <button key={a} onClick={() => setAreaSeleccionada(a)} style={{
              padding: "3px 9px", borderRadius: "20px", fontSize: "9.5px",
              fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              border: areaSeleccionada === a ? "1.5px solid #0F9DA6" : "1.5px solid #DDE1EA",
              background: areaSeleccionada === a ? "rgba(15,157,166,0.10)" : "transparent",
              color: areaSeleccionada === a ? "#0F9DA6" : "#6B83A8",
              transition: "all .2s",
            }}>{a}</button>
          ))}
        </div>
      </div>

      {/* Mosaico compacto (mismo lenguaje visual que Gerencia) */}
      <div style={{ padding: "12px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px", marginBottom: "3px" }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: "8.5px", color: "#6B83A8", fontWeight: 600 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "4px" }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} style={{ width: "100%", aspectRatio: "1" }}/>;
            const isToday   = day === 23;
            const dayEvents = eventMap[day] || [];
            const isHover   = hoverDay === day;
            const color     = dayEvents[0]?.color;
            const titulo    = dayEvents.map(e => `${e.nombre} (${e.tipo})`).join(", ");

            return (
              <div key={i}
                title={titulo || undefined}
                onMouseEnter={() => setHoverDay(day)}
                onMouseLeave={() => setHoverDay(null)}
                style={{
                  width: "100%", aspectRatio: "1", borderRadius: "5px",
                  cursor: dayEvents.length > 0 ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isToday
                    ? "linear-gradient(135deg, #17B3C2, #0F9DA6)"
                    : color
                    ? `${color}26`
                    : isHover ? "#F1F4F8" : "#F8FAFC",
                  border: color && !isToday ? `1.5px solid ${color}55` : "1px solid transparent",
                  transform: isHover ? "scale(1.12)" : "scale(1)",
                  transition: "transform .15s ease, background .15s ease",
                  fontSize: "8.5px", fontWeight: isToday ? 700 : 500,
                  color: isToday ? "#FFFFFF" : color || "#9AA7B8",
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leyenda */}
      <div style={{
        display: "flex", gap: "12px", padding: "10px 16px",
        borderTop: "1px solid #EAEDF2", flexWrap: "wrap",
      }}>
        {[
          { color: "#0F9DA6", label: "Vacaciones" },
          { color: "#C0392B", label: "Retardo" },
          { color: "#2D4A7A", label: "Turno" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "2px", background: color }}/>
            <span style={{ fontSize: "9px", color: "#6B83A8" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
