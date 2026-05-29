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
      border:"1.5px solid #D8E6F0",padding:"40px 22px",
      boxShadow:"0 1px 4px rgba(10,22,40,.05)",
      display:"flex",flexDirection:"column",alignItems:"center",gap:"12px",
    }}>
      <Bell size={28} color="#D8E6F0"/>
      <p style={{fontSize:"13px",color:"#8BA3BF",margin:0}}>No hay notificaciones nuevas</p>
    </div>
  );

  return (
    <div style={{
      background:"#FFFFFF",borderRadius:"12px",
      border:"1.5px solid #D8E6F0",overflow:"hidden",
      boxShadow:"0 1px 4px rgba(10,22,40,.05)",
    }}>
      <div style={{padding:"16px 22px",borderBottom:"1px solid #F4F8FB",
        display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{fontSize:"13px",fontWeight:600,color:"#0A1628"}}>Notificaciones</span>
          <span style={{
            fontSize:"10px",fontWeight:700,color:"#FFFFFF",
            background:"#D85A30",borderRadius:"20px",padding:"1px 7px",
          }}>{notifs.length}</span>
        </div>
        <button onClick={clearAll} style={{
          fontSize:"11px",color:"#8BA3BF",background:"none",
          border:"none",cursor:"pointer",fontFamily:"inherit",
        }}>Limpiar todo</button>
      </div>

      {notifs.map((n,i)=>(
        <div key={i} style={{
          display:"flex",alignItems:"flex-start",gap:"12px",
          padding:"14px 22px",
          borderBottom:i<notifs.length-1?"1px solid #F4F8FB":"none",
          background:"#FFFFFF",
        }}>
          <div style={{flexShrink:0,marginTop:"1px"}}>
            {n.tipo==="success"
              ? <CheckCircle size={16} color="#0F6E56"/>
              : <XCircle    size={16} color="#C83232"/>
            }
          </div>
          <div style={{flex:1}}>
            <p style={{fontSize:"13px",color:"#0A1628",margin:0,lineHeight:1.4}}>{n.texto}</p>
            <p style={{fontSize:"10px",color:"#8BA3BF",marginTop:"4px"}}>
              {new Date(n.fecha).toLocaleString("es-MX",{
                day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"
              })}
            </p>
          </div>
          <div style={{
            width:8,height:8,borderRadius:"50%",flexShrink:0,marginTop:"4px",
            background:n.tipo==="success"?"#0F6E56":"#C83232",
          }}/>
        </div>
      ))}
    </div>
  );
}
