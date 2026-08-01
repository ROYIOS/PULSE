"use client";
import { useState, useEffect } from "react";
import { descargarAceptacionActivo } from "@/lib/pulseData";
import { Laptop, Check } from "lucide-react";

interface Activo {
  id: number; empleado: string; tipo: string; descripcion: string;
  fechaAsignacion: string; devuelto: boolean; aceptado: boolean;
}

function loadActivos(): Activo[] {
  try { return JSON.parse(localStorage.getItem("pulse_activos") || "[]"); } catch { return []; }
}
function saveActivos(d: Activo[]) { localStorage.setItem("pulse_activos", JSON.stringify(d)); }

export default function MisActivos({ nombreEmpleado }: { nombreEmpleado: string }) {
  const [activos, setActivos] = useState<Activo[]>([]);

  useEffect(() => { setActivos(loadActivos().filter(a => a.empleado === nombreEmpleado)); }, [nombreEmpleado]);

  function aceptar(activo: Activo) {
    descargarAceptacionActivo(activo);
    const all = loadActivos();
    const updated = all.map(a => a.id === activo.id ? { ...a, aceptado: true } : a);
    saveActivos(updated);
    setActivos(updated.filter(a => a.empleado === nombreEmpleado));
  }

  const pendientes = activos.filter(a => !a.aceptado && !a.devuelto);
  const aceptados = activos.filter(a => a.aceptado);

  return (
    <div className="glass-static" style={{borderRadius:"14px",overflow:"hidden"}}>
      <div style={{padding:"18px 22px",borderBottom:"1px solid #DDE1EA"}}>
        <span style={{fontSize:"14px",fontWeight:700,fontFamily:"'Sora', sans-serif",color:"#1E2A4A"}}>Mis activos</span>
        <p style={{fontSize:"11.5px",color:"#6B83A8",margin:"4px 0 0"}}>Equipo que la empresa te ha asignado</p>
      </div>

      {activos.length === 0 ? (
        <div style={{padding:"30px",textAlign:"center",color:"#6B83A8",fontSize:"12.5px"}}>No tienes activos asignados.</div>
      ) : (<>
        {pendientes.length > 0 && (
          <div style={{padding:"14px 22px",background:"rgba(192,138,46,0.06)",borderBottom:"1px solid rgba(192,138,46,0.15)"}}>
            <p style={{fontSize:"11px",color:"#C08A2E",fontWeight:600,margin:"0 0 10px"}}>
              Tienes {pendientes.length} activo(s) pendientes de aceptar
            </p>
            {pendientes.map(a => (
              <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                background:"#FFFFFF",borderRadius:"10px",padding:"10px 14px",marginBottom:"8px",border:"1px solid #EAEDF2"}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <Laptop size={15} color="#6B83A8"/>
                  <div>
                    <div style={{fontSize:"12.5px",fontWeight:600,color:"#1E2A4A"}}>{a.tipo} — {a.descripcion}</div>
                    <div style={{fontSize:"10.5px",color:"#6B83A8"}}>Asignado {a.fechaAsignacion}</div>
                  </div>
                </div>
                <button onClick={()=>aceptar(a)} style={{
                  display:"flex",alignItems:"center",gap:"6px",
                  padding:"7px 16px",borderRadius:"9px",border:"none",
                  background:"#0F9DA6",color:"#1E2A4A",fontSize:"11.5px",fontWeight:700,
                  cursor:"pointer",fontFamily:"inherit",
                }}><Check size={13}/> Aceptar y firmar</button>
              </div>
            ))}
          </div>
        )}

        {aceptados.map(a => (
          <div key={a.id} style={{padding:"12px 22px",borderBottom:"1px solid #EAEDF2",display:"flex",alignItems:"center",gap:"10px"}}>
            <Laptop size={15} color={a.devuelto ? "#9AA7B8" : "#2E7D5B"}/>
            <div style={{flex:1}}>
              <div style={{fontSize:"12.5px",fontWeight:600,color: a.devuelto ? "#9AA7B8" : "#1E2A4A",
                textDecoration: a.devuelto ? "line-through" : "none"}}>{a.tipo} — {a.descripcion}</div>
              <div style={{fontSize:"10.5px",color:"#6B83A8"}}>Asignado {a.fechaAsignacion} · {a.devuelto ? "Devuelto" : "Aceptado ✓"}</div>
            </div>
          </div>
        ))}
      </>)}
    </div>
  );
}
