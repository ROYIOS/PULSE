"use client";
import { useState, useEffect } from "react";
import { EMPLEADOS } from "@/lib/pulseData";

interface Expediente {
  empleadoId: number;
  tipoSangre: string;
  alergias: string;
  contactoEmergencia: string;
  telefonoEmergencia: string;
  incapacidades: string;
  documentoNombre?: string;
}

function loadExpedientes(): Record<number, Expediente> {
  try { return JSON.parse(localStorage.getItem("pulse_expedientes") || "{}"); }
  catch { return {}; }
}
function saveExpedientes(data: Record<number, Expediente>) {
  localStorage.setItem("pulse_expedientes", JSON.stringify(data));
}

interface Accidente {
  id: number; empleado: string; fecha: string; descripcion: string;
  tipoLesion: string; atencionBrindada: string;
}
interface Dispensacion {
  id: number; medicamentoNombre: string; empleado: string; cantidad: number; fecha: string; motivo: string;
}
function loadAccidentesDe(nombre: string): Accidente[] {
  try {
    const all: Accidente[] = JSON.parse(localStorage.getItem("pulse_accidentes") || "[]");
    return all.filter(a => a.empleado === nombre);
  } catch { return []; }
}
function loadDispensacionesDe(nombre: string): Dispensacion[] {
  try {
    const all: Dispensacion[] = JSON.parse(localStorage.getItem("pulse_dispensaciones") || "[]");
    return all.filter(d => d.empleado === nombre);
  } catch { return []; }
}
interface DocumentoOnboarding { nombre: string; fecha: string; tipo: string; }
function loadDocumentosDe(empleadoId: number): DocumentoOnboarding[] {
  try {
    const all: Record<number, DocumentoOnboarding[]> = JSON.parse(localStorage.getItem("pulse_documentos") || "{}");
    return all[empleadoId] || [];
  } catch { return []; }
}

export default function ExpedienteMedico({ soloEmpleadoId }: { soloEmpleadoId?: number } = {}) {
  const [data, setData] = useState<Record<number, Expediente>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Expediente>>({});
  const [extrayendo, setExtrayendo] = useState(false);

  const empleadosAMostrar = soloEmpleadoId ? EMPLEADOS.filter(e => e.id === soloEmpleadoId) : EMPLEADOS;

  useEffect(() => { setData(loadExpedientes()); }, []);

  function abrir(id: number) {
    setEditId(id);
    setForm(data[id] || { tipoSangre:"", alergias:"", contactoEmergencia:"", telefonoEmergencia:"", incapacidades:"" });
  }

  function guardar() {
    if (editId === null) return;
    const updated = { ...data, [editId]: { empleadoId: editId, ...form } as Expediente };
    setData(updated);
    saveExpedientes(updated);
    setEditId(null);
  }

  function subirDocumento(file: File) {
    setForm(f => ({ ...f, documentoNombre: file.name }));
    setExtrayendo(true);
    // ⚠️ Extracción simulada. Para leer datos reales del documento hace falta
    // conectar un servicio real de OCR/visión (ej. la API de Claude con el documento como imagen).
    setTimeout(() => {
      setForm(f => ({
        ...f,
        tipoSangre: f.tipoSangre || "O+",
        alergias: f.alergias || "Ninguna reportada",
        contactoEmergencia: f.contactoEmergencia || "Por confirmar",
      }));
      setExtrayendo(false);
    }, 1400);
  }

  const inp: React.CSSProperties = {
    width:"100%",padding:"9px 12px",borderRadius:"9px",
    border:"1.5px solid #DDE1EA",background:"#FFFFFF",
    color:"#1E2A4A",fontSize:"12.5px",outline:"none",
    boxSizing:"border-box",fontFamily:"inherit",
  };

  return (
    <div className="glass-static" style={{borderRadius:"14px",overflow:"hidden"}}>
      <div style={{padding:"18px 22px",borderBottom:"1px solid #DDE1EA"}}>
        <span style={{fontSize:"14px",fontWeight:700,fontFamily:"'Sora', sans-serif",color:"#1E2A4A"}}>Expediente médico</span>
        <p style={{fontSize:"11.5px",color:"#6B83A8",margin:"4px 0 0"}}>
          {soloEmpleadoId ? "Tu información médica y de emergencia" : "Información sensible — solo visible para RH/Gerencia"}
        </p>
      </div>

      {empleadosAMostrar.map(e => {
        const exp = data[e.id];
        const abierto = editId === e.id;
        const accidentes = loadAccidentesDe(e.nombre);
        const dispensaciones = loadDispensacionesDe(e.nombre);
        const documentos = loadDocumentosDe(e.id);
        return (
          <div key={e.id} style={{padding:"14px 22px",borderBottom:"1px solid #EAEDF2"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>{e.nombre}</div>
                <div style={{fontSize:"11px",color:"#6B83A8"}}>
                  {exp ? `${exp.tipoSangre || "—"} · ${exp.alergias || "sin alergias registradas"}` : "Sin expediente capturado"}
                </div>
              </div>
              <button onClick={()=>abierto?setEditId(null):abrir(e.id)} style={{
                padding:"6px 14px",borderRadius:"8px",border:"1px solid #DDE1EA",
                background:"transparent",color:"#0F9DA6",fontSize:"11px",fontWeight:600,
                cursor:"pointer",fontFamily:"inherit",
              }}>{abierto ? "Cerrar" : exp ? "Editar" : "Capturar"}</button>
            </div>

            {abierto && (
              <div style={{marginTop:"12px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                <div style={{gridColumn:"1 / -1"}}>
                  <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:"6px"}}>
                    Documento físico (identificación, receta, historial...)
                  </label>
                  <label style={{
                    display:"inline-flex",alignItems:"center",gap:"7px",
                    padding:"9px 16px",borderRadius:"9px",border:"1.5px dashed #DDE1EA",
                    color:"#0F9DA6",fontSize:"12px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,
                  }}>
                    📎 {form.documentoNombre || "Subir documento"}
                    <input type="file" accept="image/*,.pdf" style={{display:"none"}}
                      onChange={e=>{ const f=e.target.files?.[0]; if(f) subirDocumento(f); }}/>
                  </label>
                  {extrayendo && (
                    <span style={{marginLeft:"10px",fontSize:"11px",color:"#6B83A8"}}>Extrayendo datos del documento...</span>
                  )}
                  {form.documentoNombre && !extrayendo && (
                    <p style={{fontSize:"10px",color:"#C08A2E",marginTop:"6px"}}>
                      ⚠️ Extracción de demostración — para leer los datos reales del documento hace falta conectar un servicio de OCR/visión.
                    </p>
                  )}
                </div>
                <div>
                  <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Tipo de sangre</label>
                  <input style={inp} value={form.tipoSangre||""} onChange={e=>setForm(f=>({...f,tipoSangre:e.target.value}))}/>
                </div>
                <div>
                  <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Alergias</label>
                  <input style={inp} value={form.alergias||""} onChange={e=>setForm(f=>({...f,alergias:e.target.value}))}/>
                </div>
                <div>
                  <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Contacto de emergencia</label>
                  <input style={inp} value={form.contactoEmergencia||""} onChange={e=>setForm(f=>({...f,contactoEmergencia:e.target.value}))}/>
                </div>
                <div>
                  <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Teléfono de emergencia</label>
                  <input style={inp} value={form.telefonoEmergencia||""} onChange={e=>setForm(f=>({...f,telefonoEmergencia:e.target.value}))}/>
                </div>
                <div style={{gridColumn:"1 / -1"}}>
                  <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Incapacidades / notas médicas</label>
                  <textarea rows={2} style={{...inp,resize:"vertical"}} value={form.incapacidades||""} onChange={e=>setForm(f=>({...f,incapacidades:e.target.value}))}/>
                </div>
                <div style={{gridColumn:"1 / -1",display:"flex",justifyContent:"flex-end"}}>
                  <button onClick={guardar} style={{
                    padding:"8px 18px",borderRadius:"9px",border:"none",
                    background:"#0F9DA6",color:"#1E2A4A",fontSize:"12px",fontWeight:700,
                    cursor:"pointer",fontFamily:"inherit",
                  }}>Guardar</button>
                </div>

                {(accidentes.length > 0 || dispensaciones.length > 0 || documentos.length > 0) && (
                  <div style={{gridColumn:"1 / -1",marginTop:"6px",paddingTop:"12px",borderTop:"1px solid #EAEDF2"}}>
                    {documentos.length > 0 && (
                      <div style={{marginBottom:"10px"}}>
                        <div style={{fontSize:"9.5px",color:"#2D4A7A",textTransform:"uppercase",fontWeight:700,marginBottom:"6px"}}>
                          Documentos (de Onboarding)
                        </div>
                        {documentos.map((d, i) => (
                          <div key={i} style={{fontSize:"11px",color:"#5C6579",marginBottom:"3px"}}>
                            📄 {d.fecha} · {d.nombre}
                          </div>
                        ))}
                      </div>
                    )}
                    {accidentes.length > 0 && (
                      <div style={{marginBottom:"10px"}}>
                        <div style={{fontSize:"9.5px",color:"#C0392B",textTransform:"uppercase",fontWeight:700,marginBottom:"6px"}}>
                          Accidentes registrados (de Enfermería)
                        </div>
                        {accidentes.map(a => (
                          <div key={a.id} style={{fontSize:"11px",color:"#5C6579",marginBottom:"3px"}}>
                            {a.fecha} · <b>{a.tipoLesion}</b> — {a.descripcion}
                          </div>
                        ))}
                      </div>
                    )}
                    {dispensaciones.length > 0 && (
                      <div>
                        <div style={{fontSize:"9.5px",color:"#0F9DA6",textTransform:"uppercase",fontWeight:700,marginBottom:"6px"}}>
                          Medicamentos recibidos (de Enfermería)
                        </div>
                        {dispensaciones.map(d => (
                          <div key={d.id} style={{fontSize:"11px",color:"#5C6579",marginBottom:"3px"}}>
                            {d.fecha} · {d.cantidad}x {d.medicamentoNombre}{d.motivo && ` (${d.motivo})`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
