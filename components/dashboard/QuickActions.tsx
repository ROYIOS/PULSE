"use client";
import { useState } from "react";
import { Calendar, FileText, ListChecks, ChevronRight } from "lucide-react";

interface Props {
  onVacaciones: () => void;
  onRetardo: () => void;
}

export default function QuickActions({ onVacaciones, onRetardo }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const actions = [
    { icon: Calendar,  label: "Solicitar vacaciones", sub: "12 días disponibles",    color: "#00B4D8", bg: "rgba(0,180,216,0.10)", fn: onVacaciones },
    { icon: FileText,  label: "Generar formato retardo", sub: "Jue 22 mayo pendiente", color: "#D85A30", bg: "rgba(216,90,48,0.10)",  fn: onRetardo },
    { icon: ListChecks,label: "Ver mis solicitudes",  sub: "1 en revisión",          color: "#0F6E56", bg: "rgba(15,110,86,0.10)",  fn: () => {} },
  ];

  return (
    <div style={{ background: "#FFFFFF", borderRadius: "14px", border: "1.5px solid #D8E6F0", overflow: "hidden", boxShadow: "0 1px 4px rgba(10,22,40,0.06)" }}>
      <div style={{ padding: "18px 22px", borderBottom: "1px solid #D8E6F0" }}>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628" }}>Acciones rápidas</span>
      </div>
      {actions.map(({ icon: Icon, label, sub, color, bg, fn }, i) => (
        <div
          key={i}
          onClick={fn}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: "14px 22px", cursor: "pointer",
            background: hover === i ? "#F8FBFF" : "transparent",
            borderBottom: i < actions.length - 1 ? "1px solid #F4F8FB" : "none",
            transition: "background .15s",
          }}
        >
          <div style={{
            width: "38px", height: "38px", borderRadius: "10px",
            background: bg, display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0,
            transition: "transform .2s cubic-bezier(0.34,1.56,0.64,1)",
            transform: hover === i ? "scale(1.08)" : "scale(1)",
          }}>
            <Icon size={17} color={color}/>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "13.5px", fontWeight: 500, color: "#0A1628", margin: 0 }}>{label}</p>
            <p style={{ fontSize: "11.5px", color: "#8BA3BF", margin: 0, marginTop: "2px" }}>{sub}</p>
          </div>
          <ChevronRight size={14} color="#8BA3BF" style={{ transition: "transform .2s", transform: hover === i ? "translateX(3px)" : "translateX(0)" }}/>
        </div>
      ))}
    </div>
  );
}
