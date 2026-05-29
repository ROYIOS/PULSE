"use client";
import { useEffect, useRef, useState } from "react";
import { TitoSVG, useTito } from "./Tito";

const TOTAL_HORAS = 96;
const TRABAJADAS  = 67;

type Mode = "wave" | "push" | "work" | "otaku";

export default function QuincenaBoard() {
  const [animated, setAnimated] = useState(0);
  const [mode, setMode]         = useState<Mode>("push");
  const containerRef            = useRef<HTMLDivElement>(null);
  const tito                    = useTito(containerRef);

  const progress       = TRABAJADAS / TOTAL_HORAS;
  const pct            = Math.round(progress * 100);
  const horasRestantes = TOTAL_HORAS - TRABAJADAS;
  const diasRestantes  = Math.ceil(horasRestantes / 8);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(progress), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (pct >= 100)     setMode("wave");
    else if (pct >= 80) setMode("work");
    else                setMode("push");
  }, [pct]);

  const MODES: { key: Mode; label: string }[] = [
    { key:"wave",  label:"🫡 Saludar" },
    { key:"push",  label:"💪 Empujar" },
    { key:"work",  label:"⚡ Trabajo" },
    { key:"otaku", label:"👉👈 Otaku" },
  ];

  const msgMap: Record<Mode,string> = {
    wave:  pct >= 100 ? "¡Quincena completada!" : "¡A sus órdenes!",
    push:  `¡${horasRestantes}h por acortar!`,
    work:  `¡Ya casi! Solo ${horasRestantes}h más.`,
    otaku: "Concentración máxima... 👉👈",
  };

  return (
    <div
      ref={containerRef}
      style={{
        background:"#FFFFFF", borderRadius:"12px",
        border:"1.5px solid #D8E6F0", overflow:"hidden",
        boxShadow:"0 1px 4px rgba(10,22,40,0.06)",
        fontFamily:"'Plus Jakarta Sans', sans-serif",
        position:"relative",
      }}
    >
      {/* TITO */}
      <div style={{
        position:"absolute",
        left: tito.x - 26,
        top:  tito.y - 68,
        zIndex:10,
        pointerEvents:"none",
        willChange:"transform",
      }}>
        <TitoSVG
          size={52}
          mood={tito.mood}
          phase={tito.phase}
          dir={tito.dir}
          walkFrame={tito.walkFrame}
          jetFlicker={tito.jetFlicker}
        />
      </div>

      {/* Header */}
      <div style={{padding:"11px 18px 8px", borderBottom:"1px solid #F4F8FB"}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <span style={{fontSize:"12px", fontWeight:600, color:"#0A1628"}}>
            Quincena en progreso
          </span>
          <span style={{
            fontSize:"9px", padding:"2px 9px", borderRadius:"20px",
            background:"rgba(0,180,216,0.10)", color:"#00B4D8", fontWeight:600,
          }}>1–15 Mayo</span>
        </div>
        <p style={{fontSize:"10px", color:"#8BA3BF", marginTop:"2px"}}>
          {TRABAJADAS}h de {TOTAL_HORAS}h · {horasRestantes}h restantes ({diasRestantes} días)
        </p>
      </div>

      {/* Stats */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"6px", padding:"8px 18px 0"}}>
        {[
          {label:"Trabajadas",   value:`${TRABAJADAS}h`,    color:"#00B4D8"},
          {label:"Restantes",    value:`${horasRestantes}h`, color:"#D85A30"},
          {label:"Días hábiles", value:`${diasRestantes}`,   color:"#0F6E56"},
        ].map(s=>(
          <div key={s.label} style={{textAlign:"center"}}>
            <p style={{fontSize:"17px", fontWeight:700, color:s.color, margin:0, lineHeight:1}}>
              {s.value}
            </p>
            <p style={{fontSize:"8px", color:"#8BA3BF", textTransform:"uppercase",
              letterSpacing:".8px", marginTop:"2px"}}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Barra */}
      <div style={{padding:"12px 18px 0"}}>
        <div style={{height:"18px", borderRadius:"9px", background:"#D8E6F0",
          overflow:"hidden", position:"relative"}}>
          <div style={{
            height:"100%", borderRadius:"9px",
            background:"linear-gradient(90deg,#00B4D8,#0F6E56)",
            width:`${animated*100}%`,
            transition:"width 1.8s cubic-bezier(0.34,1.56,0.64,1)",
          }}/>
          {[25,50,75].map(m=>(
            <div key={m} style={{position:"absolute", top:0, bottom:0,
              left:`${m}%`, width:"1px",
              background:"rgba(255,255,255,.5)", zIndex:1}}/>
          ))}
        </div>
        <div style={{display:"flex", justifyContent:"space-between",
          alignItems:"center", marginTop:"5px", marginBottom:"8px"}}>
          <span style={{fontSize:"9px", color:"#8BA3BF"}}>0h</span>
          <span style={{fontSize:"11px", fontWeight:700, color:"#0A1628",
            background:"#F4F8FB", padding:"2px 10px", borderRadius:"20px",
            border:"1px solid #D8E6F0"}}>{pct}% completado</span>
          <span style={{fontSize:"9px", color:"#8BA3BF"}}>{TOTAL_HORAS}h</span>
        </div>
      </div>

      {/* Mensaje */}
      <div style={{margin:"0 18px 8px", padding:"7px 11px", borderRadius:"9px",
        background:"rgba(0,180,216,0.06)", border:"1px solid rgba(0,180,216,0.14)",
        display:"flex", alignItems:"center", gap:"7px"}}>
        <span style={{fontSize:"13px"}}>
          {mode==="wave"?"🫡":mode==="work"?"💪":mode==="otaku"?"✨":"⚡"}
        </span>
        <span style={{fontSize:"10px", color:"#4A6080"}}>{msgMap[mode]}</span>
      </div>

      {/* Selector */}
      <div style={{display:"flex", gap:"5px", padding:"0 18px 12px", flexWrap:"wrap"}}>
        {MODES.map(m=>(
          <button key={m.key} onClick={()=>setMode(m.key)} style={{
            padding:"3px 9px", borderRadius:"20px", fontSize:"9px",
            fontWeight:500, cursor:"pointer", fontFamily:"inherit",
            border:mode===m.key?"1.5px solid #00B4D8":"1.5px solid #D8E6F0",
            background:mode===m.key?"rgba(0,180,216,0.10)":"transparent",
            color:mode===m.key?"#00B4D8":"#8BA3BF", transition:"all .2s",
          }}>{m.label}</button>
        ))}
      </div>
    </div>
  );
}
