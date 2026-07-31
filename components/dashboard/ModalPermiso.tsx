"use client";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { crearIncidencia } from "@/lib/pulseData";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const TIPOS = ["Permiso", "Falta justificada", "Falta injustificada"];

export default function ModalPermiso({ open, onClose, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo]       = useState(TIPOS[0]);
  const [fecha, setFecha]     = useState("2026-05-26");
  const [motivo, setMotivo]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    crearIncidencia("Jorge Ramírez", tipo, fecha);
    setLoading(false);
    onSubmit();
  }

  if (!open) return null;

  const inp: React.CSSProperties = {
    width:"100%",padding:"11px 14px",borderRadius:"10px",
    border:"1.5px solid #DDE1EA",background:"#FFFFFF",
    color:"#1E2A4A",fontSize:"13px",outline:"none",
    boxSizing:"border-box",fontFamily:"inherit",
  };

  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,background:"rgba(30,42,74,0.5)",
      display:"flex",alignItems:"center",justifyContent:"center",
      zIndex:999,backdropFilter:"blur(4px)",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:"440px",background:"rgba(255,255,255,0.94)",backdropFilter:"blur(20px) saturate(160%)",WebkitBackdropFilter:"blur(20px) saturate(160%)",
        borderRadius:"20px",overflow:"hidden",border:"1px solid rgba(255,255,255,0.9)",
        boxShadow:"0 24px 60px rgba(28,43,74,0.20)",
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"24px 28px 20px",borderBottom:"1px solid #DDE1EA"}}>
          <div>
            <h2 style={{fontSize:"18px",fontWeight:600,color:"#1E2A4A",margin:0}}>Solicitar permiso o falta</h2>
            <p style={{fontSize:"12px",color:"#6B83A8",marginTop:"3px"}}>Queda pendiente de revisión por RH</p>
          </div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:"8px",border:"none",
            background:"#FFFFFF",cursor:"pointer",display:"flex",alignItems:"center",
            justifyContent:"center",color:"#6B83A8"}}>
            <X size={15}/>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{padding:"24px 28px",display:"flex",flexDirection:"column",gap:"16px"}}>
            <div>
              <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#5C6579",
                textTransform:"uppercase",letterSpacing:"1px",marginBottom:"7px"}}>Tipo</label>
              <select value={tipo} onChange={e=>setTipo(e.target.value)} style={inp}>
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#5C6579",
                textTransform:"uppercase",letterSpacing:"1px",marginBottom:"7px"}}>Fecha</label>
              <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} required style={inp}/>
            </div>

            <div>
              <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#5C6579",
                textTransform:"uppercase",letterSpacing:"1px",marginBottom:"7px"}}>Motivo (opcional)</label>
              <textarea rows={3} value={motivo} onChange={e=>setMotivo(e.target.value)}
                placeholder="Cuéntanos brevemente el motivo..." style={{...inp,resize:"vertical"}}/>
            </div>
          </div>

          <div style={{display:"flex",gap:"10px",justifyContent:"flex-end",
            padding:"20px 28px",borderTop:"1px solid #DDE1EA"}}>
            <button type="button" onClick={onClose} style={{
              padding:"11px 20px",borderRadius:"10px",border:"1.5px solid #DDE1EA",
              background:"transparent",color:"#5C6579",fontSize:"13px",
              fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={{
              padding:"11px 22px",borderRadius:"10px",border:"none",
              background:"#0F9DA6",color:"#1E2A4A",fontSize:"13px",fontWeight:700,
              cursor:"pointer",fontFamily:"inherit",display:"flex",
              alignItems:"center",gap:"7px",
              boxShadow:"0 4px 14px rgba(15,157,166,0.28)"}}>
              {loading ? <><Loader2 size={14} className="animate-spin"/> Enviando...</> : "Enviar solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
