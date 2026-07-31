"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, Clock, Calendar, FileText,
  ListChecks, Bell, BarChart2, LogOut,
} from "lucide-react";

const navItems = [
  { id:"dashboard",      href:"/dashboard",  label:"Dashboard",       icon:LayoutDashboard },
  { id:"incidencias",    href:"/dashboard",  label:"Incidencias",      icon:Clock },
  { id:"vacaciones",     href:"/dashboard",  label:"Vacaciones",       icon:Calendar },
  { id:"retardos",       href:"/dashboard",  label:"Formato Retardo",  icon:FileText },
  { id:"solicitudes",    href:"/dashboard",  label:"Mis solicitudes",  icon:ListChecks },
  { id:"notificaciones", href:"/dashboard",  label:"Notificaciones",   icon:Bell },
  { id:"gerencia",       href:"/gerencia",   label:"Gerencia",         icon:BarChart2 },
];

interface Props {
  activePage?: string;
  setActivePage?: (p: string) => void;
  onVacaciones?: () => void;
  onRetardo?: () => void;
}

export default function Sidebar({ activePage, setActivePage, onVacaciones, onRetardo }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const [hover, setHover] = useState<string|null>(null);

  function handleNav(item: typeof navItems[0]) {
    if (item.id === "vacaciones" && onVacaciones) { onVacaciones(); return; }
    if (item.id === "retardos"   && onRetardo)    { onRetardo();   return; }
    if (item.href !== pathname) {
      router.push(item.href);
    }
    setActivePage?.(item.id);
  }

  function handleLogout() {
    router.push("/");
  }

  const isActive = (item: typeof navItems[0]) => {
    if (item.id === "gerencia") return pathname === "/gerencia";
    if (pathname === "/gerencia") return false;
    return activePage ? activePage === item.id : pathname === item.href;
  };

  return (
    <aside style={{
      position:"fixed", top:0, left:0,
      width:"240px", height:"100vh",
      background:"#1E2A4A",
      display:"flex", flexDirection:"column",
      zIndex:100, overflowY:"auto",
    }}>
      {/* Logo */}
      <div style={{padding:"32px 24px 24px", borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
          <div style={{
            width:8, height:8, borderRadius:"50%",
            background:"#0F9DA6", boxShadow:"0 0 10px rgba(15,157,166,0.7)",
          }}/>
          <span style={{fontSize:"17px", fontWeight:600, letterSpacing:"6px", color:"#FFFFFF", fontFamily:"'Sora', sans-serif"}}>
            PULSE
          </span>
        </div>
        <p style={{fontSize:"9px", color:"#2A4060", letterSpacing:"2px",
          textTransform:"uppercase", marginTop:"6px", marginLeft:"18px"}}>
          Workforce Platform
        </p>
      </div>

      {/* Nav */}
      <nav style={{flex:1, padding:"20px 12px"}}>
        <p style={{fontSize:"9px", color:"#2A4060", letterSpacing:"2px",
          textTransform:"uppercase", padding:"0 12px", marginBottom:"8px"}}>
          Principal
        </p>
        {navItems.filter(i=>i.id!=="gerencia").map(item=>{
          const active = isActive(item);
          const hov    = hover === item.id;
          return (
            <div key={item.id}
              onClick={()=>handleNav(item)}
              onMouseEnter={()=>setHover(item.id)}
              onMouseLeave={()=>setHover(null)}
              style={{
                display:"flex", alignItems:"center", gap:"10px",
                padding:"10px 14px", borderRadius:"10px", marginBottom:"2px",
                cursor:"pointer", transition:"all .2s",
                background: active?"rgba(15,157,166,0.12)":hov?"rgba(255,255,255,0.04)":"transparent",
                color: active?"#0F9DA6":hov?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.4)",
              }}
            >
              <item.icon size={15}/>
              <span style={{fontSize:"13.5px", fontWeight:active?500:400}}>{item.label}</span>
              {active && (
                <div style={{marginLeft:"auto", width:5, height:5, borderRadius:"50%",
                  background:"#0F9DA6", boxShadow:"0 0 6px rgba(15,157,166,0.8)"}}/>
              )}
            </div>
          );
        })}

        {/* Separador Gerencia */}
        <p style={{fontSize:"9px", color:"#2A4060", letterSpacing:"2px",
          textTransform:"uppercase", padding:"0 12px", margin:"16px 0 8px"}}>
          Administración
        </p>
        {navItems.filter(i=>i.id==="gerencia").map(item=>{
          const active = isActive(item);
          const hov    = hover === item.id;
          return (
            <div key={item.id}
              onClick={()=>handleNav(item)}
              onMouseEnter={()=>setHover(item.id)}
              onMouseLeave={()=>setHover(null)}
              style={{
                display:"flex", alignItems:"center", gap:"10px",
                padding:"10px 14px", borderRadius:"10px", marginBottom:"2px",
                cursor:"pointer", transition:"all .2s",
                background: active?"rgba(15,157,166,0.12)":hov?"rgba(255,255,255,0.04)":"transparent",
                color: active?"#0F9DA6":hov?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.4)",
              }}
            >
              <item.icon size={15}/>
              <span style={{fontSize:"13.5px", fontWeight:active?500:400}}>{item.label}</span>
              {active && (
                <div style={{marginLeft:"auto", width:5, height:5, borderRadius:"50%",
                  background:"#0F9DA6", boxShadow:"0 0 6px rgba(15,157,166,0.8)"}}/>
              )}
            </div>
          );
        })}
      </nav>

      {/* Usuario + Cerrar sesión */}
      <div style={{padding:"16px 24px", borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px"}}>
          <div style={{
            width:36, height:36, borderRadius:"10px",
            background:"linear-gradient(135deg, #0F9DA6, #2D4A7A)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"13px", fontWeight:600, color:"#FFFFFF", flexShrink:0,
          }}>JR</div>
          <div>
            <p style={{fontSize:"13px", color:"#FFFFFF", fontWeight:500, margin:0}}>Jorge Ramírez</p>
            <p style={{fontSize:"11px", color:"#5C6579", margin:0, marginTop:"1px"}}>Producción · Turno A</p>
          </div>
        </div>
        <div
          onClick={handleLogout}
          onMouseEnter={e=>{
            (e.currentTarget as HTMLElement).style.background="rgba(192,57,43,0.10)";
            (e.currentTarget as HTMLElement).style.color="#C0392B";
          }}
          onMouseLeave={e=>{
            (e.currentTarget as HTMLElement).style.background="transparent";
            (e.currentTarget as HTMLElement).style.color="#5C6579";
          }}
          style={{
            display:"flex", alignItems:"center", gap:"8px",
            padding:"8px 12px", borderRadius:"8px", cursor:"pointer",
            color:"#5C6579", fontSize:"12px", transition:"all .2s",
          }}
        >
          <LogOut size={13}/> Cerrar sesión
        </div>
      </div>
    </aside>
  );
}
