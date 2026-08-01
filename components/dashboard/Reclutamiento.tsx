"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

type Etapa = "Postulado" | "Entrevista" | "Oferta" | "Contratado" | "Rechazado";

interface Candidato {
  id: number; nombre: string; puesto: string; etapa: Etapa; fecha: string;
}

const ETAPAS: Etapa[] = ["Postulado", "Entrevista", "Oferta", "Contratado", "Rechazado"];
const COLOR_ETAPA: Record<Etapa, string> = {
  Postulado: "#6B83A8", Entrevista: "#C08A2E", Oferta: "#2D4A7A",
  Contratado: "#2E7D5B", Rechazado: "#C0392B",
};

function loadCandidatos(): Candidato[] {
  try { return JSON.parse(localStorage.getItem("pulse_candidatos") || "[]"); } catch { return []; }
}
function saveCandidatos(d: Candidato[]) { localStorage.setItem("pulse_candidatos", JSON.stringify(d)); }

export default function Reclutamiento() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: "", puesto: "" });

  useEffect(() => { setCandidatos(loadCandidatos()); }, []);

  function agregar() {
    if (!form.nombre.trim() || !form.puesto.trim()) return;
    const nuevo: Candidato = {
      id: Date.now(), ...form, etapa: "Postulado",
      fecha: new Date().toISOString().slice(0,10),
    };
    const updated = [nuevo, ...candidatos];
    setCandidatos(updated); saveCandidatos(updated);
    setForm({ nombre: "", puesto: "" });
    setShowForm(false);
  }
  function cambiarEtapa(id: number, etapa: Etapa) {
    const updated = candidatos.map(c => c.id === id ? { ...c, etapa } : c);
    setCandidatos(updated); saveCandidatos(updated);
  }
  function eliminar(id: number) {
    const updated = candidatos.filter(c => c.id !== id);
    setCandidatos(updated); saveCandidatos(updated);
  }

  const inp: React.CSSProperties = {
    width:"100%",padding:"9px 12px",borderRadius:"9px",
    border:"1.5px solid #DDE1EA",background:"#FFFFFF",
    color:"#1E2A4A",fontSize:"12.5px",outline:"none",
    boxSizing:"border-box",fontFamily:"inherit",
  };

  return (
    <div className="glass-static" style={{borderRadius:"14px",overflow:"hidden"}}>
      <div style={{padding:"18px 22px",borderBottom:"1px solid #DDE1EA",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <span style={{fontSize:"14px",fontWeight:700,fontFamily:"'Sora', sans-serif",color:"#1E2A4A"}}>Seguimiento de reclutamiento</span>
          <p style={{fontSize:"11.5px",color:"#6B83A8",margin:"4px 0 0"}}>{candidatos.length} candidatos en proceso</p>
        </div>
        <button onClick={()=>setShowForm(s=>!s)} style={{
          padding:"8px 16px",borderRadius:"9px",border:"none",
          background:"#0F9DA6",color:"#1E2A4A",fontSize:"12px",fontWeight:700,
          cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"5px",
        }}><Plus size={13}/> Agregar candidato</button>
      </div>

      {showForm && (
        <div style={{padding:"16px 22px",borderBottom:"1px solid #EAEDF2",display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:"10px",alignItems:"end"}}>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Nombre</label>
            <input style={inp} value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}/>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Puesto</label>
            <input style={inp} value={form.puesto} onChange={e=>setForm(f=>({...f,puesto:e.target.value}))} placeholder="Ej. Analista de RH"/>
          </div>
          <button onClick={agregar} style={{
            padding:"9px 16px",borderRadius:"9px",border:"none",height:"38px",
            background:"#0F9DA6",color:"#1E2A4A",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",
          }}>Guardar</button>
        </div>
      )}

      {candidatos.length === 0 ? (
        <div style={{padding:"30px",textAlign:"center",color:"#6B83A8",fontSize:"12.5px"}}>Sin candidatos registrados.</div>
      ) : candidatos.map(c => (
        <div key={c.id} style={{padding:"12px 22px",borderBottom:"1px solid #EAEDF2",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>{c.nombre}</div>
            <div style={{fontSize:"10.5px",color:"#6B83A8"}}>{c.puesto} · postulado {c.fecha}</div>
          </div>
          <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
            <select value={c.etapa} onChange={e=>cambiarEtapa(c.id, e.target.value as Etapa)} style={{
              padding:"5px 10px",borderRadius:"8px",fontSize:"10.5px",fontWeight:700,
              border:`1.5px solid ${COLOR_ETAPA[c.etapa]}`,
              background:`${COLOR_ETAPA[c.etapa]}18`,color:COLOR_ETAPA[c.etapa],
              fontFamily:"inherit",cursor:"pointer",
            }}>
              {ETAPAS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <button onClick={()=>eliminar(c.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#C0392B"}}><Trash2 size={13}/></button>
          </div>
        </div>
      ))}
    </div>
  );
}
