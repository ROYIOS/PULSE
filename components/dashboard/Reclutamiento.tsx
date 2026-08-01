"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

type Etapa = "Postulado" | "Entrevista" | "Oferta" | "Contratado" | "Rechazado";

interface Candidato {
  id: number; nombre: string; puesto: string; etapa: Etapa; fecha: string;
  telefono: string; correo: string; plataformaOrigen: string; notasEntrevista: string;
}

const ETAPAS: Etapa[] = ["Postulado", "Entrevista", "Oferta", "Contratado"];
const COLOR_ETAPA: Record<Etapa, string> = {
  Postulado: "#6B83A8", Entrevista: "#C08A2E", Oferta: "#2D4A7A",
  Contratado: "#2E7D5B", Rechazado: "#C0392B",
};
const PLATAFORMAS = ["LinkedIn", "OCC Mundial", "Indeed", "Referido", "Bolsa de trabajo local", "Otro"];

function loadCandidatos(): Candidato[] {
  try { return JSON.parse(localStorage.getItem("pulse_candidatos") || "[]"); } catch { return []; }
}
function saveCandidatos(d: Candidato[]) { localStorage.setItem("pulse_candidatos", JSON.stringify(d)); }

export default function Reclutamiento() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: "", puesto: "", telefono: "", correo: "", plataformaOrigen: PLATAFORMAS[0] });

  useEffect(() => { setCandidatos(loadCandidatos()); }, []);

  function agregar() {
    if (!form.nombre.trim() || !form.puesto.trim() || !form.telefono.trim()) return;
    const nuevo: Candidato = {
      id: Date.now(), ...form, etapa: "Postulado", notasEntrevista: "",
      fecha: new Date().toISOString().slice(0,10),
    };
    const updated = [nuevo, ...candidatos];
    setCandidatos(updated); saveCandidatos(updated);
    setForm({ nombre: "", puesto: "", telefono: "", correo: "", plataformaOrigen: PLATAFORMAS[0] });
    setShowForm(false);
  }
  function cambiarEtapa(id: number, etapa: Etapa) {
    const updated = candidatos.map(c => c.id === id ? { ...c, etapa } : c);
    setCandidatos(updated); saveCandidatos(updated);
  }
  function actualizarCampo(id: number, campo: keyof Candidato, valor: string) {
    const updated = candidatos.map(c => c.id === id ? { ...c, [campo]: valor } : c);
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
        <div style={{padding:"16px 22px",borderBottom:"1px solid #EAEDF2",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Nombre *</label>
            <input style={inp} value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}/>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Puesto *</label>
            <input style={inp} value={form.puesto} onChange={e=>setForm(f=>({...f,puesto:e.target.value}))} placeholder="Ej. Analista de RH"/>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Teléfono *</label>
            <input style={inp} value={form.telefono} onChange={e=>setForm(f=>({...f,telefono:e.target.value}))} placeholder="10 dígitos"/>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Correo (opcional)</label>
            <input style={inp} value={form.correo} onChange={e=>setForm(f=>({...f,correo:e.target.value}))}/>
          </div>
          <div style={{gridColumn:"1 / -1"}}>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Plataforma de origen</label>
            <select style={inp} value={form.plataformaOrigen} onChange={e=>setForm(f=>({...f,plataformaOrigen:e.target.value}))}>
              {PLATAFORMAS.map(p => <option key={p}>{p}</option>)}
            </select>
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

      {candidatos.length === 0 ? (
        <div style={{padding:"30px",textAlign:"center",color:"#6B83A8",fontSize:"12.5px"}}>Sin candidatos registrados.</div>
      ) : candidatos.map(c => {
        const rechazado = c.etapa === "Rechazado";
        const idxActual = rechazado ? -1 : ETAPAS.indexOf(c.etapa);
        const abierto = expandido === c.id;
        return (
          <div key={c.id} style={{padding:"14px 22px",borderBottom:"1px solid #EAEDF2"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
              <div style={{cursor:"pointer",flex:1}} onClick={()=>setExpandido(abierto ? null : c.id)}>
                <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                  <span style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>{c.nombre}</span>
                  {abierto ? <ChevronUp size={13} color="#6B83A8"/> : <ChevronDown size={13} color="#6B83A8"/>}
                </div>
                <div style={{fontSize:"10.5px",color:"#6B83A8"}}>{c.puesto} · {c.telefono} · vía {c.plataformaOrigen} · postulado {c.fecha}</div>
              </div>
              <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                <select value={c.etapa} onChange={e=>cambiarEtapa(c.id, e.target.value as Etapa)} style={{
                  padding:"5px 10px",borderRadius:"8px",fontSize:"10.5px",fontWeight:700,
                  border:`1.5px solid ${COLOR_ETAPA[c.etapa]}`,
                  background:`${COLOR_ETAPA[c.etapa]}18`,color:COLOR_ETAPA[c.etapa],
                  fontFamily:"inherit",cursor:"pointer",
                }}>
                  {[...ETAPAS, "Rechazado" as Etapa].map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <button onClick={()=>eliminar(c.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#C0392B"}}><Trash2 size={13}/></button>
              </div>
            </div>

            <div style={{display:"flex",gap:"4px",marginBottom: abierto ? "14px" : "0"}}>
              {ETAPAS.map((etapa, i) => {
                const activo = !rechazado && i <= idxActual;
                return (
                  <div key={etapa} style={{flex:1}}>
                    <div style={{
                      height:"7px",borderRadius:"4px",
                      background: rechazado ? "#F5DEDC" : activo ? COLOR_ETAPA[etapa] : "#EAF1F4",
                      transition:"background .3s ease",
                    }}/>
                    <div style={{fontSize:"8px",color: activo && !rechazado ? COLOR_ETAPA[etapa] : "#9AA7B8",
                      fontWeight: activo ? 700 : 500, marginTop:"3px",textAlign:"center"}}>{etapa}</div>
                  </div>
                );
              })}
            </div>

            {abierto && (
              <div style={{display:"flex",flexDirection:"column",gap:"10px",paddingTop:"4px"}}>
                <div>
                  <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Teléfono</label>
                  <input style={inp} value={c.telefono} onChange={e=>actualizarCampo(c.id,"telefono",e.target.value)}/>
                </div>
                <div>
                  <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Correo</label>
                  <input style={inp} value={c.correo} onChange={e=>actualizarCampo(c.id,"correo",e.target.value)}/>
                </div>
                <div>
                  <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Notas de entrevista</label>
                  <textarea rows={3} style={{...inp,resize:"vertical"}} value={c.notasEntrevista}
                    onChange={e=>actualizarCampo(c.id,"notasEntrevista",e.target.value)}
                    placeholder="Impresiones, fortalezas, dudas, siguiente paso..."/>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
