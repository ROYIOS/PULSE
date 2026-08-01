"use client";
import { useState, useEffect } from "react";
import { EMPLEADOS } from "@/lib/pulseData";
import { Laptop, Plus, Trash2, RotateCcw } from "lucide-react";

interface Activo {
  id: number; empleado: string; tipo: string; descripcion: string;
  fechaAsignacion: string; devuelto: boolean;
}

function loadActivos(): Activo[] {
  try { return JSON.parse(localStorage.getItem("pulse_activos") || "[]"); } catch { return []; }
}
function saveActivos(d: Activo[]) { localStorage.setItem("pulse_activos", JSON.stringify(d)); }

const TIPOS = ["Laptop", "Celular", "Uniforme", "Herramienta", "Vehículo", "Otro"];

export default function Activos() {
  const [activos, setActivos] = useState<Activo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    empleado: EMPLEADOS[0].nombre, tipo: TIPOS[0], descripcion: "",
    fechaAsignacion: new Date().toISOString().slice(0,10),
  });

  useEffect(() => { setActivos(loadActivos()); }, []);

  function agregar() {
    if (!form.descripcion.trim()) return;
    const nuevo: Activo = { id: Date.now(), ...form, devuelto: false };
    const updated = [nuevo, ...activos];
    setActivos(updated); saveActivos(updated);
    setForm(f => ({ ...f, descripcion: "" }));
    setShowForm(false);
  }
  function toggleDevuelto(id: number) {
    const updated = activos.map(a => a.id === id ? { ...a, devuelto: !a.devuelto } : a);
    setActivos(updated); saveActivos(updated);
  }
  function eliminar(id: number) {
    const updated = activos.filter(a => a.id !== id);
    setActivos(updated); saveActivos(updated);
  }

  const inp: React.CSSProperties = {
    width:"100%",padding:"9px 12px",borderRadius:"9px",
    border:"1.5px solid #DDE1EA",background:"#FFFFFF",
    color:"#1E2A4A",fontSize:"12.5px",outline:"none",
    boxSizing:"border-box",fontFamily:"inherit",
  };

  const activosPendientes = activos.filter(a => !a.devuelto);

  return (
    <div className="glass-static" style={{borderRadius:"14px",overflow:"hidden"}}>
      <div style={{padding:"18px 22px",borderBottom:"1px solid #DDE1EA",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <span style={{fontSize:"14px",fontWeight:700,fontFamily:"'Sora', sans-serif",color:"#1E2A4A"}}>Activos asignados</span>
          <p style={{fontSize:"11.5px",color:"#6B83A8",margin:"4px 0 0"}}>{activosPendientes.length} activos en poder de empleados</p>
        </div>
        <button onClick={()=>setShowForm(s=>!s)} style={{
          padding:"8px 16px",borderRadius:"9px",border:"none",
          background:"#0F9DA6",color:"#1E2A4A",fontSize:"12px",fontWeight:700,
          cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"5px",
        }}><Plus size={13}/> Asignar activo</button>
      </div>

      {showForm && (
        <div style={{padding:"16px 22px",borderBottom:"1px solid #EAEDF2",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Empleado</label>
            <select style={inp} value={form.empleado} onChange={e=>setForm(f=>({...f,empleado:e.target.value}))}>
              {EMPLEADOS.map(e => <option key={e.id}>{e.nombre}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Tipo</label>
            <select style={inp} value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))}>
              {TIPOS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{gridColumn:"1 / -1"}}>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Descripción / número de serie</label>
            <input style={inp} value={form.descripcion} onChange={e=>setForm(f=>({...f,descripcion:e.target.value}))} placeholder="Ej. MacBook Air M2 — SN X92JK..."/>
          </div>
          <div style={{gridColumn:"1 / -1",display:"flex",justifyContent:"flex-end"}}>
            <button onClick={agregar} style={{
              padding:"9px 20px",borderRadius:"9px",border:"none",
              background:"#0F9DA6",color:"#1E2A4A",fontSize:"12.5px",fontWeight:700,
              cursor:"pointer",fontFamily:"inherit",
            }}>Guardar</button>
          </div>
        </div>
      )}

      {activos.length === 0 ? (
        <div style={{padding:"30px",textAlign:"center",color:"#6B83A8",fontSize:"12.5px"}}>Sin activos registrados.</div>
      ) : activos.map(a => (
        <div key={a.id} style={{padding:"12px 22px",borderBottom:"1px solid #EAEDF2",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <Laptop size={15} color="#6B83A8"/>
            <div>
              <div style={{fontSize:"12.5px",fontWeight:600,color: a.devuelto ? "#9AA7B8" : "#1E2A4A",
                textDecoration: a.devuelto ? "line-through" : "none"}}>{a.tipo} — {a.descripcion}</div>
              <div style={{fontSize:"10.5px",color:"#6B83A8"}}>{a.empleado} · asignado {a.fechaAsignacion}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <button onClick={()=>toggleDevuelto(a.id)} style={{
              display:"flex",alignItems:"center",gap:"5px",
              padding:"5px 12px",borderRadius:"8px",fontSize:"10.5px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",
              border: a.devuelto ? "1px solid #DDE1EA" : "1px solid #C08A2E",
              background: a.devuelto ? "#EAF1F4" : "rgba(192,138,46,0.10)",
              color: a.devuelto ? "#6B83A8" : "#C08A2E",
            }}><RotateCcw size={11}/> {a.devuelto ? "Devuelto" : "Marcar devuelto"}</button>
            <button onClick={()=>eliminar(a.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#C0392B"}}><Trash2 size={13}/></button>
          </div>
        </div>
      ))}
    </div>
  );
}
