"use client";

// Semanas de mayo 2026, día 23 = hoy
const WEEKS: { label: string; days: { day: number; status: "normal"|"vacaciones"|"retardo"|"hoy" }[] }[] = [
  { label: "Sem 1", days: [
    { day: 4, status: "normal" }, { day: 5, status: "retardo" }, { day: 6, status: "normal" },
    { day: 7, status: "normal" }, { day: 8, status: "retardo" },
  ]},
  { label: "Sem 2", days: [
    { day: 11, status: "normal" }, { day: 12, status: "normal" }, { day: 13, status: "normal" },
    { day: 14, status: "normal" }, { day: 15, status: "normal" },
  ]},
  { label: "Sem 3", days: [
    { day: 18, status: "normal" }, { day: 19, status: "vacaciones" }, { day: 20, status: "vacaciones" },
    { day: 21, status: "vacaciones" }, { day: 22, status: "vacaciones" },
  ]},
  { label: "Sem 4", days: [
    { day: 23, status: "hoy" }, { day: 25, status: "vacaciones" }, { day: 26, status: "normal" },
    { day: 27, status: "normal" }, { day: 28, status: "normal" },
  ]},
];

const COLORS: Record<string, string> = {
  normal: "#EAF1F4",
  vacaciones: "#0F9DA6",
  retardo: "#C0392B",
  hoy: "#1E2A4A",
};

export default function MiniCalendar() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.72)", backdropFilter: "blur(16px) saturate(160%)", WebkitBackdropFilter: "blur(16px) saturate(160%)",
      borderRadius: "14px", border: "1px solid rgba(255,255,255,0.9)",
      boxShadow: "0 1px 4px rgba(28,43,74,0.06)", padding: "18px 20px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#1E2A4A" }}>Mi calendario</span>
        <span style={{ fontSize: "10px", color: "#6B83A8" }}>Mayo 2026</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
        {WEEKS.map(week => (
          <div key={week.label} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ width: "40px", fontSize: "9.5px", color: "#6B83A8", flexShrink: 0 }}>{week.label}</span>
            {week.days.map(d => (
              <div
                key={d.day}
                title={`Día ${d.day}${d.status === "vacaciones" ? " · Vacaciones" : d.status === "retardo" ? " · Retardo" : ""}`}
                style={{
                  width: "18px", height: "18px", borderRadius: "5px",
                  background: d.status === "hoy" ? `linear-gradient(135deg, #17B3C2, #0F9DA6)` : COLORS[d.status],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "8px", fontWeight: d.status === "hoy" ? 700 : 500,
                  color: d.status === "hoy" ? "#FFFFFF" : d.status === "normal" ? "#9AA7B8" : "#FFFFFF",
                  cursor: "default",
                }}
              >
                {d.day}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "14px", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #EAEDF2" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "3px", background: "#0F9DA6" }}/>
          <span style={{ fontSize: "9.5px", color: "#6B83A8" }}>Vacaciones</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "3px", background: "#C0392B" }}/>
          <span style={{ fontSize: "9.5px", color: "#6B83A8" }}>Retardo</span>
        </div>
      </div>
    </div>
  );
}
