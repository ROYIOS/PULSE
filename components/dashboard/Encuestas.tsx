"use client";
import { useState, useEffect, useRef } from "react";
import { EMPLEADOS, addNotif } from "@/lib/pulseData";
import { Mail, Trash2, Plus, Image as ImageIcon, CheckSquare, Circle, AlignLeft } from "lucide-react";

type TipoPregunta = "abierta" | "opcion_unica" | "opcion_multiple" | "imagen";

interface Pregunta {
  id: number; tipo: TipoPregunta; texto: string;
  opciones?: string[]; imagenUrl?: string;
}

interface Encuesta {
  id: number; titulo: string; descripcion: string;
  preguntas: Pregunta[]; creada: string; notificada: boolean;
}

function loadEncuestas(): Encuesta[] {
  try { return JSON.parse(localStorage.getItem("pulse_encuestas") || "[]"); }
  catch { return []; }
}
function saveEncuestas(data: Encuesta[]) {
  localStorage.setItem("pulse_encuestas", JSON.stringify(data));
}

const TIPO_INFO: Record<TipoPregunta, { label: string; icon: any }> = {
  abierta:         { label: "Respuesta abierta",   icon: AlignLeft },
  opcion_unica:    { label: "Opción única",         icon: Circle },
  opcion_multiple: { label: "Opción múltiple",      icon: CheckSquare },
  imagen:          { label: "Imagen",               icon: ImageIcon },
};

function nuevaPregunta(tipo: TipoPregunta): Pregunta {
  return {
    id: Date.now() + Math.random(),
    tipo, texto: "",
    opciones: (tipo === "opcion_unica" || tipo === "opcion_multiple") ? ["Opción 1", "Opción 2"] : undefined,
  };
}

export default function Encuestas({ onToast }: { onToast: (msg:string) => void }) {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [preguntas, setPreguntas] = useState<Pregunta[]>([nuevaPregunta("abierta")]);

  useEffect(() => { setEncuestas(loadEncuestas()); }, []);

  function actualizarPregunta(id: number, patch: Partial<Pregunta>) {
    setPreguntas(ps => ps.map(p => p.id === id ? { ...p, ...patch } : p));
  }
  function eliminarPregunta(id: number) {
    setPreguntas(ps => ps.filter(p => p.id !== id));
  }
  function agregarOpcion(id: number) {
    setPreguntas(ps => ps.map(p => p.id === id ? { ...p, opciones: [...(p.opciones||[]), `Opción ${(p.opciones?.length||0)+1}`] } : p));
  }
  function actualizarOpcion(id: number, idx: number, valor: string) {
    setPreguntas(ps => ps.map(p => p.id === id ? { ...p, opciones: p.opciones?.map((o,i)=>i===idx?valor:o) } : p));
  }
  function eliminarOpcion(id: number, idx: number) {
    setPreguntas(ps => ps.map(p => p.id === id ? { ...p, opciones: p.opciones?.filter((_,i)=>i!==idx) } : p));
  }
  function subirImagen(id: number, file: File) {
    const reader = new FileReader();
    reader.onload = () => actualizarPregunta(id, { imagenUrl: reader.result as string });
    reader.readAsDataURL(file);
  }

  function crear() {
    if (!titulo.trim()) return;
    const nueva: Encuesta = {
      id: Date.now(), titulo, descripcion,
      preguntas: preguntas.filter(p => p.texto.trim() || p.imagenUrl),
      creada: new Date().toISOString().slice(0,10), notificada: false,
    };
    const updated = [nueva, ...encuestas];
    setEncuestas(updated);
    saveEncuestas(updated);
    setTitulo(""); setDescripcion(""); setPreguntas([nuevaPregunta("abierta")]);
    setShowForm(false);
    onToast("✅ Encuesta creada");
  }

  function notificar(id: number) {
    const enc = encuestas.find(e => e.id === id);
    const updated = encuestas.map(e => e.id===id ? {...e, notificada:true} : e);
    setEncuestas(updated);
    saveEncuestas(updated);
    addNotif({
      tipo: "info",
      texto: `📋 Nueva encuesta disponible: "${enc?.titulo}". Tómate un momento para responderla.`,
      fecha: new Date().toISOString(),
    });
    onToast(`📧 Notificación enviada por correo (simulado) y dentro de la app a ${EMPLEADOS.length} personas`);
  }
  function eliminarEncuesta(id: number) {
    const updated = encuestas.filter(e => e.id !== id);
    setEncuestas(updated);
    saveEncuestas(updated);
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
        <div style={{padding:"18px 22px",borderBottom:"1px solid #EAEDF2",display:"flex",flexDirection:"column",gap:"14px"}}>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Título</label>
            <input style={inp} value={titulo} onChange={e=>setTitulo(e.target.value)} placeholder="Ej. Clima laboral Q2 2026"/>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Descripción (opcional)</label>
            <input style={inp} value={descripcion} onChange={e=>setDescripcion(e.target.value)} placeholder="Breve contexto para quien la responda"/>
          </div>

          {preguntas.map((p, i) => {
            const Icon = TIPO_INFO[p.tipo].icon;
            return (
              <div key={p.id} style={{
                border:"1.5px solid #DDE1EA", borderRadius:"12px", padding:"14px",
                display:"flex", flexDirection:"column", gap:"10px", background:"#FAFCFF",
              }}>
                <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                  <span style={{fontSize:"10px",color:"#6B83A8",fontWeight:700}}>P{i+1}</span>
                  <input style={{...inp,flex:1}} placeholder="Escribe la pregunta..."
                    value={p.texto} onChange={e=>actualizarPregunta(p.id,{texto:e.target.value})}/>
                  <select
                    value={p.tipo}
                    onChange={e=>{
                      const tipo = e.target.value as TipoPregunta;
                      actualizarPregunta(p.id, {
                        tipo,
                        opciones: (tipo==="opcion_unica"||tipo==="opcion_multiple") ? (p.opciones||["Opción 1","Opción 2"]) : undefined,
                      });
                    }}
                    style={{...inp,width:"150px",flexShrink:0}}
                  >
                    {Object.entries(TIPO_INFO).map(([key,info]) => (
                      <option key={key} value={key}>{info.label}</option>
                    ))}
                  </select>
                  <button onClick={()=>eliminarPregunta(p.id)} style={{
                    background:"none",border:"none",cursor:"pointer",color:"#C0392B",flexShrink:0,
                  }}><Trash2 size={15}/></button>
                </div>

                <div style={{display:"flex",alignItems:"center",gap:"5px",fontSize:"10px",color:"#6B83A8"}}>
                  <Icon size={11}/> {TIPO_INFO[p.tipo].label}
                </div>

                {(p.tipo === "opcion_unica" || p.tipo === "opcion_multiple") && (
                  <div style={{display:"flex",flexDirection:"column",gap:"6px",paddingLeft:"6px"}}>
                    {p.opciones?.map((op, oi) => (
                      <div key={oi} style={{display:"flex",alignItems:"center",gap:"7px"}}>
                        {p.tipo==="opcion_unica" ? <Circle size={12} color="#9AA7B8"/> : <CheckSquare size={12} color="#9AA7B8"/>}
                        <input style={{...inp,padding:"6px 10px"}} value={op}
                          onChange={e=>actualizarOpcion(p.id, oi, e.target.value)}/>
                        <button onClick={()=>eliminarOpcion(p.id, oi)} style={{
                          background:"none",border:"none",cursor:"pointer",color:"#C0392B",
                        }}><Trash2 size={12}/></button>
                      </div>
                    ))}
                    <button onClick={()=>agregarOpcion(p.id)} style={{
                      alignSelf:"flex-start",fontSize:"11px",color:"#0F9DA6",background:"none",
                      border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600,
                      display:"flex",alignItems:"center",gap:"4px",
                    }}><Plus size={12}/> Agregar opción</button>
                  </div>
                )}

                {p.tipo === "imagen" && (
                  <div>
                    {p.imagenUrl ? (
                      <img src={p.imagenUrl} alt="" style={{maxWidth:"180px",borderRadius:"8px",border:"1px solid #DDE1EA"}}/>
                    ) : (
                      <label style={{
                        display:"inline-flex",alignItems:"center",gap:"6px",
                        padding:"8px 14px",borderRadius:"9px",border:"1.5px dashed #DDE1EA",
                        color:"#6B83A8",fontSize:"11.5px",cursor:"pointer",fontFamily:"inherit",
                      }}>
                        <ImageIcon size={13}/> Subir imagen
                        <input type="file" accept="image/*" style={{display:"none"}}
                          onChange={e=>{ const f=e.target.files?.[0]; if(f) subirImagen(p.id, f); }}/>
                      </label>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {Object.entries(TIPO_INFO).map(([key,info]) => (
              <button key={key} onClick={()=>setPreguntas(ps=>[...ps, nuevaPregunta(key as TipoPregunta)])} style={{
                display:"flex",alignItems:"center",gap:"5px",
                padding:"6px 12px",borderRadius:"20px",border:"1px solid #DDE1EA",
                background:"transparent",color:"#0F9DA6",fontSize:"11px",fontWeight:600,
                cursor:"pointer",fontFamily:"inherit",
              }}><Plus size={11}/> {info.label}</button>
            ))}
          </div>

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
            <div style={{display:"flex",gap:"6px"}}>
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
              <button onClick={()=>eliminarEncuesta(enc.id)} style={{
                background:"none",border:"1px solid #DDE1EA",borderRadius:"8px",
                cursor:"pointer",color:"#C0392B",padding:"6px 8px",
              }}><Trash2 size={12}/></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
