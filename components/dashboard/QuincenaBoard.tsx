"use client";
import { useEffect, useState } from "react";

const TOTAL_HORAS = 96;
const TRABAJADAS  = 67;

export default function QuincenaBoard() {
  const [animated, setAnimated] = useState(0);

  const progress       = TRABAJADAS / TOTAL_HORAS;
  const pct            = Math.round(progress * 100);
  const horasRestantes = TOTAL_HORAS - TRABAJADAS;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(progress), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#1E2A4A" }}>
          Quincena en progreso <span style={{ color: "#6B83A8", fontWeight: 500 }}>· 1–15 Mayo</span>
        </span>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#0F9DA6" }}>
          {pct}% · {horasRestantes}h restantes
        </span>
      </div>
      <div style={{ height: "8px", borderRadius: "5px", background: "#EAF1F4", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: "5px",
          background: "linear-gradient(90deg,#17B3C2,#0F9DA6)",
          width: `${animated * 100}%`,
          transition: "width 1.8s cubic-bezier(0.34,1.56,0.64,1)",
        }}/>
      </div>
    </div>
  );
}
