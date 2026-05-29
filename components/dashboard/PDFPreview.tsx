"use client";
import { useState } from "react";
import { X, Download, Send } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tipo: "retardo" | "vacaciones";
  datos: {
    nombre: string; fecha: string; motivo: string;
    area: string; hora?: string; dias?: string;
  };
}

export default function PDFPreview({ open, onClose, onConfirm, tipo, datos }: Props) {
  const [sending, setSending] = useState(false);
  const folio = `PLS-${Math.floor(Math.random()*9000)+1000}`;

  async function handleConfirm() {
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    onConfirm();
  }

  function handleDownload() {
    const titulo = tipo==="retardo" ? "FORMATO DE RETARDO" : "SOLICITUD DE VACACIONES";
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>${titulo} - PULSE</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',Arial,sans-serif;color:#0A1628;background:#fff;padding:40px}
    .header{background:#0A1628;color:#fff;padding:24px 32px;border-radius:12px;
      display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}
    .logo{font-size:22px;font-weight:300;letter-spacing:8px}
    .logo span{color:#00B4D8}
    .folio{text-align:right;font-size:12px;color:#8BA3BF}
    .folio strong{color:#00B4D8;font-size:16px;display:block}
    h1{font-size:20px;font-weight:700;color:#0A1628;padding-bottom:12px;
      border-bottom:3px solid #00B4D8;margin-bottom:24px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
    .field label{font-size:10px;text-transform:uppercase;letter-spacing:1px;
      color:#8BA3BF;font-weight:600;display:block;margin-bottom:4px}
    .field p{font-size:14px;color:#0A1628;font-weight:500;
      border-bottom:1px solid #D8E6F0;padding-bottom:8px}
    .motivo{margin-bottom:32px}
    .firmas{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px}
    .firma{border-top:1.5px solid #D8E6F0;padding-top:8px;
      text-align:center;font-size:10px;text-transform:uppercase;
      letter-spacing:1px;color:#8BA3BF}
    .status{margin-top:24px;padding:10px 16px;border:1px solid rgba(216,90,48,.3);
      border-radius:8px;background:rgba(216,90,48,.05);
      font-size:12px;color:#D85A30;display:flex;align-items:center;gap:8px}
    @media print{body{padding:20px}}
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">P<span>U</span>LSE</div>
      <div style="font-size:10px;color:#4A6080;margin-top:4px;letter-spacing:2px">
        PEOPLE & WORKFORCE MANAGEMENT
      </div>
    </div>
    <div class="folio">
      Folio<strong>${folio}</strong>
      ${new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"long",year:"numeric"})}
    </div>
  </div>

  <h1>${titulo}</h1>

  <div class="grid">
    <div class="field">
      <label>Nombre del empleado</label>
      <p>${datos.nombre}</p>
    </div>
    <div class="field">
      <label>Área / Departamento</label>
      <p>${datos.area}</p>
    </div>
    <div class="field">
      <label>${tipo==="retardo"?"Fecha del retardo":"Período solicitado"}</label>
      <p>${datos.fecha}</p>
    </div>
    <div class="field">
      <label>${tipo==="retardo"?"Hora de llegada":"Total de días"}</label>
      <p>${tipo==="retardo"?datos.hora||"—":datos.dias||"—"}</p>
    </div>
  </div>

  <div class="motivo">
    <div class="field">
      <label>Motivo / Descripción</label>
      <p style="border:none;padding:12px;background:#F4F8FB;border-radius:8px;line-height:1.6">
        ${datos.motivo}
      </p>
    </div>
  </div>

  <div class="status">
    ⏳ Pendiente de aprobación — enviado a líder directo y RRHH
  </div>

  <div class="firmas">
    <div class="firma">Firma del empleado</div>
    <div class="firma">Autorización RRHH</div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], {type:"text/html"});
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url,"_blank");
    if(win) {
      win.onload = ()=>{
        win.print();
        URL.revokeObjectURL(url);
      };
    }
  }

  if (!open) return null;

  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,background:"rgba(10,22,40,0.6)",
      display:"flex",alignItems:"center",justifyContent:"center",
      zIndex:1000,backdropFilter:"blur(6px)",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:"540px",background:"#FFFFFF",
        borderRadius:"20px",overflow:"hidden",
        boxShadow:"0 32px 80px rgba(10,22,40,0.25)",
      }}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"22px 28px",background:"#0A1628"}}>
          <span style={{fontSize:"15px",fontWeight:600,color:"#FFFFFF"}}>
            Vista previa — {tipo==="retardo"?"Formato de Retardo":"Solicitud de Vacaciones"}
          </span>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:"7px",
            border:"none",background:"rgba(255,255,255,0.08)",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",color:"#8BA3BF"}}>
            <X size={14}/>
          </button>
        </div>

        {/* Preview */}
        <div style={{padding:"24px",background:"#F4F8FB"}}>
          <div style={{background:"#FFFFFF",borderRadius:"12px",
            boxShadow:"0 4px 20px rgba(10,22,40,0.08)",overflow:"hidden"}}>

            {/* Doc header */}
            <div style={{background:"#0A1628",padding:"18px 24px",
              display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:"#00B4D8"}}/>
                  <span style={{fontSize:"16px",fontWeight:300,letterSpacing:"6px",color:"#FFFFFF"}}>PULSE</span>
                </div>
                <p style={{fontSize:"9px",color:"#4A6080",letterSpacing:"2px",
                  textTransform:"uppercase",marginTop:"3px",marginLeft:"14px"}}>
                  People & Workforce Management
                </p>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{fontSize:"9px",color:"#4A6080",margin:0}}>Folio</p>
                <p style={{fontSize:"14px",color:"#00B4D8",fontWeight:700,margin:0}}>{folio}</p>
              </div>
            </div>

            {/* Title */}
            <div style={{padding:"18px 24px 0",borderBottom:"2px solid #00B4D8"}}>
              <h3 style={{fontSize:"15px",fontWeight:700,color:"#0A1628",margin:"0 0 14px"}}>
                {tipo==="retardo"?"FORMATO DE RETARDO":"SOLICITUD DE VACACIONES"}
              </h3>
            </div>

            {/* Fields */}
            <div style={{padding:"18px 24px",display:"grid",
              gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              {[
                {label:"Empleado", value:datos.nombre},
                {label:"Área",     value:datos.area},
                {label:tipo==="retardo"?"Fecha":"Período", value:datos.fecha},
                {label:tipo==="retardo"?"Hora llegada":"Días", value:tipo==="retardo"?datos.hora||"—":datos.dias||"—"},
              ].map(f=>(
                <div key={f.label} style={{borderBottom:"1px solid #F4F8FB",paddingBottom:"10px"}}>
                  <p style={{fontSize:"9px",color:"#8BA3BF",textTransform:"uppercase",
                    letterSpacing:"1px",margin:"0 0 3px"}}>{f.label}</p>
                  <p style={{fontSize:"13px",color:"#0A1628",fontWeight:500,margin:0}}>{f.value}</p>
                </div>
              ))}
              <div style={{gridColumn:"1/-1",borderBottom:"1px solid #F4F8FB",paddingBottom:"10px"}}>
                <p style={{fontSize:"9px",color:"#8BA3BF",textTransform:"uppercase",
                  letterSpacing:"1px",margin:"0 0 3px"}}>Motivo</p>
                <p style={{fontSize:"13px",color:"#0A1628",margin:0,lineHeight:1.5}}>{datos.motivo}</p>
              </div>
            </div>

            {/* Status */}
            <div style={{margin:"0 24px 20px",padding:"8px 12px",borderRadius:"8px",
              background:"rgba(216,90,48,0.06)",border:"1px solid rgba(216,90,48,0.2)",
              display:"flex",alignItems:"center",gap:"8px"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#D85A30",flexShrink:0}}/>
              <span style={{fontSize:"11px",color:"#D85A30"}}>
                Pendiente de aprobación — se enviará a tu líder directo
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:"10px",justifyContent:"flex-end",
          padding:"18px 28px",borderTop:"1px solid #D8E6F0"}}>
          <button onClick={onClose} style={{
            padding:"11px 18px",borderRadius:"10px",border:"1.5px solid #D8E6F0",
            background:"transparent",color:"#4A6080",fontSize:"13px",
            fontWeight:500,cursor:"pointer",fontFamily:"inherit",
            display:"flex",alignItems:"center",gap:"6px"}}>
            <X size={13}/> Cancelar
          </button>
          <button onClick={handleDownload} style={{
            padding:"11px 18px",borderRadius:"10px",border:"1.5px solid #D8E6F0",
            background:"transparent",color:"#4A6080",fontSize:"13px",
            fontWeight:500,cursor:"pointer",fontFamily:"inherit",
            display:"flex",alignItems:"center",gap:"6px"}}>
            <Download size={13}/> Descargar PDF
          </button>
          <button onClick={handleConfirm} disabled={sending} style={{
            padding:"11px 22px",borderRadius:"10px",border:"none",
            background:"#00B4D8",color:"#0A1628",fontSize:"13px",fontWeight:700,
            cursor:sending?"not-allowed":"pointer",fontFamily:"inherit",
            opacity:sending?0.7:1,display:"flex",alignItems:"center",gap:"6px",
            boxShadow:"0 4px 14px rgba(0,180,216,0.28)"}}>
            {sending?"Enviando...":<><Send size={13}/> Confirmar y enviar</>}
          </button>
        </div>
      </div>
    </div>
  );
}
