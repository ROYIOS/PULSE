"use client";
import { useState, useEffect } from "react";
import { EMPLEADOS } from "@/lib/pulseData";
import { Pill, AlertTriangle, Plus, Trash2 } from "lucide-react";

interface Medicamento {
  id: number; nombre: string; cantidad: number; caducidad: string;
}
interface Dispensacion {
  id: number; medicamentoNombre: string; empleado: string; cantidad: number; fecha: string; motivo: string;
}
interface Accidente {
  id: number; empleado: string; fecha: string; descripcion: string;
  tipoLesion: string; atencionBrindada: string;
  medicamentos?: { nombre: string; cantidad: number }[];
}

function loadMeds(): Medicamento[] {
  try { return JSON.parse(localStorage.getItem("pulse_medicamentos") || "[]"); } catch { return []; }
}
function saveMeds(d: Medicamento[]) { localStorage.setItem("pulse_medicamentos", JSON.stringify(d)); }

function loadDispensaciones(): Dispensacion[] {
  try { return JSON.parse(localStorage.getItem("pulse_dispensaciones") || "[]"); } catch { return []; }
}
function saveDispensaciones(d: Dispensacion[]) { localStorage.setItem("pulse_dispensaciones", JSON.stringify(d)); }

function loadAccidentes(): Accidente[] {
  try { return JSON.parse(localStorage.getItem("pulse_accidentes") || "[]"); } catch { return []; }
}
function saveAccidentes(d: Accidente[]) { localStorage.setItem("pulse_accidentes", JSON.stringify(d)); }

export default function Enfermeria() {
  const [sub, setSub] = useState<"medicamentos"|"accidentes">("medicamentos");
  const [meds, setMeds] = useState<Medicamento[]>([]);
  const [dispensaciones, setDispensaciones] = useState<Dispensacion[]>([]);
  const [accidentes, setAccidentes] = useState<Accidente[]>([]);
  const [showMedForm, setShowMedForm] = useState(false);
  const [showAccForm, setShowAccForm] = useState(false);
  const [dispensarId, setDispensarId] = useState<number | null>(null);
  const [dispForm, setDispForm] = useState({ empleado: EMPLEADOS[0].nombre, cantidad: 1, motivo: "" });
  const [medForm, setMedForm] = useState({ nombre:"", cantidad:10, caducidad:"2027-01-01" });
  const [accForm, setAccForm] = useState({
    empleado: EMPLEADOS[0].nombre, fecha: new Date().toISOString().slice(0,10),
    descripcion:"", tipoLesion:"Golpe/contusión", atencionBrindada:"",
  });
  const [medsAccidente, setMedsAccidente] = useState<{ nombre: string; cantidad: number }[]>([]);

  useEffect(() => { setMeds(loadMeds()); setAccidentes(loadAccidentes()); setDispensaciones(loadDispensaciones()); }, []);

  function dispensar(med: Medicamento) {
    const cantidad = Math.min(dispForm.cantidad, med.cantidad);
    if (cantidad <= 0) return;
    const medsUpdated = meds.map(m => m.id === med.id ? { ...m, cantidad: m.cantidad - cantidad } : m);
    setMeds(medsUpdated); saveMeds(medsUpdated);

    const nuevaDisp: Dispensacion = {
      id: Date.now(), medicamentoNombre: med.nombre, empleado: dispForm.empleado,
      cantidad, fecha: new Date().toISOString().slice(0,10), motivo: dispForm.motivo,
    };
    const dispUpdated = [nuevaDisp, ...dispensaciones];
    setDispensaciones(dispUpdated); saveDispensaciones(dispUpdated);

    setDispensarId(null);
    setDispForm({ empleado: EMPLEADOS[0].nombre, cantidad: 1, motivo: "" });
  }

  function agregarMed() {
    if (!medForm.nombre.trim()) return;
    const updated = [{ id: Date.now(), ...medForm }, ...meds];
    setMeds(updated); saveMeds(updated);
    setMedForm({ nombre:"", cantidad:10, caducidad:"2027-01-01" });
    setShowMedForm(false);
  }
  function quitarMed(id: number) {
    const updated = meds.filter(m => m.id !== id);
    setMeds(updated); saveMeds(updated);
  }
  function ajustarCantidad(id: number, delta: number) {
    const updated = meds.map(m => m.id === id ? { ...m, cantidad: Math.max(0, m.cantidad + delta) } : m);
    setMeds(updated); saveMeds(updated);
  }

  function agregarAccidente() {
    if (!accForm.descripcion.trim()) return;
    const nuevo: Accidente = { id: Date.now(), ...accForm, medicamentos: medsAccidente.filter(m=>m.cantidad>0) };
    const updated = [nuevo, ...accidentes];
    setAccidentes(updated); saveAccidentes(updated);

    // Descontar del inventario y registrar la dispensación, ligada al mismo accidente
    if (medsAccidente.length > 0) {
      let medsActuales = meds;
      let dispActuales = dispensaciones;
      medsAccidente.filter(m=>m.cantidad>0).forEach(sel => {
        medsActuales = medsActuales.map(m => m.nombre === sel.nombre ? { ...m, cantidad: Math.max(0, m.cantidad - sel.cantidad) } : m);
        dispActuales = [{
          id: Date.now() + Math.random(), medicamentoNombre: sel.nombre, empleado: accForm.empleado,
          cantidad: sel.cantidad, fecha: accForm.fecha, motivo: `Accidente: ${accForm.tipoLesion}`,
        }, ...dispActuales];
      });
      setMeds(medsActuales); saveMeds(medsActuales);
      setDispensaciones(dispActuales); saveDispensaciones(dispActuales);
    }

    setAccForm({ empleado: EMPLEADOS[0].nombre, fecha: new Date().toISOString().slice(0,10), descripcion:"", tipoLesion:"Golpe/contusión", atencionBrindada:"" });
    setMedsAccidente([]);
    setShowAccForm(false);
  }

  const inp: React.CSSProperties = {
    width:"100%",padding:"9px 12px",borderRadius:"9px",
    border:"1.5px solid #DDE1EA",background:"#FFFFFF",
    color:"#1E2A4A",fontSize:"12.5px",outline:"none",
    boxSizing:"border-box",fontFamily:"inherit",
  };

  const hoy = new Date();

  return (
    <div className="glass-static" style={{borderRadius:"14px",overflow:"hidden"}}>
      <div style={{padding:"18px 22px",borderBottom:"1px solid #DDE1EA"}}>
        <span style={{fontSize:"14px",fontWeight:700,fontFamily:"'Sora', sans-serif",color:"#1E2A4A"}}>Enfermería</span>
        <p style={{fontSize:"11.5px",color:"#6B83A8",margin:"4px 0 0"}}>Control de medicamentos y registro de accidentes laborales</p>

        <div style={{display:"flex",gap:"6px",marginTop:"12px"}}>
          {[
            {key:"medicamentos", label:"Medicamentos", icon:Pill},
            {key:"accidentes",   label:"Accidentes",   icon:AlertTriangle},
          ].map(t => (
            <button key={t.key} onClick={()=>setSub(t.key as any)} style={{
              display:"flex",alignItems:"center",gap:"6px",
              padding:"6px 14px",borderRadius:"20px",fontSize:"11.5px",fontWeight:600,
              cursor:"pointer",fontFamily:"inherit",
              border: sub===t.key ? "1.5px solid #0F9DA6" : "1.5px solid #DDE1EA",
              background: sub===t.key ? "rgba(15,157,166,0.10)" : "transparent",
              color: sub===t.key ? "#0F9DA6" : "#6B83A8",
            }}><t.icon size={13}/> {t.label}</button>
          ))}
        </div>
      </div>

      {sub === "medicamentos" && (<>
        <div style={{padding:"14px 22px",display:"flex",justifyContent:"flex-end",borderBottom:"1px solid #EAEDF2"}}>
          <button onClick={()=>setShowMedForm(s=>!s)} style={{
            padding:"7px 15px",borderRadius:"9px",border:"none",
            background:"#0F9DA6",color:"#1E2A4A",fontSize:"11.5px",fontWeight:700,
            cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"5px",
          }}><Plus size={12}/> Agregar medicamento</button>
        </div>

        {showMedForm && (
          <div style={{padding:"16px 22px",borderBottom:"1px solid #EAEDF2",display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:"10px",alignItems:"end"}}>
            <div>
              <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Nombre</label>
              <input style={inp} value={medForm.nombre} onChange={e=>setMedForm(f=>({...f,nombre:e.target.value}))} placeholder="Ej. Paracetamol 500mg"/>
            </div>
            <div>
              <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Cantidad</label>
              <input type="number" style={inp} value={medForm.cantidad} onChange={e=>setMedForm(f=>({...f,cantidad:Number(e.target.value)}))}/>
            </div>
            <div>
              <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Caducidad</label>
              <input type="date" style={inp} value={medForm.caducidad} onChange={e=>setMedForm(f=>({...f,caducidad:e.target.value}))}/>
            </div>
            <button onClick={agregarMed} style={{
              padding:"9px 16px",borderRadius:"9px",border:"none",
              background:"#0F9DA6",color:"#1E2A4A",fontSize:"12px",fontWeight:700,
              cursor:"pointer",fontFamily:"inherit",height:"38px",
            }}>Guardar</button>
          </div>
        )}

        {meds.length === 0 ? (
          <div style={{padding:"30px",textAlign:"center",color:"#6B83A8",fontSize:"12.5px"}}>Sin medicamentos registrados.</div>
        ) : meds.map(m => {
          const caduco = new Date(m.caducidad) < hoy;
          const bajo = m.cantidad <= 3;
          const dispensando = dispensarId === m.id;
          return (
            <div key={m.id} style={{padding:"12px 22px",borderBottom:"1px solid #EAEDF2"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>{m.nombre}</div>
                  <div style={{fontSize:"10.5px",color: caduco ? "#C0392B" : "#6B83A8"}}>
                    Caduca {m.caducidad}{caduco ? " · CADUCADO" : ""}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <span style={{fontSize:"9px",padding:"3px 9px",borderRadius:"20px",fontWeight:700,
                    background: bajo ? "rgba(192,57,43,0.10)" : "rgba(46,125,91,0.10)",
                    color: bajo ? "#C0392B" : "#2E7D5B"}}>
                    {bajo ? "Stock bajo" : "Stock ok"}
                  </span>
                  <button onClick={()=>ajustarCantidad(m.id,-1)} style={{width:24,height:24,borderRadius:"6px",border:"1px solid #DDE1EA",background:"#FFFFFF",cursor:"pointer",color:"#5C6579"}}>−</button>
                  <span style={{fontSize:"13px",fontWeight:700,color:"#1E2A4A",minWidth:"18px",textAlign:"center"}}>{m.cantidad}</span>
                  <button onClick={()=>ajustarCantidad(m.id,1)} style={{width:24,height:24,borderRadius:"6px",border:"1px solid #DDE1EA",background:"#FFFFFF",cursor:"pointer",color:"#5C6579"}}>+</button>
                  <button onClick={()=>setDispensarId(dispensando ? null : m.id)} style={{
                    padding:"6px 12px",borderRadius:"8px",border:"1px solid #0F9DA6",
                    background: dispensando ? "rgba(15,157,166,0.10)" : "transparent",
                    color:"#0F9DA6",fontSize:"10.5px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",
                  }}>Dispensar</button>
                  <button onClick={()=>quitarMed(m.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#C0392B"}}><Trash2 size={13}/></button>
                </div>
              </div>

              {dispensando && (
                <div style={{marginTop:"10px",display:"flex",gap:"8px",alignItems:"end",flexWrap:"wrap",
                  padding:"10px",background:"#FAFCFF",borderRadius:"9px",border:"1px solid #EAEDF2"}}>
                  <div>
                    <label style={{fontSize:"9px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>A quién</label>
                    <select style={inp} value={dispForm.empleado} onChange={e=>setDispForm(f=>({...f,empleado:e.target.value}))}>
                      {EMPLEADOS.map(e => <option key={e.id}>{e.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:"9px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Cantidad</label>
                    <input type="number" min={1} max={m.cantidad} style={{...inp,width:"70px"}}
                      value={dispForm.cantidad} onChange={e=>setDispForm(f=>({...f,cantidad:Number(e.target.value)}))}/>
                  </div>
                  <div style={{flex:1,minWidth:"140px"}}>
                    <label style={{fontSize:"9px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Motivo</label>
                    <input style={{...inp,width:"100%",boxSizing:"border-box"}} value={dispForm.motivo}
                      onChange={e=>setDispForm(f=>({...f,motivo:e.target.value}))} placeholder="Ej. Dolor de cabeza"/>
                  </div>
                  <button onClick={()=>dispensar(m)} style={{
                    padding:"9px 16px",borderRadius:"9px",border:"none",height:"38px",
                    background:"#0F9DA6",color:"#1E2A4A",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                  }}>Confirmar</button>
                </div>
              )}
            </div>
          );
        })}

        {dispensaciones.length > 0 && (
          <div style={{padding:"14px 22px"}}>
            <div style={{fontSize:"10.5px",fontWeight:700,color:"#6B83A8",textTransform:"uppercase",marginBottom:"8px"}}>Historial de dispensación</div>
            <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
              {dispensaciones.slice(0,8).map(d => (
                <div key={d.id} style={{fontSize:"11px",color:"#5C6579"}}>
                  {d.fecha} · <b style={{color:"#1E2A4A"}}>{d.empleado}</b> recibió {d.cantidad}x {d.medicamentoNombre}{d.motivo && ` (${d.motivo})`}
                </div>
              ))}
            </div>
          </div>
        )}
      </>)}

      {sub === "accidentes" && (<>
        <div style={{padding:"14px 22px",display:"flex",justifyContent:"flex-end",borderBottom:"1px solid #EAEDF2"}}>
          <button onClick={()=>setShowAccForm(s=>!s)} style={{
            padding:"7px 15px",borderRadius:"9px",border:"none",
            background:"#0F9DA6",color:"#1E2A4A",fontSize:"11.5px",fontWeight:700,
            cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"5px",
          }}><Plus size={12}/> Registrar accidente</button>
        </div>

        {showAccForm && (
          <div style={{padding:"16px 22px",borderBottom:"1px solid #EAEDF2",display:"flex",flexDirection:"column",gap:"10px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
              <div>
                <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Empleado</label>
                <select style={inp} value={accForm.empleado} onChange={e=>setAccForm(f=>({...f,empleado:e.target.value}))}>
                  {EMPLEADOS.map(e => <option key={e.id}>{e.nombre}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Fecha</label>
                <input type="date" style={inp} value={accForm.fecha} onChange={e=>setAccForm(f=>({...f,fecha:e.target.value}))}/>
              </div>
              <div>
                <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Tipo de lesión</label>
                <select style={inp} value={accForm.tipoLesion} onChange={e=>setAccForm(f=>({...f,tipoLesion:e.target.value}))}>
                  {["Golpe/contusión","Corte/herida","Quemadura","Caída","Esguince/torcedura","Otro"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Descripción del incidente</label>
              <textarea rows={2} style={{...inp,resize:"vertical"}} value={accForm.descripcion} onChange={e=>setAccForm(f=>({...f,descripcion:e.target.value}))}/>
            </div>
            <div>
              <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Atención brindada</label>
              <input style={inp} value={accForm.atencionBrindada} onChange={e=>setAccForm(f=>({...f,atencionBrindada:e.target.value}))} placeholder="Ej. Curación menor, se envió a clínica..."/>
            </div>

            <div>
              <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:"6px"}}>
                Medicamentos administrados (opcional — se descuentan del inventario)
              </label>
              {meds.length === 0 ? (
                <p style={{fontSize:"11px",color:"#6B83A8"}}>No hay medicamentos en inventario todavía.</p>
              ) : meds.map(m => {
                const sel = medsAccidente.find(x => x.nombre === m.nombre);
                return (
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
                    <input
                      type="checkbox"
                      checked={!!sel}
                      onChange={e=>{
                        if (e.target.checked) setMedsAccidente(a=>[...a, { nombre: m.nombre, cantidad: 1 }]);
                        else setMedsAccidente(a=>a.filter(x=>x.nombre!==m.nombre));
                      }}
                    />
                    <span style={{fontSize:"12px",color:"#1E2A4A",flex:1}}>{m.nombre} <span style={{color:"#6B83A8"}}>({m.cantidad} disp.)</span></span>
                    {sel && (
                      <input type="number" min={1} max={m.cantidad} value={sel.cantidad} style={{...inp,width:"60px"}}
                        onChange={e=>setMedsAccidente(a=>a.map(x=>x.nombre===m.nombre?{...x,cantidad:Number(e.target.value)}:x))}/>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <button onClick={agregarAccidente} style={{
                padding:"9px 20px",borderRadius:"9px",border:"none",
                background:"#0F9DA6",color:"#1E2A4A",fontSize:"12.5px",fontWeight:700,
                cursor:"pointer",fontFamily:"inherit",
              }}>Guardar registro</button>
            </div>
          </div>
        )}

        {accidentes.length === 0 ? (
          <div style={{padding:"30px",textAlign:"center",color:"#6B83A8",fontSize:"12.5px"}}>Sin accidentes registrados. 🎉</div>
        ) : accidentes.map(a => (
          <div key={a.id} style={{padding:"14px 22px",borderBottom:"1px solid #EAEDF2"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"5px"}}>
              <span style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>{a.empleado}</span>
              <span style={{fontSize:"10.5px",color:"#6B83A8"}}>{a.fecha}</span>
            </div>
            <div style={{fontSize:"10px",fontWeight:700,color:"#C0392B",marginBottom:"4px"}}>{a.tipoLesion}</div>
            <div style={{fontSize:"11.5px",color:"#5C6579",marginBottom:"3px"}}>{a.descripcion}</div>
            {a.atencionBrindada && <div style={{fontSize:"11px",color:"#6B83A8"}}>Atención: {a.atencionBrindada}</div>}
            {a.medicamentos && a.medicamentos.length > 0 && (
              <div style={{fontSize:"11px",color:"#0F9DA6",marginTop:"3px"}}>
                💊 {a.medicamentos.map(m=>`${m.cantidad}x ${m.nombre}`).join(", ")}
              </div>
            )}
          </div>
        ))}
      </>)}
    </div>
  );
}
