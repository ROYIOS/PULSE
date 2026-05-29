"use client";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ModalRetardo({ open, onClose, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);
  const [fecha, setFecha]     = useState("2026-05-22");
  const [hora, setHora]       = useState("08:22");
  const [causa, setCausa]     = useState("Tráfico / accidente vial");
  const [desc, setDesc]       = useState("Accidente vehicular en Av. Insurgentes que generó congestionamiento vial severo.");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    try {
      const prev = JSON.parse(localStorage.getItem("pulse_incidencias") || "[]");
      const nueva = {
        id: Date.now(),
        empleado: "Jorge Ramírez",
        tipo: "Retardo",
        fecha,
        hora,
        causa,
        desc,
        status: "pendiente",
      };
      localStorage.setItem("pulse_incidencias", JSON.stringify([nueva, ...prev]));
    } catch(_){}

    setLoading(false);
    onSubmit();
  }

  if (!open) return null;

  const inp: React.CSSProperties = {
    width:"100%",padding:"11px 14px",borderRadius:"10px",
    border:"1.5px solid #D8E6F0",background:"#F4F8FB",
    color:"#0A1628",fontSize:"13px",outline:"none",
    boxSizing:"border-box",fontFamily:"inherit",
  };

  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,background:"rgba(10,22,40,0.5)",
      display:"flex",alignItems:"center",justifyContent:"center",
      zIndex:999,backdropFilter:"blur(4px)",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:"460px",background:"#FFFFFF",
        borderRadius:"20px",overflow:"hidden",
        boxShadow:"0 24px 60px rgba(10,22,40,0.20)",
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"24px 28px 20px",borderBottom:"1px solid #D8E6F0"}}>
          <div>
            <h2 style={{fontSize:"18px",fontWeight:600,color:"#0A1628",margin:0}}>Formato de Retardo</h2>
            <p style={{fontSize:"12px",color:"#8BA3BF",marginTop:"3px"}}>{fecha}</p>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:"8px",border:"none",
            background:"#F4F8FB",cursor:"pointer",display:"flex",alignItems:"center",
            justifyContent:"center",color:"#8BA3BF"}}>
            <X size={15}/>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{padding:"24px 28px",display:"flex",flexDirection:"column",gap:"16px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div>
                <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#4A6080",
                  textTransform:"uppercase",letterSpacing:"1px",marginBottom:"7px"}}>Fecha</label>
                <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)}
                  required style={inp}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#4A6080",
                  textTransform:"uppercase",letterSpacing:"1px",marginBottom:"7px"}}>Hora llegada</label>
                <input type="time" value={hora} onChange={e=>setHora(e.target.value)}
                  required style={inp}/>
              </div>
            </div>

            <div>
              <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#4A6080",
                textTransform:"uppercase",letterSpacing:"1px",marginBottom:"7px"}}>Causa</label>
              <select value={causa} onChange={e=>setCausa(e.target.value)} style={inp}>
                <option>Tráfico / accidente vial</option>
                <option>Cita médica</option>
                <option>Falla de transporte público</option>
                <option>Emergencia familiar</option>
                <option>Otro</option>
              </select>
            </div>

            <div>
              <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#4A6080",
                textTransform:"uppercase",letterSpacing:"1px",marginBottom:"7px"}}>Descripción</label>
              <textarea rows={3} value={desc} onChange={e=>setDesc(e.target.value)}
                style={{...inp,resize:"vertical"}}/>
            </div>
          </div>

          <div style={{display:"flex",gap:"10px",justifyContent:"flex-end",
            padding:"20px 28px",borderTop:"1px solid #D8E6F0"}}>
            <button type="button" onClick={onClose} style={{
              padding:"11px 20px",borderRadius:"10px",border:"1.5px solid #D8E6F0",
              background:"transparent",color:"#4A6080",fontSize:"13px",
              fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={{
              padding:"11px 22px",borderRadius:"10px",border:"none",
              background:"#00B4D8",color:"#0A1628",fontSize:"13px",fontWeight:700,
              cursor:"pointer",fontFamily:"inherit",display:"flex",
              alignItems:"center",gap:"7px",
              boxShadow:"0 4px 14px rgba(0,180,216,0.28)"}}>
              {loading ? <><Loader2 size={14} className="animate-spin"/> Generando...</> : "Generar y enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
