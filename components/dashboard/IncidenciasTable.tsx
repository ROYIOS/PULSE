"use client";

const data = [
  { fecha: "Hoy, 23 May",  dia: "Sábado",    entrada: "07:58", salida: "—",     hrs: "—",     estado: "ok",     label: "A tiempo" },
  { fecha: "Jue, 22 May",  dia: "Jueves",    entrada: "08:22", salida: "17:05", hrs: "8h 43m", estado: "late",  label: "Retardo"  },
  { fecha: "Mié, 21 May",  dia: "Miércoles", entrada: "07:55", salida: "17:01", hrs: "9h 06m", estado: "ok",    label: "A tiempo" },
  { fecha: "Mar, 20 May",  dia: "Martes",    entrada: "07:59", salida: "17:03", hrs: "9h 04m", estado: "ok",    label: "A tiempo" },
  { fecha: "Lun, 19 May",  dia: "Lunes",     entrada: "08:31", salida: "17:00", hrs: "8h 29m", estado: "late",  label: "Retardo"  },
  { fecha: "Vie, 16 May",  dia: "Viernes",   entrada: "07:57", salida: "17:02", hrs: "9h 05m", estado: "ok",    label: "A tiempo" },
];

const badge: Record<string, { bg: string; color: string }> = {
  ok:   { bg: "#E1F5EE", color: "#2F6B4F" },
  late: { bg: "#FAEEDA", color: "#854F0B" },
  absent: { bg: "#FCEBEB", color: "#A32D2D" },
};

export default function IncidenciasTable() {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1.5px solid #D7D9D2", overflow: "hidden", boxShadow: "0 1px 4px rgba(10,22,40,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid #D7D9D2" }}>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#1C2B39" }}>Incidencias recientes</span>
        <span style={{ fontSize: "12px", color: "#C9A227", cursor: "pointer", fontWeight: 500 }}>Ver todo →</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#F1F2ED" }}>
            {["Fecha", "Entrada", "Salida", "Hrs", "Estado"].map(h => (
              <th key={h} style={{ padding: "10px 22px", textAlign: "left", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#5A7896", fontWeight: 600, borderBottom: "1px solid #D7D9D2" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < data.length - 1 ? "1px solid #F1F2ED" : "none", transition: "background .15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#F8FBFF"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
            >
              <td style={{ padding: "14px 22px", fontSize: "13px", color: "#1C2B39", fontWeight: 500 }}>{row.fecha}</td>
              <td style={{ padding: "14px 22px", fontSize: "13px", color: "#3B4B5C" }}>{row.entrada}</td>
              <td style={{ padding: "14px 22px", fontSize: "13px", color: "#3B4B5C" }}>{row.salida}</td>
              <td style={{ padding: "14px 22px", fontSize: "13px", color: "#3B4B5C" }}>{row.hrs}</td>
              <td style={{ padding: "14px 22px" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
                  background: badge[row.estado].bg, color: badge[row.estado].color,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }}/>
                  {row.label}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}