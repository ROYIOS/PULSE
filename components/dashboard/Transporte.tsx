"use client";
import { useState, useEffect } from "react";
import { Truck, Plus, MapPin } from "lucide-react";

interface Viaje {
  id: number; unidad: string; conductor: string; destino: string;
  horaSalida: string; ubicacionActual: string; estado: "En ruta" | "Finalizado";
}

function loadViajes(): Viaje[] {
  try { return JSON.parse(localStorage.getItem("pulse_transporte") || "[]"); } catch { return []; }
}
function saveViajes(d: Viaje[]) { localStorage.setItem("pulse_transporte", JSON.stringify(d)); }

export default function Transporte() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ unidad: "", conductor: "", destino: "", ubicacionActual: "" });

  useEffect(() => { setViajes(loadViajes()); }, []);

  function agregar() {
    if (!form.unidad.trim() || !form.destino.trim()) return;
    const nuevo: Viaje = {
      id: Date.now(), ...form,
      horaSalida: new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}),
      estado: "En ruta",
    };
    const updated = [nuevo, ...viajes];
    setViajes(updated); saveViajes(updated);
    setForm({ unidad:"", conductor:"", destino:"", ubicacionActual:"" });
    setShowForm(false);
  }
  function actualizarUbicacion(id: number, ubicacionActual: string) {
    const updated = viajes.map(v => v.id === id ? { ...v, ubicacionActual } : v);
    setViajes(updated); saveViajes(updated);
  }
  function finalizar(id: number) {
    const updated = viajes.map(v => v.id === id ? { ...v, estado: "Finalizado" as const } : v);
    setViajes(updated); saveViajes(updated);
  }

  const inp: React.CSSProperties = {
    width:"100%",padding:"9px 12px",borderRadius:"9px",
    border:"1.5px solid #DDE1EA",background:"#FFFFFF",
    color:"#1E2A4A",fontSize:"12.5px",outline:"none",
    boxSizing:"border-box",fontFamily:"inherit",
  };

  const enRuta = viajes.filter(v => v.estado === "En ruta");

  return (
    <div className="glass-static" style={{borderRadius:"14px",overflow:"hidden"}}>
      <div style={{padding:"18px 22px",borderBottom:"1px solid #DDE1EA",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <span style={{fontSize:"14px",fontWeight:700,fontFamily:"'Sora', sans-serif",color:"#1E2A4A"}}>Transporte de la empresa</span>
          <p style={{fontSize:"11.5px",color:"#6B83A8",margin:"4px 0 0"}}>{enRuta.length} unidades en ruta ahora</p>
        </div>
        <button onClick={()=>setShowForm(s=>!s)} style={{
          padding:"8px 16px",borderRadius:"9px",border:"none",
          background:"#0F9DA6",color:"#1E2A4A",fontSize:"12px",fontWeight:700,
          cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"5px",
        }}><Plus size={13}/> Registrar salida</button>
      </div>

      <div style={{padding:"10px 22px",background:"rgba(192,138,46,0.06)",borderBottom:"1px solid rgba(192,138,46,0.15)"}}>
        <p style={{fontSize:"10.5px",color:"#C08A2E",margin:0}}>
          ⚠️ La ubicación se actualiza manualmente por ahora. Para verla en tiempo real real hace falta integrar GPS
          (ej. una app en el celular del conductor u OBD del vehículo) que reporte la posición automáticamente.
        </p>
      </div>

      {showForm && (
        <div style={{padding:"16px 22px",borderBottom:"1px solid #EAEDF2",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Unidad</label>
            <input style={inp} value={form.unidad} onChange={e=>setForm(f=>({...f,unidad:e.target.value}))} placeholder="Ej. Camioneta 03"/>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Conductor</label>
            <input style={inp} value={form.conductor} onChange={e=>setForm(f=>({...f,conductor:e.target.value}))}/>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Destino</label>
            <input style={inp} value={form.destino} onChange={e=>setForm(f=>({...f,destino:e.target.value}))}/>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Ubicación actual</label>
            <input style={inp} value={form.ubicacionActual} onChange={e=>setForm(f=>({...f,ubicacionActual:e.target.value}))} placeholder="Ej. Saliendo de planta"/>
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

      {viajes.length === 0 ? (
        <div style={{padding:"30px",textAlign:"center",color:"#6B83A8",fontSize:"12.5px"}}>Sin viajes registrados.</div>
      ) : viajes.map(v => (
        <div key={v.id} style={{padding:"14px 22px",borderBottom:"1px solid #EAEDF2"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
              <Truck size={15} color={v.estado==="En ruta" ? "#0F9DA6" : "#9AA7B8"}/>
              <span style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>{v.unidad}</span>
              <span style={{fontSize:"10.5px",color:"#6B83A8"}}>{v.conductor && `· ${v.conductor}`}</span>
            </div>
            <span style={{fontSize:"9px",padding:"3px 9px",borderRadius:"20px",fontWeight:700,
              background: v.estado==="En ruta" ? "rgba(15,157,166,0.10)" : "rgba(154,167,184,0.15)",
              color: v.estado==="En ruta" ? "#0F9DA6" : "#6B83A8"}}>{v.estado}</span>
          </div>
          <div style={{fontSize:"11.5px",color:"#5C6579",marginBottom:"6px"}}>Destino: {v.destino} · salió {v.horaSalida}</div>
          {v.estado === "En ruta" ? (
            <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
              <MapPin size={12} color="#C08A2E"/>
              <input
                style={{...inp,flex:1,fontSize:"11.5px",padding:"6px 10px"}}
                value={v.ubicacionActual}
                onChange={e=>actualizarUbicacion(v.id, e.target.value)}
                placeholder="Actualizar ubicación..."
              />
              <button onClick={()=>finalizar(v.id)} style={{
                padding:"6px 12px",borderRadius:"8px",border:"1px solid #DDE1EA",
                background:"transparent",color:"#6B83A8",fontSize:"10.5px",fontWeight:600,
                cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",
              }}>Marcar llegada</button>
            </div>
          ) : (
            <div style={{fontSize:"11px",color:"#6B83A8"}}>📍 Última ubicación: {v.ubicacionActual || "—"}</div>
          )}
        </div>
      ))}
    </div>
  );
}
