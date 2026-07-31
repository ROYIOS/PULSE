"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Bell } from "lucide-react";

interface Notif {
  tipo: "success" | "error";
  texto: string;
  fecha: string;
}
export default function Notificaciones({ onUpdate }: { onUpdate?: () => void }) {

  const [notifs, setNotifs] = useState<Notif[]>([]);

  useEffect(()=>{
    function load() {
      try {
        const data = JSON.parse(localStorage.getItem("pulse_notifs")||"[]");
        setNotifs(data);
      } catch(_){}
    }
    load();
    // Recargar si la ventana vuelve a tener foco (vienen de gerencia)
    window.addEventListener("focus", load);
    return ()=>window.removeEventListener("focus", load);
  },[]);

  function clearAll() {
    localStorage.removeItem("pulse_notifs");
    setNotifs([]);
  }

  if(notifs.length===0) return (
    <div style={{
      background:"#FFFFFF",borderRadius:"12px",
      border:"1.5px solid #DDE1EA",padding:"40px 22px",
      boxShadow:"0 1px 4px rgba(10,22,40,.05)",
      display:"flex",flexDirection:"column",alignItems:"center",gap:"12px",
    }}>
      <Bell size={28} color="#DDE1EA"/>
      <p style={{fontSize:"13px",color:"#6B83A8",margin:0}}>No hay notificaciones nuevas</p>
    </div>
  );

  return (
    <div style={{
      background:"rgba(255,255,255,0.72)",backdropFilter:"blur(16px) saturate(160%)",WebkitBackdropFilter:"blur(16px) saturate(160%)",borderRadius:"12px",
      border:"1px solid rgba(255,255,255,0.9)",overflow:"hidden",
      boxShadow:"0 1px 4px rgba(28,43,74,.05)",
    }}>
      <div style={{padding:"16px 22px",borderBottom:"1px solid #EAEDF2",
        display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>Notificaciones</span>
          <span style={{
            fontSize:"10px",fontWeight:700,color:"#FFFFFF",
            background:"#C0392B",borderRadius:"20px",padding:"1px 7px",
          }}>{notifs.length}</span>
        </div>
        <button onClick={clearAll} style={{
          fontSize:"11px",color:"#6B83A8",background:"none",
          border:"none",cursor:"pointer",fontFamily:"inherit",
        }}>Limpiar todo</button>
      </div>

      {notifs.map((n,i)=>(
        <div key={i} style={{
          display:"flex",alignItems:"flex-start",gap:"12px",
          padding:"14px 22px",
          borderBottom:i<notifs.length-1?"1px solid #EAEDF2":"none",
          background:"#FFFFFF",
        }}>
          <div style={{flexShrink:0,marginTop:"1px"}}>
            {n.tipo==="success"
              ? <CheckCircle size={16} color="#2E7D5B"/>
              : <XCircle    size={16} color="#C83232"/>
            }
          </div>
          <div style={{flex:1}}>
            <p style={{fontSize:"13px",color:"#1E2A4A",margin:0,lineHeight:1.4}}>{n.texto}</p>
            <p style={{fontSize:"10px",color:"#6B83A8",marginTop:"4px"}}>
              {new Date(n.fecha).toLocaleString("es-MX",{
                day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"
              })}
            </p>
          </div>
          <div style={{
            width:8,height:8,borderRadius:"50%",flexShrink:0,marginTop:"4px",
            background:n.tipo==="success"?"#2E7D5B":"#C83232",
          }}/>
        </div>
      ))}
    </div>
  );
}
