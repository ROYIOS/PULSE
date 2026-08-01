"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TitoOverlay from "@/components/dashboard/TitoOverlay";
import StatCard from "@/components/dashboard/StatCard";
import ProgressRing from "@/components/dashboard/ProgressRing";
import Checador from "@/components/dashboard/Checador";
import ExpedienteMedico from "@/components/dashboard/ExpedienteMedico";
import Convenios from "@/components/dashboard/Convenios";
import MisActivos from "@/components/dashboard/MisActivos";
import IncidenciasTable from "@/components/dashboard/IncidenciasTable";
import QuickActions from "@/components/dashboard/QuickActions";
import MiniCalendar from "@/components/dashboard/MiniCalendar";
import QuincenaBoard from "@/components/dashboard/QuincenaBoard";
import CalendarioArea from "@/components/dashboard/CalendarioArea";
import ModalVacaciones from "@/components/dashboard/ModalVacaciones";
import ModalRetardo from "@/components/dashboard/ModalRetardo";
import ModalPermiso from "@/components/dashboard/ModalPermiso";
import PDFPreview from "@/components/dashboard/PDFPreview";
import Toast from "@/components/dashboard/Toast";
import Notificaciones from "@/components/dashboard/Notificaciones";
import { Bell, Plus, Calendar } from "lucide-react";

export default function DashboardPage() {
 const [modalVac,   setModalVac]   = useState(false);
 const [modalRet,   setModalRet]   = useState(false);
 const [modalPermiso, setModalPermiso] = useState(false);
 const [pdfPreview, setPdfPreview] = useState(false);
 const [pdfTipo,    setPdfTipo]    = useState<"retardo"|"vacaciones">("retardo");
 const [toast,      setToast]      = useState("");
 const [activePage, setActivePage] = useState("dashboard");
 const [showNotifs, setShowNotifs] = useState(false);
 const [notifCount, setNotifCount] = useState(0);
 const notifRef = useRef<HTMLDivElement>(null);

 // Contar notificaciones al cargar y al volver al foco
 useEffect(()=>{
   function countNotifs() {
     try {
       const data = JSON.parse(localStorage.getItem("pulse_notifs")||"[]");
       setNotifCount(data.length);
     } catch(_){}
   }
   countNotifs();
   window.addEventListener("focus", countNotifs);
   return ()=>window.removeEventListener("focus", countNotifs);
 },[]);

 // Cerrar panel de notificaciones al click fuera
 useEffect(()=>{
   function handleClickOutside(e: MouseEvent) {
     if(notifRef.current && !notifRef.current.contains(e.target as Node)){
       setShowNotifs(false);
     }
   }
   if(showNotifs) document.addEventListener("mousedown", handleClickOutside);
   return ()=>document.removeEventListener("mousedown", handleClickOutside);
 },[showNotifs]);

 function refreshNotifCount() {
   try {
     const data = JSON.parse(localStorage.getItem("pulse_notifs")||"[]");
     setNotifCount(data.length);
   } catch(_){}
 }

 function showToast(msg: string) {
   setToast(msg);
   setTimeout(()=>setToast(""), 3500);
 }

 function handleRetardoSubmit() {
   setModalRet(false);
   setPdfTipo("retardo");
   setPdfPreview(true);
 }

 function handleVacacionesSubmit() {
   setModalVac(false);
   setPdfTipo("vacaciones");
   setPdfPreview(true);
 }

 function handlePermisoSubmit() {
   setModalPermiso(false);
   showToast("✅ Solicitud de permiso/falta enviada a RRHH");
 }

 function handlePDFConfirm() {
   setPdfPreview(false);
   showToast(
     pdfTipo==="retardo"
       ? "✅ Formato de retardo enviado a RRHH"
       : "✅ Solicitud de vacaciones enviada a RRHH"
   );
 }

 const pdfDatos = {
   nombre: "Jorge Ramírez",
   area:   "Producción · Planta A",
   fecha:  pdfTipo==="retardo" ? "22 de mayo 2026" : "19–23 mayo 2026",
   motivo: pdfTipo==="retardo"
     ? "Accidente vehicular en Av. Insurgentes que generó congestionamiento vial severo."
     : "Descanso personal y viaje familiar.",
   hora: "08:22",
   dias: "5 días hábiles",
 };

 return (
   <div style={{
     display:"flex", minHeight:"100vh", background:"#FFFFFF",
     fontFamily:"'Inter', sans-serif", position:"relative",
   }}>
     <TitoOverlay/>
     <Sidebar
       activePage={activePage}
       setActivePage={setActivePage}
       onVacaciones={()=>setModalVac(true)}
       onRetardo={()=>setModalRet(true)}
     />

     <main style={{
       flex:1, marginLeft:"240px",
       padding:"36px 40px", overflowY:"auto",
     }}>

       {/* TOPBAR */}
       <div style={{
         display:"flex", alignItems:"center",
         justifyContent:"space-between", marginBottom:"36px",
       }}>
         <div>
           <h1 style={{fontSize:"24px",fontWeight:600,color:"#1E2A4A",margin:0}}>
             Mi Panel
           </h1>
           <p style={{fontSize:"13px",color:"#6B83A8",marginTop:"4px"}}>
             Bienvenido, Jorge —{" "}
             {new Date().toLocaleDateString("es-MX",{
               weekday:"long",year:"numeric",month:"long",day:"numeric",
             })}
           </p>
         </div>

         <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
           {/* Botón retardo */}
           <button
             onClick={()=>setModalRet(true)}
             style={{
               display:"flex",alignItems:"center",gap:"6px",
               padding:"10px 18px",borderRadius:"10px",
               border:"1.5px solid #DDE1EA",background:"#FFFFFF",
               color:"#1E2A4A",fontSize:"13px",fontWeight:500,
               cursor:"pointer",fontFamily:"inherit",transition:"all .2s",
             }}
             onMouseEnter={e=>{
               (e.currentTarget as HTMLElement).style.borderColor="#0F9DA6";
               (e.currentTarget as HTMLElement).style.color="#0F9DA6";
             }}
             onMouseLeave={e=>{
               (e.currentTarget as HTMLElement).style.borderColor="#DDE1EA";
               (e.currentTarget as HTMLElement).style.color="#1E2A4A";
             }}
           >
             <Plus size={14}/> Formato Retardo
           </button>

           {/* Botón vacaciones */}
           <button
             onClick={()=>setModalVac(true)}
             style={{
               display:"flex",alignItems:"center",gap:"6px",
               padding:"10px 18px",borderRadius:"10px",
               border:"none",background:"#0F9DA6",
               color:"#1E2A4A",fontSize:"13px",fontWeight:700,
               cursor:"pointer",fontFamily:"inherit",
               boxShadow:"0 4px 14px rgba(15,157,166,0.28)",
               transition:"all .2s",
             }}
             onMouseEnter={e=>{
               (e.currentTarget as HTMLElement).style.transform="translateY(-1px)";
               (e.currentTarget as HTMLElement).style.boxShadow="0 8px 20px rgba(15,157,166,0.38)";
             }}
             onMouseLeave={e=>{
               (e.currentTarget as HTMLElement).style.transform="translateY(0)";
               (e.currentTarget as HTMLElement).style.boxShadow="0 4px 14px rgba(15,157,166,0.28)";
             }}
           >
             <Calendar size={14}/> Solicitar Vacaciones
           </button>

           {/* Campana con panel de notificaciones */}
           <div ref={notifRef} style={{position:"relative"}}>
             <div
               onClick={()=>setShowNotifs(p=>!p)}
               style={{
                 width:"40px",height:"40px",borderRadius:"10px",
                 border:`1.5px solid ${showNotifs?"#0F9DA6":"#DDE1EA"}`,
                 background:"#FFFFFF",display:"flex",
                 alignItems:"center",justifyContent:"center",
                 cursor:"pointer",position:"relative",transition:"all .2s",
               }}
             >
               <Bell size={16} color={showNotifs?"#0F9DA6":"#5C6579"}/>
               {notifCount>0 && (
                 <div style={{
                   position:"absolute",top:"6px",right:"6px",
                   width:"8px",height:"8px",borderRadius:"50%",
                   background:"#C0392B",border:"2px solid #EAEDF2",
                 }}/>
               )}
             </div>

             {/* Panel desplegable */}
             {showNotifs && (
               <div style={{
                 position:"absolute",top:"48px",right:0,
                 width:"360px",zIndex:200,
                 borderRadius:"12px",overflow:"hidden",
                 boxShadow:"0 16px 40px rgba(30,42,74,.15)",
                 border:"1.5px solid #DDE1EA",
                 animation:"fadeDown .2s ease",
               }}>
                 <Notificaciones onUpdate={refreshNotifCount}/>
               </div>
             )}
           </div>
         </div>
       </div>

       {activePage === "calendario" ? (
         <CalendarioArea/>
       ) : activePage === "expediente" ? (
         <ExpedienteMedico soloEmpleadoId={7}/>
       ) : activePage === "convenios" ? (
         <Convenios soloLectura={true}/>
       ) : activePage === "activos" ? (
         <MisActivos nombreEmpleado="Jorge Ramírez"/>
       ) : (<>
         {/* CHECADOR */}
         <Checador/>

         {/* PANORAMA */}
         <div className="glass-static" style={{
           borderRadius:"18px", padding:"20px 24px", marginBottom:"18px",
         }}>
           <div style={{
             display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"16px",
             marginBottom:"18px",
           }}>
             <div>
               <div style={{fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:"15px", color:"#1E2A4A"}}>Panorama</div>
               <div style={{fontSize:"11.5px", color:"#6B83A8", marginTop:"2px"}}>Tu resumen del mes</div>
             </div>
             <div style={{display:"flex", gap:"20px"}}>
               <ProgressRing value={97} label="Asistencia" color="#0F9DA6"/>
               <ProgressRing value={92} label="Puntualidad" color="#2D4A7A"/>
               <ProgressRing value={60} label="Vacaciones" color="#C08A2E"/>
             </div>
           </div>
           <div style={{ paddingTop:"16px", borderTop:"1px solid #EAEDF2" }}>
             <QuincenaBoard/>
           </div>
         </div>

         {/* STATS */}
         <div style={{
           display:"grid",gridTemplateColumns:"repeat(4,1fr)",
           gap:"16px",marginBottom:"24px",
         }}>
           <StatCard label="Días de vacaciones" value="12"  sub="disponibles de 20"     color="#0F9DA6" progress={60}/>
           <StatCard label="Retardos este mes"   value="2"   sub="máx permitido: 3"      color="#C0392B" progress={66}/>
           <StatCard label="Asistencia mensual"  value="97%" sub="18 de 19 días hábiles" color="#2E7D5B" progress={97}/>
           <StatCard label="Solicitudes activas" value="1"   sub="en revisión por RRHH"  color="#0F9DA6" progress={50}/>
         </div>

         {/* DOS COLUMNAS */}
         <div style={{
           display:"grid",gridTemplateColumns:"1.5fr 1fr",
           gap:"20px",marginBottom:"24px",
         }}>
           <IncidenciasTable/>
           <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
             <QuickActions
               onVacaciones={()=>setModalVac(true)}
               onRetardo={()=>setModalRet(true)}
               onPermiso={()=>setModalPermiso(true)}
             />
             <MiniCalendar/>
           </div>
         </div>
       </>)}
     </main>

     {/* MODALES */}
     <ModalVacaciones
       open={modalVac}
       onClose={()=>setModalVac(false)}
       onSubmit={handleVacacionesSubmit}
     />
     <ModalRetardo
       open={modalRet}
       onClose={()=>setModalRet(false)}
       onSubmit={handleRetardoSubmit}
     />
     <ModalPermiso
       open={modalPermiso}
       onClose={()=>setModalPermiso(false)}
       onSubmit={handlePermisoSubmit}
     />
     <PDFPreview
       open={pdfPreview}
       onClose={()=>setPdfPreview(false)}
       onConfirm={handlePDFConfirm}
       tipo={pdfTipo}
       datos={pdfDatos}
     />
     <Toast message={toast}/>

     <style>{`
       @keyframes fadeDown {
         from { opacity:0; transform:translateY(-8px) }
         to   { opacity:1; transform:translateY(0) }
       }
     `}</style>
   </div>
 );
}
