"use client";
import { useState, useEffect } from "react";
import { EMPLEADOS } from "@/lib/pulseData";
import { Mail } from "lucide-react";

interface Encuesta {
  id: number; titulo: string; preguntas: string[];
  creada: string; notificada: boolean;
}

function loadEncuestas(): Encuesta[] {
  try { return JSON.parse(localStorage.getItem("pulse_encuestas") || "[]"); }
  catch { return []; }
}
function saveEncuestas(data: Encuesta[]) {
  localStorage.setItem("pulse_encuestas", JSON.stringify(data));
}

export default function Encuestas({ onToast }: { onToast: (msg:string) => void }) {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [preguntas, setPreguntas] = useState(["¿Qué tan satisfecho estás con tu equipo de trabajo?"]);

  useEffect(() => { setEncuestas(loadEncuestas()); }, []);

  function agregarPregunta() { setPreguntas(p => [...p, ""]); }
  function actualizarPregunta(i: number, v: string) {
    setPreguntas(p => p.map((q, idx) => idx===i ? v : q));
  }

  function crear() {
    if (!titulo.trim()) return;
    const nueva: Encuesta = {
      id: Date.now(), titulo, preguntas: preguntas.filter(p=>p.trim()),
      creada: new Date().toISOString().slice(0,10), notificada: false,
    };
    const updated = [nueva, ...encuestas];
    setEncuestas(updated);
    saveEncuestas(updated);
    setTitulo(""); setPreguntas([""]);
    setShowForm(false);
    onToast("✅ Encuesta creada");
  }

  function notificar(id: number) {
    const updated = encuestas.map(e => e.id===id ? {...e, notificada:true} : e);
    setEncuestas(updated);
    saveEncuestas(updated);
    onToast(`📧 Notificación simulada enviada a ${EMPLEADOS.length} correos (falta conectar servicio real de correo)`);
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
          <span style={{fontSize:"14px",fontWeight:700,fontFamily:"'Sora', sans-serif",color:"#1E2A4A"}}>Encuestas</span>
          <p style={{fontSize:"11.5px",color:"#6B83A8",margin:"4px 0 0"}}>{encuestas.length} encuestas creadas</p>
        </div>
        <button onClick={()=>setShowForm(s=>!s)} style={{
          padding:"8px 16px",borderRadius:"9px",border:"none",
          background:"#0F9DA6",color:"#1E2A4A",fontSize:"12px",fontWeight:700,
          cursor:"pointer",fontFamily:"inherit",
        }}>{showForm ? "Cancelar" : "+ Nueva encuesta"}</button>
      </div>

      {showForm && (
        <div style={{padding:"18px 22px",borderBottom:"1px solid #EAEDF2",display:"flex",flexDirection:"column",gap:"12px"}}>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Título</label>
            <input style={inp} value={titulo} onChange={e=>setTitulo(e.target.value)} placeholder="Ej. Clima laboral Q2 2026"/>
          </div>
          {preguntas.map((p, i) => (
            <div key={i}>
              <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Pregunta {i+1}</label>
              <input style={inp} value={p} onChange={e=>actualizarPregunta(i, e.target.value)}/>
            </div>
          ))}
          <button onClick={agregarPregunta} style={{
            alignSelf:"flex-start",fontSize:"11.5px",color:"#0F9DA6",background:"none",
            border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600,
          }}>+ Agregar pregunta</button>
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <button onClick={crear} style={{
              padding:"9px 20px",borderRadius:"9px",border:"none",
              background:"#0F9DA6",color:"#1E2A4A",fontSize:"12.5px",fontWeight:700,
              cursor:"pointer",fontFamily:"inherit",
            }}>Crear encuesta</button>
          </div>
        </div>
      )}

      {encuestas.length === 0 ? (
        <div style={{padding:"30px",textAlign:"center",color:"#6B83A8",fontSize:"12.5px"}}>
          Aún no hay encuestas. Crea la primera arriba.
        </div>
      ) : encuestas.map(enc => (
        <div key={enc.id} style={{padding:"14px 22px",borderBottom:"1px solid #EAEDF2"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>{enc.titulo}</div>
              <div style={{fontSize:"10.5px",color:"#6B83A8"}}>{enc.preguntas.length} preguntas · creada {enc.creada}</div>
            </div>
            <button onClick={()=>notificar(enc.id)} disabled={enc.notificada} style={{
              display:"flex",alignItems:"center",gap:"6px",
              padding:"6px 14px",borderRadius:"8px",
              border:`1px solid ${enc.notificada ? "#DDE1EA" : "#0F9DA6"}`,
              background: enc.notificada ? "#EAF1F4" : "transparent",
              color: enc.notificada ? "#6B83A8" : "#0F9DA6",
              fontSize:"11px",fontWeight:600,cursor: enc.notificada ? "default" : "pointer",
              fontFamily:"inherit",
            }}>
              <Mail size={12}/> {enc.notificada ? "Notificado" : "Notificar por correo"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
