"use client";
import { useState, useEffect } from "react";
import { EMPLEADOS, addNotif } from "@/lib/pulseData";
import { GraduationCap, Plus, Check, Mail, CalendarPlus } from "lucide-react";

interface Curso {
  id: number; nombre: string; horas: number; fecha: string;
  completadoPor: number[]; notificado: boolean;
}

function loadCursos(): Curso[] {
  try { return JSON.parse(localStorage.getItem("pulse_cursos") || "[]"); } catch { return []; }
}
function saveCursos(d: Curso[]) { localStorage.setItem("pulse_cursos", JSON.stringify(d)); }

function descargarICS(curso: Curso) {
  const fecha = curso.fecha.replace(/-/g, "");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Pulse//Cursos//ES",
    "BEGIN:VEVENT",
    `UID:${curso.id}@pulse`,
    `DTSTART;VALUE=DATE:${fecha}`,
    `DTEND;VALUE=DATE:${fecha}`,
    `SUMMARY:${curso.nombre}`,
    `DESCRIPTION:Capacitación de ${curso.horas}h agendada desde Pulse`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${curso.nombre}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: "", horas: 4, fecha: new Date().toISOString().slice(0,10) });
  const [expandido, setExpandido] = useState<number | null>(null);

  useEffect(() => { setCursos(loadCursos()); }, []);

  function agregar() {
    if (!form.nombre.trim()) return;
    const nuevo: Curso = { id: Date.now(), ...form, completadoPor: [], notificado: false };
    const updated = [nuevo, ...cursos];
    setCursos(updated); saveCursos(updated);
    setForm({ nombre: "", horas: 4, fecha: new Date().toISOString().slice(0,10) });
    setShowForm(false);
  }
  function toggleCompletado(cursoId: number, empId: number) {
    const updated = cursos.map(c => {
      if (c.id !== cursoId) return c;
      const yaCompleto = c.completadoPor.includes(empId);
      return { ...c, completadoPor: yaCompleto ? c.completadoPor.filter(id=>id!==empId) : [...c.completadoPor, empId] };
    });
    setCursos(updated); saveCursos(updated);
  }
  function notificar(cursoId: number) {
    const curso = cursos.find(c => c.id === cursoId);
    const updated = cursos.map(c => c.id===cursoId ? {...c, notificado:true} : c);
    setCursos(updated); saveCursos(updated);
    addNotif({
      tipo: "info",
      texto: `🎓 Nueva capacitación: "${curso?.nombre}" el ${curso?.fecha}. Agrégala a tu calendario.`,
      fecha: new Date().toISOString(),
    });
  }

  const inp: React.CSSProperties = {
    padding:"9px 12px",borderRadius:"9px",
    border:"1.5px solid #DDE1EA",background:"#FFFFFF",
    color:"#1E2A4A",fontSize:"12.5px",outline:"none",fontFamily:"inherit",
  };

  return (
    <div className="glass-static" style={{borderRadius:"14px",overflow:"hidden"}}>
      <div style={{padding:"18px 22px",borderBottom:"1px solid #DDE1EA",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <span style={{fontSize:"14px",fontWeight:700,fontFamily:"'Sora', sans-serif",color:"#1E2A4A"}}>Cursos y capacitaciones</span>
          <p style={{fontSize:"11.5px",color:"#6B83A8",margin:"4px 0 0"}}>{cursos.length} cursos disponibles</p>
        </div>
        <button onClick={()=>setShowForm(s=>!s)} style={{
          padding:"8px 16px",borderRadius:"9px",border:"none",
          background:"#0F9DA6",color:"#1E2A4A",fontSize:"12px",fontWeight:700,
          cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"5px",
        }}><Plus size={13}/> Nuevo curso</button>
      </div>

      {showForm && (
        <div style={{padding:"16px 22px",borderBottom:"1px solid #EAEDF2",display:"flex",gap:"10px",alignItems:"end",flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:"160px"}}>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Nombre del curso</label>
            <input style={{...inp,width:"100%",boxSizing:"border-box"}} value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} placeholder="Ej. Seguridad e higiene industrial"/>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Fecha</label>
            <input type="date" style={inp} value={form.fecha} onChange={e=>setForm(f=>({...f,fecha:e.target.value}))}/>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Horas</label>
            <input type="number" style={{...inp,width:"70px"}} value={form.horas} onChange={e=>setForm(f=>({...f,horas:Number(e.target.value)}))}/>
          </div>
          <button onClick={agregar} style={{
            padding:"9px 16px",borderRadius:"9px",border:"none",height:"38px",
            background:"#0F9DA6",color:"#1E2A4A",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",
          }}>Guardar</button>
        </div>
      )}

      {cursos.length === 0 ? (
        <div style={{padding:"30px",textAlign:"center",color:"#6B83A8",fontSize:"12.5px"}}>Sin cursos registrados.</div>
      ) : cursos.map(c => {
        const abierto = expandido === c.id;
        return (
          <div key={c.id} style={{padding:"14px 22px",borderBottom:"1px solid #EAEDF2"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}
              onClick={()=>setExpandido(abierto ? null : c.id)}>
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <GraduationCap size={16} color="#0F9DA6"/>
                <div>
                  <div style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>{c.nombre}</div>
                  <div style={{fontSize:"10.5px",color:"#6B83A8"}}>{c.horas}h · {c.fecha} · {c.completadoPor.length}/{EMPLEADOS.length} completado</div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"8px"}} onClick={e=>e.stopPropagation()}>
                <button onClick={()=>notificar(c.id)} disabled={c.notificado} title="Notificar por correo y en la app" style={{
                  display:"flex",alignItems:"center",gap:"5px",
                  padding:"5px 10px",borderRadius:"8px",fontSize:"10px",fontWeight:600,fontFamily:"inherit",
                  border:`1px solid ${c.notificado ? "#DDE1EA" : "#0F9DA6"}`,
                  background: c.notificado ? "#EAF1F4" : "transparent",
                  color: c.notificado ? "#6B83A8" : "#0F9DA6",
                  cursor: c.notificado ? "default" : "pointer",
                }}><Mail size={11}/> {c.notificado ? "Notificado" : "Notificar"}</button>
                <button onClick={()=>descargarICS(c)} title="Agregar a Outlook" style={{
                  display:"flex",alignItems:"center",gap:"5px",
                  padding:"5px 10px",borderRadius:"8px",fontSize:"10px",fontWeight:600,fontFamily:"inherit",
                  border:"1px solid #2D4A7A",background:"transparent",color:"#2D4A7A",cursor:"pointer",
                }}><CalendarPlus size={11}/> Outlook</button>
                <div style={{height:"6px",width:"70px",borderRadius:"4px",background:"#EAF1F4",overflow:"hidden"}}>
                  <div style={{height:"100%",background:"linear-gradient(90deg,#17B3C2,#0F9DA6)",
                    width:`${(c.completadoPor.length/EMPLEADOS.length)*100}%`}}/>
                </div>
              </div>
            </div>

            {abierto && (
              <div style={{marginTop:"12px",display:"flex",flexDirection:"column",gap:"6px",paddingLeft:"26px"}}>
                {EMPLEADOS.map(e => {
                  const done = c.completadoPor.includes(e.id);
                  return (
                    <div key={e.id} onClick={()=>toggleCompletado(c.id, e.id)} style={{
                      display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",padding:"4px 0",
                    }}>
                      <div style={{
                        width:16,height:16,borderRadius:"5px",flexShrink:0,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        background: done ? "#2E7D5B" : "#FFFFFF",
                        border: `1.5px solid ${done ? "#2E7D5B" : "#DDE1EA"}`,
                      }}>{done && <Check size={10} color="#FFFFFF"/>}</div>
                      <span style={{fontSize:"12px",color: done ? "#1E2A4A" : "#6B83A8"}}>{e.nombre}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
