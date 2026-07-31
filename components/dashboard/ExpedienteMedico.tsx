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
}

function loadExpedientes(): Record<number, Expediente> {
  try { return JSON.parse(localStorage.getItem("pulse_expedientes") || "{}"); }
  catch { return {}; }
}
function saveExpedientes(data: Record<number, Expediente>) {
  localStorage.setItem("pulse_expedientes", JSON.stringify(data));
}

export default function ExpedienteMedico() {
  const [data, setData] = useState<Record<number, Expediente>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Expediente>>({});

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
        <p style={{fontSize:"11.5px",color:"#6B83A8",margin:"4px 0 0"}}>Información sensible — solo visible para RH/Gerencia</p>
      </div>

      {EMPLEADOS.map(e => {
        const exp = data[e.id];
        const abierto = editId === e.id;
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
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
