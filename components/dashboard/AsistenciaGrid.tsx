"use client";

interface Props {
  title?: string;
  // weeks: array de semanas, cada una un array de booleans (true = asistió a tiempo)
  weeks: boolean[][];
  weekLabels?: string[];
}

export default function AsistenciaGrid({ title = "Cuadrícula de asistencia", weeks, weekLabels }: Props) {
  return (
    <div>
      <div style={{
        fontSize: "11px", fontWeight: 700, color: "#1E2A4A",
        textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px",
      }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ width: "56px", fontSize: "10px", color: "#6B83A8", flexShrink: 0 }}>
              {weekLabels?.[wi] ?? `Sem ${wi + 1}`}
            </span>
            {week.map((ok, di) => (
              <span
                key={di}
                style={{
                  width: "16px", height: "16px", borderRadius: "5px",
                  background: ok
                    ? "linear-gradient(135deg, #17B3C2, #0F9DA6)"
                    : "#EAF1F4",
                  transition: "transform .15s ease",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
