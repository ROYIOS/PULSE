"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import StatCard from "@/components/dashboard/StatCard";
import IncidenciasTable from "@/components/dashboard/IncidenciasTable";
import QuickActions from "@/components/dashboard/QuickActions";
import MiniCalendar from "@/components/dashboard/MiniCalendar";
import QuincenaBoard from "@/components/dashboard/QuincenaBoard";
import CalendarioArea from "@/components/dashboard/CalendarioArea";
import ModalVacaciones from "@/components/dashboard/ModalVacaciones";
import ModalRetardo from "@/components/dashboard/ModalRetardo";
import PDFPreview from "@/components/dashboard/PDFPreview";
import Toast from "@/components/dashboard/Toast";
import Notificaciones from "@/components/dashboard/Notificaciones";
import { Bell, Plus, Calendar } from "lucide-react";

export default function DashboardPage() {
 const [modalVac,   setModalVac]   = useState(false);
 const [modalRet,   setModalRet]   = useState(false);
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
     display:"flex", minHeight:"100vh", background:"#F4F8FB",
     fontFamily:"'Plus Jakarta Sans', sans-serif",
   }}>
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
           <h1 style={{fontSize:"24px",fontWeight:600,color:"#0A1628",margin:0}}>
             Mi Panel
           </h1>
           <p style={{fontSize:"13px",color:"#8BA3BF",marginTop:"4px"}}>
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
               border:"1.5px solid #D8E6F0",background:"#FFFFFF",
               color:"#0A1628",fontSize:"13px",fontWeight:500,
               cursor:"pointer",fontFamily:"inherit",transition:"all .2s",
             }}
             onMouseEnter={e=>{
               (e.currentTarget as HTMLElement).style.borderColor="#00B4D8";
               (e.currentTarget as HTMLElement).style.color="#00B4D8";
             }}
             onMouseLeave={e=>{
               (e.currentTarget as HTMLElement).style.borderColor="#D8E6F0";
               (e.currentTarget as HTMLElement).style.color="#0A1628";
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
               border:"none",background:"#00B4D8",
               color:"#0A1628",fontSize:"13px",fontWeight:700,
               cursor:"pointer",fontFamily:"inherit",
               boxShadow:"0 4px 14px rgba(0,180,216,0.28)",
               transition:"all .2s",
             }}
             onMouseEnter={e=>{
               (e.currentTarget as HTMLElement).style.transform="translateY(-1px)";
               (e.currentTarget as HTMLElement).style.boxShadow="0 8px 20px rgba(0,180,216,0.38)";
             }}
             onMouseLeave={e=>{
               (e.currentTarget as HTMLElement).style.transform="translateY(0)";
               (e.currentTarget as HTMLElement).style.boxShadow="0 4px 14px rgba(0,180,216,0.28)";
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
                 border:`1.5px solid ${showNotifs?"#00B4D8":"#D8E6F0"}`,
                 background:"#FFFFFF",display:"flex",
                 alignItems:"center",justifyContent:"center",
                 cursor:"pointer",position:"relative",transition:"all .2s",
               }}
             >
               <Bell size={16} color={showNotifs?"#00B4D8":"#4A6080"}/>
               {notifCount>0 && (
                 <div style={{
                   position:"absolute",top:"6px",right:"6px",
                   width:"8px",height:"8px",borderRadius:"50%",
                   background:"#D85A30",border:"2px solid #F4F8FB",
                 }}/>
               )}
             </div>

             {/* Panel desplegable */}
             {showNotifs && (
               <div style={{
                 position:"absolute",top:"48px",right:0,
                 width:"360px",zIndex:200,
                 borderRadius:"12px",overflow:"hidden",
                 boxShadow:"0 16px 40px rgba(10,22,40,.15)",
                 border:"1.5px solid #D8E6F0",
                 animation:"fadeDown .2s ease",
               }}>
                 <Notificaciones onUpdate={refreshNotifCount}/>
               </div>
             )}
           </div>
         </div>
       </div>

       {/* STATS */}
       <div style={{
         display:"grid",gridTemplateColumns:"repeat(4,1fr)",
         gap:"16px",marginBottom:"24px",
       }}>
         <StatCard label="Días de vacaciones" value="12"  sub="disponibles de 20"     color="#00B4D8" progress={60}/>
         <StatCard label="Retardos este mes"   value="2"   sub="máx permitido: 3"      color="#D85A30" progress={66}/>
         <StatCard label="Asistencia mensual"  value="97%" sub="18 de 19 días hábiles" color="#0F6E56" progress={97}/>
         <StatCard label="Solicitudes activas" value="1"   sub="en revisión por RRHH"  color="#00B4D8" progress={50}/>
       </div>

       {/* QUINCENA */}
       <div style={{marginBottom:"24px"}}>
         <QuincenaBoard/>
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
           />
           <MiniCalendar/>
         </div>
       </div>

       <CalendarioArea/>
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
