"use client";
import { useState, useEffect } from "react";
import { EMPLEADOS } from "@/lib/pulseData";

interface Evaluacion {
  id: number; empleado: string; periodo: string;
  desempeno: number; actitud: number; puntualidad: number;
  comentarios: string; fecha: string;
}

function loadEvals(): Evaluacion[] {
  try { return JSON.parse(localStorage.getItem("pulse_evaluaciones") || "[]"); }
  catch { return []; }
}
function saveEvals(data: Evaluacion[]) {
  localStorage.setItem("pulse_evaluaciones", JSON.stringify(data));
}

function Estrellas({ value, onChange }: { value: number; onChange?: (v:number)=>void }) {
  return (
    <div style={{display:"flex",gap:"3px"}}>
      {[1,2,3,4,5].map(n => (
        <span key={n} onClick={()=>onChange?.(n)} style={{
          cursor: onChange ? "pointer" : "default",
          color: n<=value ? "#C08A2E" : "#DDE1EA", fontSize:"15px",
        }}>★</span>
      ))}
    </div>
  );
}

export default function Evaluaciones() {
  const [evals, setEvals] = useState<Evaluacion[]>([]);
  const [form, setForm] = useState({
    empleado: EMPLEADOS[0].nombre, periodo: "Q2 2026",
    desempeno: 4, actitud: 4, puntualidad: 4, comentarios: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { setEvals(loadEvals()); }, []);

  function crear() {
    const nueva: Evaluacion = {
      id: Date.now(), ...form,
      fecha: new Date().toISOString().slice(0,10),
    };
    const updated = [nueva, ...evals];
    setEvals(updated);
    saveEvals(updated);
    setShowForm(false);
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
          <span style={{fontSize:"14px",fontWeight:700,fontFamily:"'Sora', sans-serif",color:"#1E2A4A"}}>Evaluación de empleados</span>
          <p style={{fontSize:"11.5px",color:"#6B83A8",margin:"4px 0 0"}}>{evals.length} evaluaciones registradas</p>
        </div>
        <button onClick={()=>setShowForm(s=>!s)} style={{
          padding:"8px 16px",borderRadius:"9px",border:"none",
          background:"#0F9DA6",color:"#1E2A4A",fontSize:"12px",fontWeight:700,
          cursor:"pointer",fontFamily:"inherit",
        }}>{showForm ? "Cancelar" : "+ Nueva evaluación"}</button>
      </div>

      {showForm && (
        <div style={{padding:"18px 22px",borderBottom:"1px solid #EAEDF2",display:"flex",flexDirection:"column",gap:"12px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
            <div>
              <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Empleado</label>
              <select style={inp} value={form.empleado} onChange={e=>setForm(f=>({...f,empleado:e.target.value}))}>
                {EMPLEADOS.map(e => <option key={e.id}>{e.nombre}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Periodo</label>
              <input style={inp} value={form.periodo} onChange={e=>setForm(f=>({...f,periodo:e.target.value}))}/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
            {(["desempeno","actitud","puntualidad"] as const).map(campo => (
              <div key={campo}>
                <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:"4px"}}>
                  {campo}
                </label>
                <Estrellas value={form[campo]} onChange={v=>setForm(f=>({...f,[campo]:v}))}/>
              </div>
            ))}
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Comentarios</label>
            <textarea rows={2} style={{...inp,resize:"vertical"}} value={form.comentarios} onChange={e=>setForm(f=>({...f,comentarios:e.target.value}))}/>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <button onClick={crear} style={{
              padding:"9px 20px",borderRadius:"9px",border:"none",
              background:"#0F9DA6",color:"#1E2A4A",fontSize:"12.5px",fontWeight:700,
              cursor:"pointer",fontFamily:"inherit",
            }}>Guardar evaluación</button>
          </div>
        </div>
      )}

      {evals.length === 0 ? (
        <div style={{padding:"30px",textAlign:"center",color:"#6B83A8",fontSize:"12.5px"}}>
          Aún no hay evaluaciones registradas.
        </div>
      ) : evals.map(ev => (
        <div key={ev.id} style={{padding:"14px 22px",borderBottom:"1px solid #EAEDF2"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
            <div style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>{ev.empleado}</div>
            <div style={{fontSize:"10.5px",color:"#6B83A8"}}>{ev.periodo} · {ev.fecha}</div>
          </div>
          <div style={{display:"flex",gap:"18px",marginBottom:"6px"}}>
            <div><span style={{fontSize:"10px",color:"#6B83A8"}}>Desempeño</span> <Estrellas value={ev.desempeno}/></div>
            <div><span style={{fontSize:"10px",color:"#6B83A8"}}>Actitud</span> <Estrellas value={ev.actitud}/></div>
            <div><span style={{fontSize:"10px",color:"#6B83A8"}}>Puntualidad</span> <Estrellas value={ev.puntualidad}/></div>
          </div>
          {ev.comentarios && <div style={{fontSize:"11.5px",color:"#5C6579"}}>{ev.comentarios}</div>}
        </div>
      ))}
    </div>
  );
}
