"use client";
import { useState, useEffect } from "react";
import { EMPLEADOS } from "@/lib/pulseData";
import { UserPlus, UserMinus, Check } from "lucide-react";

interface Checklist {
  empleadoId: number; tipo: "alta"|"baja";
  items: Record<string, boolean>;
}

const ITEMS_ALTA = [
  "Contrato firmado", "Alta en IMSS", "Correo corporativo creado",
  "Equipo asignado (laptop/celular)", "Accesos a sistemas creados",
  "Capacitación de inducción", "Presentación al equipo",
];
const ITEMS_BAJA = [
  "Carta de renuncia/baja recibida", "Finiquito calculado", "Equipo devuelto",
  "Accesos a sistemas revocados", "Correo corporativo desactivado",
  "Entrevista de salida",
];

function loadChecklists(): Checklist[] {
  try { return JSON.parse(localStorage.getItem("pulse_onboarding") || "[]"); } catch { return []; }
}
function saveChecklists(d: Checklist[]) { localStorage.setItem("pulse_onboarding", JSON.stringify(d)); }

export default function Onboarding() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [empleadoId, setEmpleadoId] = useState(EMPLEADOS[0].id);
  const [tipo, setTipo] = useState<"alta"|"baja">("alta");

  useEffect(() => { setChecklists(loadChecklists()); }, []);

  function getOrCrear(): Checklist {
    const existente = checklists.find(c => c.empleadoId === empleadoId && c.tipo === tipo);
    if (existente) return existente;
    const items: Record<string, boolean> = {};
    (tipo === "alta" ? ITEMS_ALTA : ITEMS_BAJA).forEach(i => items[i] = false);
    return { empleadoId, tipo, items };
  }

  function toggle(item: string) {
    const actual = getOrCrear();
    const actualizado = { ...actual, items: { ...actual.items, [item]: !actual.items[item] } };
    const resto = checklists.filter(c => !(c.empleadoId === empleadoId && c.tipo === tipo));
    const updated = [...resto, actualizado];
    setChecklists(updated);
    saveChecklists(updated);
  }

  const actual = getOrCrear();
  const items = tipo === "alta" ? ITEMS_ALTA : ITEMS_BAJA;
  const completados = items.filter(i => actual.items[i]).length;
  const empleado = EMPLEADOS.find(e => e.id === empleadoId);

  const inp: React.CSSProperties = {
    padding:"9px 12px",borderRadius:"9px",
    border:"1.5px solid #DDE1EA",background:"#FFFFFF",
    color:"#1E2A4A",fontSize:"12.5px",outline:"none",fontFamily:"inherit",
  };

  return (
    <div className="glass-static" style={{borderRadius:"14px",overflow:"hidden"}}>
      <div style={{padding:"18px 22px",borderBottom:"1px solid #DDE1EA"}}>
        <span style={{fontSize:"14px",fontWeight:700,fontFamily:"'Sora', sans-serif",color:"#1E2A4A"}}>Onboarding / Offboarding</span>
        <p style={{fontSize:"11.5px",color:"#6B83A8",margin:"4px 0 12px"}}>Checklist digital de alta y baja de personal</p>

        <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
          <select style={inp} value={empleadoId} onChange={e=>setEmpleadoId(Number(e.target.value))}>
            {EMPLEADOS.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
          <div style={{display:"flex",gap:"6px"}}>
            <button onClick={()=>setTipo("alta")} style={{
              display:"flex",alignItems:"center",gap:"6px",
              padding:"9px 14px",borderRadius:"9px",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",
              border: tipo==="alta" ? "1.5px solid #2E7D5B" : "1.5px solid #DDE1EA",
              background: tipo==="alta" ? "rgba(46,125,91,0.10)" : "transparent",
              color: tipo==="alta" ? "#2E7D5B" : "#6B83A8",
            }}><UserPlus size={13}/> Alta</button>
            <button onClick={()=>setTipo("baja")} style={{
              display:"flex",alignItems:"center",gap:"6px",
              padding:"9px 14px",borderRadius:"9px",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",
              border: tipo==="baja" ? "1.5px solid #C0392B" : "1.5px solid #DDE1EA",
              background: tipo==="baja" ? "rgba(192,57,43,0.10)" : "transparent",
              color: tipo==="baja" ? "#C0392B" : "#6B83A8",
            }}><UserMinus size={13}/> Baja</button>
          </div>
        </div>
      </div>

      <div style={{padding:"18px 22px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
          <span style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>{empleado?.nombre} — {tipo === "alta" ? "Proceso de alta" : "Proceso de baja"}</span>
          <span style={{fontSize:"11.5px",fontWeight:700,color: completados===items.length ? "#2E7D5B" : "#0F9DA6"}}>{completados}/{items.length} completado</span>
        </div>
        <div style={{height:"6px",borderRadius:"4px",background:"#EAF1F4",overflow:"hidden",marginBottom:"16px"}}>
          <div style={{height:"100%",borderRadius:"4px",background:"linear-gradient(90deg,#17B3C2,#0F9DA6)",
            width:`${(completados/items.length)*100}%`,transition:"width .4s ease"}}/>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {items.map(item => {
            const done = !!actual.items[item];
            return (
              <div key={item} onClick={()=>toggle(item)} style={{
                display:"flex",alignItems:"center",gap:"10px",padding:"9px 12px",
                borderRadius:"9px",cursor:"pointer",
                background: done ? "rgba(46,125,91,0.06)" : "#FAFCFF",
                border: `1px solid ${done ? "rgba(46,125,91,0.25)" : "#EAEDF2"}`,
              }}>
                <div style={{
                  width:18,height:18,borderRadius:"5px",flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  background: done ? "#2E7D5B" : "#FFFFFF",
                  border: `1.5px solid ${done ? "#2E7D5B" : "#DDE1EA"}`,
                }}>
                  {done && <Check size={12} color="#FFFFFF"/>}
                </div>
                <span style={{fontSize:"12.5px",color: done ? "#1E2A4A" : "#5C6579",
                  textDecoration: done ? "line-through" : "none"}}>{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
