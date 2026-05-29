"use client";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ModalVacaciones({ open, onClose, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);
  const [inicio, setInicio]   = useState("2026-05-26");
  const [fin, setFin]         = useState("2026-05-30");
  const [motivo, setMotivo]   = useState("Descanso personal y viaje familiar.");
  const [cobertura, setCobertura] = useState("María García");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    // Calcular días hábiles
    const d1   = new Date(inicio);
    const d2   = new Date(fin);
    const diff = Math.ceil((d2.getTime()-d1.getTime())/(1000*60*60*24))+1;

    // Guardar solicitud en localStorage para que gerencia la vea
    try {
      const prev = JSON.parse(localStorage.getItem("pulse_vacaciones") || "[]");
      const nueva = {
        id: Date.now(),
        empleado: "Jorge Ramírez",
        inicio,
        fin,
        dias: diff,
        motivo,
        cobertura,
        status: "pendiente",
      };
      localStorage.setItem("pulse_vacaciones", JSON.stringify([nueva, ...prev]));
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
            <h2 style={{fontSize:"18px",fontWeight:600,color:"#0A1628",margin:0}}>Solicitar Vacaciones</h2>
            <p style={{fontSize:"12px",color:"#8BA3BF",marginTop:"3px"}}>12 días disponibles</p>
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
                  textTransform:"uppercase",letterSpacing:"1px",marginBottom:"7px"}}>Fecha inicio</label>
                <input type="date" value={inicio} onChange={e=>setInicio(e.target.value)}
                  required style={inp}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#4A6080",
                  textTransform:"uppercase",letterSpacing:"1px",marginBottom:"7px"}}>Fecha fin</label>
                <input type="date" value={fin} onChange={e=>setFin(e.target.value)}
                  required style={inp}/>
              </div>
            </div>

            <div>
              <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#4A6080",
                textTransform:"uppercase",letterSpacing:"1px",marginBottom:"7px"}}>Motivo</label>
              <textarea rows={3} value={motivo} onChange={e=>setMotivo(e.target.value)}
                style={{...inp,resize:"vertical"}}/>
            </div>

            <div>
              <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#4A6080",
                textTransform:"uppercase",letterSpacing:"1px",marginBottom:"7px"}}>Quién cubrirá</label>
              <select value={cobertura} onChange={e=>setCobertura(e.target.value)} style={inp}>
                <option>María García</option>
                <option>Carlos López</option>
                <option>Ana Martínez</option>
              </select>
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
              {loading ? <><Loader2 size={14} className="animate-spin"/> Enviando...</> : "Enviar solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
