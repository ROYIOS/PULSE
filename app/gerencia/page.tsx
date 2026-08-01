"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { BarChart2, Users, Clock, Calendar, Eye, EyeOff, Download, Check } from "lucide-react";
import AsistenciaGrid from "@/components/dashboard/AsistenciaGrid";
import ProgressRing from "@/components/dashboard/ProgressRing";
import ExpedienteMedico from "@/components/dashboard/ExpedienteMedico";
import Evaluaciones from "@/components/dashboard/Evaluaciones";
import Encuestas from "@/components/dashboard/Encuestas";
import Enfermeria from "@/components/dashboard/Enfermeria";
import Onboarding from "@/components/dashboard/Onboarding";
import Activos from "@/components/dashboard/Activos";
import Reclutamiento from "@/components/dashboard/Reclutamiento";
import Cursos from "@/components/dashboard/Cursos";
import Convenios from "@/components/dashboard/Convenios";
import Transporte from "@/components/dashboard/Transporte";
import {
  Status, Incidencia, Vacacion, Empleado,
  INC_DEFAULT, VAC_DEFAULT, EMPLEADOS, TOTAL_HORAS, calcNomina, descargarReciboNomina,
} from "@/lib/pulseData";

type Rol = "gerente" | "rrhh" | "nomina";

const AREAS = Array.from(new Set(EMPLEADOS.map(e => e.area)));
function areaDe(nombreEmpleado: string): string {
  return EMPLEADOS.find(e => e.nombre === nombreEmpleado)?.area || "Sin área";
}

function FiltroAreas({ seleccion, onChange }: { seleccion: string[]; onChange: (a: string[]) => void }) {
  function toggle(area: string) {
    onChange(seleccion.includes(area) ? seleccion.filter(a => a !== area) : [...seleccion, area]);
  }
  return (
    <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"14px"}}>
      {AREAS.map(area => {
        const activo = seleccion.includes(area);
        return (
          <button key={area} onClick={()=>toggle(area)} style={{
            padding:"5px 12px",borderRadius:"20px",fontSize:"11px",fontWeight:600,
            cursor:"pointer",fontFamily:"inherit",
            border: activo ? "1.5px solid #0F9DA6" : "1.5px solid #DDE1EA",
            background: activo ? "rgba(15,157,166,0.10)" : "transparent",
            color: activo ? "#0F9DA6" : "#6B83A8",
          }}>{area}</button>
        );
      })}
      {seleccion.length > 0 && (
        <button onClick={()=>onChange([])} style={{
          padding:"5px 12px",borderRadius:"20px",fontSize:"11px",fontWeight:600,
          cursor:"pointer",fontFamily:"inherit",border:"none",background:"none",
          color:"#C0392B",textDecoration:"underline",
        }}>Limpiar filtro</button>
      )}
    </div>
  );
}

function Badge({ s }: { s: string }) {
  const map: Record<string,{bg:string;color:string}> = {
    pendiente:{bg:"rgba(192,57,43,.10)",  color:"#C0392B"},
    aprobada: {bg:"rgba(46,125,91,.10)",  color:"#2E7D5B"},
    rechazada:{bg:"rgba(200,50,50,.10)",  color:"#C83232"},
  };
  const st = map[s]||{bg:"#f4f4f4",color:"#666"};
  return (
    <span style={{fontSize:"10px",fontWeight:600,padding:"3px 10px",
      borderRadius:"20px",background:st.bg,color:st.color}}>
      {s.charAt(0).toUpperCase()+s.slice(1)}
    </span>
  );
}

function ActionBtns({ onAprobar, onRechazar }: { onAprobar:()=>void; onRechazar:()=>void }) {
  return (
    <div style={{display:"flex",gap:"6px"}}>
      <button onClick={onAprobar} style={{
        padding:"5px 14px",borderRadius:"20px",border:"none",
        background:"rgba(46,125,91,.12)",color:"#2E7D5B",
        fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",
        transition:"all .15s",
      }}>✓ Aprobar</button>
      <button onClick={onRechazar} style={{
        padding:"5px 14px",borderRadius:"20px",border:"none",
        background:"rgba(200,50,50,.08)",color:"#C83232",
        fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",
        transition:"all .15s",
      }}>✗ Rechazar</button>
    </div>
  );
}

export default function GerenciaPage() {
  const rol: Rol    = "gerente";
  const puedeNomina = rol==="gerente"||rol==="nomina";

  const [tab, setTab]               = useState<"incidencias"|"vacaciones"|"horas"|"nomina"|"expediente"|"evaluaciones"|"encuestas"|"enfermeria"|"onboarding"|"activos"|"reclutamiento"|"cursos"|"convenios"|"transporte">("incidencias");
  const [incidencias, setInc]       = useState<Incidencia[]>(INC_DEFAULT);
  const [vacaciones,  setVac]       = useState<Vacacion[]>(VAC_DEFAULT);
  const [filtroAreas, setFiltroAreas] = useState<string[]>([]);
  const [kpiExtra, setKpiExtra] = useState<any>(null);

  useEffect(() => {
    try {
      if (tab === "expediente" || tab === "enfermeria") {
        setKpiExtra({
          expedientes: JSON.parse(localStorage.getItem("pulse_expedientes")||"{}"),
          accidentes: JSON.parse(localStorage.getItem("pulse_accidentes")||"[]"),
          dispensaciones: JSON.parse(localStorage.getItem("pulse_dispensaciones")||"[]"),
          medicamentos: JSON.parse(localStorage.getItem("pulse_medicamentos")||"[]"),
        });
      } else if (tab === "evaluaciones") {
        setKpiExtra({ evaluaciones: JSON.parse(localStorage.getItem("pulse_evaluaciones")||"[]") });
      } else if (tab === "encuestas") {
        setKpiExtra({ encuestas: JSON.parse(localStorage.getItem("pulse_encuestas")||"[]") });
      } else if (tab === "onboarding") {
        setKpiExtra({
          checklists: JSON.parse(localStorage.getItem("pulse_onboarding")||"[]"),
          documentos: JSON.parse(localStorage.getItem("pulse_documentos")||"{}"),
        });
      } else if (tab === "activos") {
        setKpiExtra({ activos: JSON.parse(localStorage.getItem("pulse_activos")||"[]") });
      } else if (tab === "reclutamiento") {
        setKpiExtra({ candidatos: JSON.parse(localStorage.getItem("pulse_candidatos")||"[]") });
      } else if (tab === "cursos") {
        setKpiExtra({ cursos: JSON.parse(localStorage.getItem("pulse_cursos")||"[]") });
      } else if (tab === "convenios") {
        setKpiExtra({ convenios: JSON.parse(localStorage.getItem("pulse_convenios")||"[]") });
      } else if (tab === "transporte") {
        setKpiExtra({ viajes: JSON.parse(localStorage.getItem("pulse_transporte")||"[]") });
      } else {
        setKpiExtra(null);
      }
    } catch(_) { setKpiExtra(null); }
  }, [tab]);
  const [showMontos, setShowMontos] = useState(false);
  const [toast, setToast]           = useState("");

  // Cargar estado guardado
  useEffect(()=>{
    try {
      const inc = localStorage.getItem("pulse_incidencias");
      const vac = localStorage.getItem("pulse_vacaciones");
      if(inc) setInc(JSON.parse(inc));
      if(vac) setVac(JSON.parse(vac));
    } catch(_){}
  },[]);

  function saveInc(data: Incidencia[]) {
    setInc(data);
    localStorage.setItem("pulse_incidencias", JSON.stringify(data));
  }
  function saveVac(data: Vacacion[]) {
    setVac(data);
    localStorage.setItem("pulse_vacaciones", JSON.stringify(data));
  }

  function accionInc(id: number, accion: Status) {
    const updated = incidencias.map(i=>i.id===id?{...i,status:accion}:i);
    saveInc(updated);
    const item = incidencias.find(i=>i.id===id);
    // Guardar notificación para el empleado
    addNotif({
      tipo: accion==="aprobada"?"success":"error",
      texto: `Tu incidencia "${item?.tipo}" del ${item?.fecha} fue ${accion}.`,
      fecha: new Date().toISOString(),
    });
    showToast(`Incidencia ${accion} correctamente`);
  }

  function accionVac(id: number, accion: Status) {
    const updated = vacaciones.map(v=>v.id===id?{...v,status:accion}:v);
    saveVac(updated);
    const item = vacaciones.find(v=>v.id===id);
    addNotif({
      tipo: accion==="aprobada"?"success":"error",
      texto: `Tu solicitud de vacaciones ${item?.inicio} → ${item?.fin} fue ${accion}.`,
      fecha: new Date().toISOString(),
    });
    showToast(`Vacaciones ${accion} correctamente`);
  }

  function addNotif(n: {tipo:string;texto:string;fecha:string}) {
    try {
      const prev = JSON.parse(localStorage.getItem("pulse_notifs")||"[]");
      localStorage.setItem("pulse_notifs", JSON.stringify([n,...prev]));
    } catch(_){}
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(()=>setToast(""),3000);
  }

  const pendInc = incidencias.filter(i=>i.status==="pendiente").length;
  const pendVac = vacaciones.filter(v=>v.status==="pendiente").length;

  const TABS = [
    {key:"incidencias", label:`Incidencias${pendInc>0?` (${pendInc})`:""}`},
    {key:"vacaciones",  label:`Vacaciones${pendVac>0?` (${pendVac})`:""}`},
    {key:"horas",       label:"Horas & Retardos"},
    ...(puedeNomina?[{key:"nomina",label:"Nómina"}]:[]),
    {key:"expediente",  label:"Expediente médico"},
    {key:"evaluaciones",label:"Evaluaciones"},
    {key:"encuestas",   label:"Encuestas"},
    {key:"enfermeria",  label:"Enfermería"},
    {key:"onboarding",  label:"Onboarding/Offboarding"},
    {key:"activos",     label:"Activos"},
    {key:"reclutamiento",label:"Reclutamiento"},
    {key:"cursos",      label:"Cursos"},
    {key:"convenios",   label:"Convenios"},
    {key:"transporte",  label:"Transporte"},
  ] as const;

  const row: React.CSSProperties = {
    display:"flex",alignItems:"center",justifyContent:"space-between",
    padding:"14px 0",borderBottom:"1px solid #EAEDF2",
    gap:"12px",flexWrap:"wrap",position:"relative",overflow:"hidden",
  };

  function Sello({ status }: { status: Status }) {
    if (status === "pendiente") return null;
    return (
      <span className={`sello ${status === "aprobada" ? "sello-aprobado" : "sello-rechazado"}`}>
        {status === "aprobada" ? "Aprobado" : "Rechazado"}
      </span>
    );
  }

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#FFFFFF",
      fontFamily:"'Inter', sans-serif"}}>

      <Sidebar activePage="gerencia"/>

      <main style={{flex:1,marginLeft:"240px",padding:"36px 40px",overflowY:"auto"}}>

        {/* HEADER */}
        <div style={{marginBottom:"28px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"5px"}}>
            <BarChart2 size={20} color="#0F9DA6"/>
            <h1 style={{fontSize:"22px",fontWeight:600,color:"#1E2A4A",margin:0}}>Panel de Gerencia</h1>
          </div>
          <p style={{fontSize:"13px",color:"#6B83A8",margin:0}}>
            Aprobaciones · Horas trabajadas · Nómina automática
          </p>
        </div>

        {/* PANORAMA */}
        <div className="glass-static" style={{
          borderRadius:"18px", padding:"20px 24px", marginBottom:"18px",
          display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"16px",
        }}>
          <div>
            <div style={{fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:"15px", color:"#1E2A4A"}}>Panorama general</div>
            <div style={{fontSize:"11.5px", color:"#6B83A8", marginTop:"2px"}}>Toda la plantilla · quincena actual</div>
          </div>
          <div style={{display:"flex", gap:"22px"}}>
            <ProgressRing value={92} label="Cumplimiento" color="#0F9DA6"/>
            <ProgressRing value={Math.min(100, Math.round((pendInc+pendVac)/10*100))} label="Pendientes" color="#C0392B"/>
          </div>
        </div>

        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"24px"}}>
          {(() => {
            const empsFiltrados = EMPLEADOS.filter(e=>filtroAreas.length===0||filtroAreas.includes(e.area));
            const fmtMoney = (v:number) => `$${Math.round(v).toLocaleString("es-MX")}`;

            if (tab === "horas") {
              const totalRetardos = empsFiltrados.reduce((a,e)=>a+e.retardos,0);
              const totalExtra = empsFiltrados.reduce((a,e)=>a+e.horasExtra,0);
              const totalTrabajadas = empsFiltrados.reduce((a,e)=>a+e.horasTrabajadas,0);
              const conRetardo = empsFiltrados.filter(e=>e.retardos>0).length;
              const maxRetardos = Math.max(...EMPLEADOS.map(e=>e.retardos), 1) * empsFiltrados.length;
              const maxExtra = Math.max(...EMPLEADOS.map(e=>e.horasExtra), 1) * empsFiltrados.length;
              const maxTrabajadas = TOTAL_HORAS * (empsFiltrados.length || 1);
              return [
                {label:"Retardos (filtro)",  value:`${totalRetardos}`,    color:"#C0392B",icon:Clock,     pct:Math.min(100,Math.round(totalRetardos/maxRetardos*100))},
                {label:"Horas extra (H.O.)", value:`${totalExtra}h`,      color:"#2E7D5B",icon:BarChart2, pct:Math.min(100,Math.round(totalExtra/maxExtra*100))},
                {label:"Horas trabajadas",   value:`${totalTrabajadas}h`, color:"#0F9DA6",icon:Users,     pct:Math.min(100,Math.round(totalTrabajadas/maxTrabajadas*100))},
                {label:"Con algún retardo",  value:`${conRetardo}/${empsFiltrados.length}`, color:"#C08A2E",icon:Calendar, pct:Math.round((conRetardo/(empsFiltrados.length||1))*100)},
              ];
            }

            if (tab === "incidencias") {
              const filtradas = incidencias.filter(i=>filtroAreas.length===0||filtroAreas.includes(areaDe(i.empleado)));
              const pend = filtradas.filter(i=>i.status==="pendiente").length;
              const apro = filtradas.filter(i=>i.status==="aprobada").length;
              const rech = filtradas.filter(i=>i.status==="rechazada").length;
              return [
                {label:"Total (filtro)",  value:`${filtradas.length}`, color:"#1E2A4A",icon:Clock,    pct:null},
                {label:"Pendientes",      value:`${pend}`,             color:"#C08A2E",icon:Clock,    pct:Math.round((pend/(filtradas.length||1))*100)},
                {label:"Aprobadas",       value:`${apro}`,             color:"#2E7D5B",icon:Check,    pct:Math.round((apro/(filtradas.length||1))*100)},
                {label:"Rechazadas",      value:`${rech}`,             color:"#C0392B",icon:Clock,    pct:Math.round((rech/(filtradas.length||1))*100)},
              ];
            }

            if (tab === "vacaciones") {
              const filtradas = vacaciones.filter(v=>filtroAreas.length===0||filtroAreas.includes(areaDe(v.empleado)));
              const pend = filtradas.filter(v=>v.status==="pendiente").length;
              const apro = filtradas.filter(v=>v.status==="aprobada");
              const diasTotales = apro.reduce((a,v)=>a+v.dias,0);
              return [
                {label:"Solicitudes (filtro)", value:`${filtradas.length}`, color:"#1E2A4A",icon:Calendar, pct:null},
                {label:"Pendientes",           value:`${pend}`,             color:"#C08A2E",icon:Calendar, pct:Math.round((pend/(filtradas.length||1))*100)},
                {label:"Aprobadas",            value:`${apro.length}`,      color:"#2E7D5B",icon:Check,    pct:Math.round((apro.length/(filtradas.length||1))*100)},
                {label:"Días aprobados",       value:`${diasTotales}`,      color:"#0F9DA6",icon:Calendar, pct:null},
              ];
            }

            if (tab === "nomina" && puedeNomina) {
              const totalNeto = empsFiltrados.reduce((a,e)=>a+calcNomina(e).neto,0);
              const totalDesc = empsFiltrados.reduce((a,e)=>a+calcNomina(e).descRetardo,0);
              const totalExtraPago = empsFiltrados.reduce((a,e)=>a+calcNomina(e).pagoExtra,0);
              return [
                {label:"Nómina total (filtro)", value: showMontos?fmtMoney(totalNeto):"•••••", color:"#0F9DA6",icon:BarChart2, pct:null},
                {label:"Descuento retardos",     value: showMontos?fmtMoney(totalDesc):"•••••", color:"#C0392B",icon:Clock,     pct:null},
                {label:"Pagado en H.O.",         value: showMontos?fmtMoney(totalExtraPago):"•••••", color:"#2E7D5B",icon:BarChart2, pct:null},
                {label:"Empleados en nómina",    value:`${empsFiltrados.length}`,               color:"#1E2A4A",icon:Users,     pct:null},
              ];
            }

            if ((tab === "expediente" || tab === "enfermeria") && kpiExtra) {
              const conExp = EMPLEADOS.filter(e=>kpiExtra.expedientes[e.id]).length;
              const bajoStock = (kpiExtra.medicamentos||[]).filter((m:any)=>m.cantidad<=3).length;
              const caducados = (kpiExtra.medicamentos||[]).filter((m:any)=>new Date(m.caducidad) < new Date()).length;
              return [
                {label:"Expedientes capturados", value:`${conExp}/${EMPLEADOS.length}`, color:"#0F9DA6",icon:Users,     pct:Math.round((conExp/EMPLEADOS.length)*100)},
                {label:"Accidentes registrados",  value:`${(kpiExtra.accidentes||[]).length}`, color:"#C0392B",icon:Clock, pct:null},
                {label:"Medicamentos stock bajo", value:`${bajoStock}`,                 color:"#C08A2E",icon:Clock,     pct:null},
                {label:"Medicamentos caducados",  value:`${caducados}`,                 color:"#C0392B",icon:Clock,     pct:null},
              ];
            }

            if (tab === "evaluaciones" && kpiExtra) {
              const evals = kpiExtra.evaluaciones||[];
              const promedio = evals.length ? evals.reduce((a:number,e:any)=>a+(e.desempeno+e.actitud+e.puntualidad)/3,0)/evals.length : 0;
              const evaluados = new Set(evals.map((e:any)=>e.empleado)).size;
              return [
                {label:"Evaluaciones totales", value:`${evals.length}`,               color:"#1E2A4A",icon:Users, pct:null},
                {label:"Empleados evaluados",  value:`${evaluados}/${EMPLEADOS.length}`, color:"#0F9DA6",icon:Users, pct:Math.round((evaluados/EMPLEADOS.length)*100)},
                {label:"Promedio general",     value:`${promedio.toFixed(1)}★`,        color:"#C08A2E",icon:Check, pct:Math.round((promedio/5)*100)},
                {label:"Sin evaluar",          value:`${EMPLEADOS.length-evaluados}`,  color:"#C0392B",icon:Clock, pct:null},
              ];
            }

            if (tab === "encuestas" && kpiExtra) {
              const encs = kpiExtra.encuestas||[];
              const notificadas = encs.filter((e:any)=>e.notificada).length;
              const preguntas = encs.reduce((a:number,e:any)=>a+e.preguntas.length,0);
              return [
                {label:"Encuestas creadas", value:`${encs.length}`,   color:"#1E2A4A",icon:Users,     pct:null},
                {label:"Notificadas",       value:`${notificadas}`,   color:"#0F9DA6",icon:Check,     pct:Math.round((notificadas/(encs.length||1))*100)},
                {label:"Sin notificar",     value:`${encs.length-notificadas}`, color:"#C08A2E",icon:Clock, pct:null},
                {label:"Preguntas totales", value:`${preguntas}`,     color:"#2E7D5B",icon:BarChart2, pct:null},
              ];
            }

            if (tab === "onboarding" && kpiExtra) {
              const checklists = kpiExtra.checklists||[];
              const altas = checklists.filter((c:any)=>c.tipo==="alta").length;
              const bajas = checklists.filter((c:any)=>c.tipo==="baja").length;
              const docsTotal = Object.values(kpiExtra.documentos||{}).reduce((a:number,arr:any)=>a+arr.length,0);
              return [
                {label:"Procesos de alta",  value:`${altas}`,   color:"#2E7D5B",icon:Users,     pct:null},
                {label:"Procesos de baja",  value:`${bajas}`,   color:"#C0392B",icon:Users,     pct:null},
                {label:"Documentos subidos",value:`${docsTotal}`, color:"#0F9DA6",icon:Check,   pct:null},
                {label:"Procesos activos",  value:`${checklists.length}`, color:"#1E2A4A",icon:Clock, pct:null},
              ];
            }

            if (tab === "activos" && kpiExtra) {
              const activos = kpiExtra.activos||[];
              const pendAceptar = activos.filter((a:any)=>!a.aceptado && !a.devuelto).length;
              const enUso = activos.filter((a:any)=>a.aceptado && !a.devuelto).length;
              const devueltos = activos.filter((a:any)=>a.devuelto).length;
              return [
                {label:"Activos totales",       value:`${activos.length}`, color:"#1E2A4A",icon:Users, pct:null},
                {label:"Pendientes de aceptar",  value:`${pendAceptar}`,    color:"#C08A2E",icon:Clock, pct:null},
                {label:"En uso (aceptados)",     value:`${enUso}`,          color:"#0F9DA6",icon:Check, pct:null},
                {label:"Devueltos",              value:`${devueltos}`,      color:"#2E7D5B",icon:Check, pct:null},
              ];
            }

            if (tab === "reclutamiento" && kpiExtra) {
              const cand = kpiExtra.candidatos||[];
              const enProceso = cand.filter((c:any)=>c.etapa!=="Contratado"&&c.etapa!=="Rechazado").length;
              const contratados = cand.filter((c:any)=>c.etapa==="Contratado").length;
              const rechazados = cand.filter((c:any)=>c.etapa==="Rechazado").length;
              return [
                {label:"Candidatos totales", value:`${cand.length}`,  color:"#1E2A4A",icon:Users, pct:null},
                {label:"En proceso",         value:`${enProceso}`,    color:"#C08A2E",icon:Clock, pct:null},
                {label:"Contratados",        value:`${contratados}`,  color:"#2E7D5B",icon:Check, pct:null},
                {label:"Rechazados",         value:`${rechazados}`,   color:"#C0392B",icon:Clock, pct:null},
              ];
            }

            if (tab === "cursos" && kpiExtra) {
              const cursos = kpiExtra.cursos||[];
              const horasTotal = cursos.reduce((a:number,c:any)=>a+c.horas,0);
              const sinNotificar = cursos.filter((c:any)=>!c.notificado).length;
              const totalCompletados = cursos.reduce((a:number,c:any)=>a+c.completadoPor.length,0);
              const totalPosible = cursos.reduce((a:number,c:any)=>a+(c.destinatarios?.length||EMPLEADOS.length),0);
              return [
                {label:"Cursos activos",      value:`${cursos.length}`,   color:"#1E2A4A",icon:Users,     pct:null},
                {label:"Horas de capacitación",value:`${horasTotal}h`,    color:"#0F9DA6",icon:BarChart2, pct:null},
                {label:"Sin notificar",        value:`${sinNotificar}`,   color:"#C08A2E",icon:Clock,     pct:null},
                {label:"Completado promedio",  value:`${Math.round((totalCompletados/(totalPosible||1))*100)}%`, color:"#2E7D5B",icon:Check, pct:Math.round((totalCompletados/(totalPosible||1))*100)},
              ];
            }

            if (tab === "convenios" && kpiExtra) {
              const conv = kpiExtra.convenios||[];
              const conLink = conv.filter((c:any)=>c.link).length;
              const categorias = new Set(conv.map((c:any)=>c.categoria)).size;
              return [
                {label:"Convenios activos", value:`${conv.length}`, color:"#1E2A4A",icon:Users, pct:null},
                {label:"Con link directo",  value:`${conLink}`,     color:"#0F9DA6",icon:Check, pct:null},
                {label:"Categorías cubiertas",value:`${categorias}`,color:"#2E7D5B",icon:BarChart2, pct:null},
                {label:"Sin link",          value:`${conv.length-conLink}`, color:"#C08A2E",icon:Clock, pct:null},
              ];
            }

            if (tab === "transporte" && kpiExtra) {
              const viajes = kpiExtra.viajes||[];
              const enRuta = viajes.filter((v:any)=>v.estado==="En ruta").length;
              const finalizados = viajes.filter((v:any)=>v.estado==="Finalizado").length;
              return [
                {label:"Viajes registrados", value:`${viajes.length}`, color:"#1E2A4A",icon:Users,     pct:null},
                {label:"En ruta ahora",       value:`${enRuta}`,        color:"#0F9DA6",icon:Clock,     pct:null},
                {label:"Finalizados",         value:`${finalizados}`,   color:"#2E7D5B",icon:Check,     pct:null},
                {label:"Unidades distintas",  value:`${new Set(viajes.map((v:any)=>v.unidad)).size}`, color:"#C08A2E",icon:BarChart2, pct:null},
              ];
            }

            // Default (fuera de tab con datos propios)
            return [
              {label:"Empleados activos",value:"6",          color:"#0F9DA6",icon:Users,     pct:null},
              {label:"Incidencias pend.", value:`${pendInc}`,color:"#C0392B",icon:Clock,     pct:null},
              {label:"Vacaciones pend.",  value:`${pendVac}`,color:"#F5A623",icon:Calendar,  pct:null},
              {label:"H.O. quincena",     value:"24h",       color:"#2E7D5B",icon:BarChart2, pct:null},
            ];
          })().map(k=>(
            <div key={k.label} className="glass" style={{
              borderRadius:"12px",padding:"16px",
              display:"flex",flexDirection:"column",gap:"10px",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                <div style={{width:38,height:38,borderRadius:"10px",background:`${k.color}18`,
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <k.icon size={17} color={k.color}/>
                </div>
                <div>
                  <p style={{fontSize:"20px",fontWeight:700,color:k.color,margin:0,lineHeight:1}}>{k.value}</p>
                  <p style={{fontSize:"9px",color:"#6B83A8",textTransform:"uppercase",
                    letterSpacing:".7px",marginTop:"3px"}}>{k.label}</p>
                </div>
              </div>
              {k.pct !== null && (
                <div style={{height:"5px",borderRadius:"3px",background:"#EAF1F4",overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:"3px",background:k.color,width:`${k.pct}%`,transition:"width .5s ease"}}/>
                </div>
              )}
            </div>
          ))}
        </div>

        <p style={{fontSize:"10.5px",color:"#6B83A8",marginTop:"-16px",marginBottom:"18px"}}>
          ↑ Estos indicadores cambian según el módulo en el que estés.
        </p>

        {/* TABS */}
        <div style={{display:"flex",gap:"6px",marginBottom:"16px",flexWrap:"wrap"}}>
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key as typeof tab)} style={{
              padding:"6px 16px",borderRadius:"20px",fontSize:"11px",fontWeight:500,
              cursor:"pointer",fontFamily:"inherit",transition:"all .2s",
              border:tab===t.key?"1.5px solid #0F9DA6":"1.5px solid #DDE1EA",
              background:tab===t.key?"rgba(15,157,166,.10)":"#FFFFFF",
              color:tab===t.key?"#0F9DA6":"#6B83A8",
            }}>{t.label}</button>
          ))}
        </div>

        {/* PANEL */}
        <div className="glass-static" style={{borderRadius:"14px"}}>

          {/* INCIDENCIAS */}
          {tab==="incidencias" && (<>
            <div style={{padding:"16px 22px",borderBottom:"1px solid #EAEDF2",
              display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>Incidencias recientes</span>
              {pendInc>0 && (
                <span style={{fontSize:"11px",color:"#C0392B",fontWeight:500}}>
                  {pendInc} pendiente{pendInc>1?"s":""} de revisión
                </span>
              )}
            </div>
            <div style={{padding:"16px 22px 0"}}>
              <FiltroAreas seleccion={filtroAreas} onChange={setFiltroAreas}/>
            </div>
            <div style={{padding:"0 22px"}}>
              {incidencias.filter(inc => filtroAreas.length===0 || filtroAreas.includes(areaDe(inc.empleado))).map(inc=>(
                <div key={inc.id} style={row}>
                  <Sello status={inc.status}/>
                  <div style={{flex:1,minWidth:"160px"}}>
                    <p style={{fontSize:"13px",fontWeight:500,color:"#1E2A4A",margin:0}}>{inc.empleado}</p>
                    <p style={{fontSize:"11px",color:"#6B83A8",marginTop:"2px"}}>{inc.tipo} · {inc.fecha} · {areaDe(inc.empleado)}</p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
                    <Badge s={inc.status}/>
                    {inc.status==="pendiente" && (
                      <ActionBtns
                        onAprobar={()=>accionInc(inc.id,"aprobada")}
                        onRechazar={()=>accionInc(inc.id,"rechazada")}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>)}

          {/* VACACIONES */}
          {tab==="vacaciones" && (<>
            <div style={{padding:"16px 22px",borderBottom:"1px solid #EAEDF2",
              display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>Solicitudes de vacaciones</span>
              {pendVac>0 && (
                <span style={{fontSize:"11px",color:"#C0392B",fontWeight:500}}>
                  {pendVac} pendiente{pendVac>1?"s":""} de aprobación
                </span>
              )}
            </div>
            <div style={{padding:"16px 22px 0"}}>
              <FiltroAreas seleccion={filtroAreas} onChange={setFiltroAreas}/>
            </div>
            <div style={{padding:"0 22px"}}>
              {vacaciones.filter(vac => filtroAreas.length===0 || filtroAreas.includes(areaDe(vac.empleado))).map(vac=>(
                <div key={vac.id} style={row}>
                  <Sello status={vac.status}/>
                  <div style={{flex:1,minWidth:"160px"}}>
                    <p style={{fontSize:"13px",fontWeight:500,color:"#1E2A4A",margin:0}}>{vac.empleado}</p>
                    <p style={{fontSize:"11px",color:"#6B83A8",marginTop:"2px"}}>
                      {vac.inicio} → {vac.fin} · {vac.dias} días · {areaDe(vac.empleado)}
                    </p>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
                    <Badge s={vac.status}/>
                    {vac.status==="pendiente" && (
                      <ActionBtns
                        onAprobar={()=>accionVac(vac.id,"aprobada")}
                        onRechazar={()=>accionVac(vac.id,"rechazada")}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>)}

          {/* HORAS */}
          {tab==="horas" && (<>
            <div style={{padding:"16px 22px",borderBottom:"1px solid #EAEDF2"}}>
              <span style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>Horas trabajadas — quincena actual</span>
            </div>
            <div style={{padding:"16px 22px 0"}}>
              <FiltroAreas seleccion={filtroAreas} onChange={setFiltroAreas}/>
            </div>

            {/* Estadísticas por equipo */}
            <div style={{padding:"0 22px 16px",display:"grid",
              gridTemplateColumns:`repeat(${AREAS.filter(a=>filtroAreas.length===0||filtroAreas.includes(a)).length || 1},1fr)`,
              gap:"10px"}}>
              {AREAS.filter(a=>filtroAreas.length===0||filtroAreas.includes(a)).map(area=>{
                const empsArea = EMPLEADOS.filter(e=>e.area===area);
                const retardosArea = empsArea.reduce((a,e)=>a+e.retardos,0);
                const extraArea = empsArea.reduce((a,e)=>a+e.horasExtra,0);
                const horasArea = empsArea.reduce((a,e)=>a+e.horasTrabajadas,0);
                return (
                  <div key={area} style={{padding:"10px 12px",borderRadius:"10px",background:"#FAFCFF",border:"1px solid #EAEDF2"}}>
                    <div style={{fontSize:"10px",fontWeight:700,color:"#1E2A4A",marginBottom:"6px"}}>{area}</div>
                    <div style={{fontSize:"10px",color:"#6B83A8"}}>Retardos: <b style={{color:"#C0392B"}}>{retardosArea}</b></div>
                    <div style={{fontSize:"10px",color:"#6B83A8"}}>H.O.: <b style={{color:"#2E7D5B"}}>{extraArea}h</b></div>
                    <div style={{fontSize:"10px",color:"#6B83A8"}}>Trabajadas: <b style={{color:"#0F9DA6"}}>{horasArea}h</b></div>
                  </div>
                );
              })}
            </div>

            <div style={{padding:"0 22px"}}>
              {EMPLEADOS.filter(e=>filtroAreas.length===0||filtroAreas.includes(e.area)).map(e=>{
                const pct=Math.min(100,Math.round(e.horasTrabajadas/TOTAL_HORAS*100));
                return (
                  <div key={e.id} style={{...row,flexDirection:"column",alignItems:"stretch",gap:"8px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <p style={{fontSize:"13px",fontWeight:500,color:"#1E2A4A",margin:0}}>{e.nombre}</p>
                        <p style={{fontSize:"11px",color:"#6B83A8",marginTop:"2px"}}>
                          {e.area} · {e.retardos} retardo{e.retardos!==1?"s":""}
                        </p>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <p style={{fontSize:"14px",fontWeight:700,color:"#0F9DA6",margin:0}}>{e.horasTrabajadas}h</p>
                        {e.horasExtra>0 && <p style={{fontSize:"11px",color:"#2E7D5B",margin:0}}>+{e.horasExtra}h extra</p>}
                      </div>
                    </div>
                    <div style={{height:"6px",borderRadius:"3px",background:"#FFFFFF",overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:"3px",
                        background:pct>=100?"#2E7D5B":pct>=70?"#0F9DA6":"#C0392B",
                        width:`${pct}%`,transition:"width 1s ease"}}/>
                    </div>
                    <div style={{marginTop:"6px"}}>
                      <AsistenciaGrid
                        title="Asistencia · últimas 3 semanas"
                        weeks={[0,1,2].map(w =>
                          [0,1,2,3,4].map(d => (e.id*7 + w*5 + d) % (e.retardos+3) !== 0)
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>)}

          {/* NÓMINA */}
          {tab==="nomina" && puedeNomina && (<>
            <div style={{padding:"16px 22px",borderBottom:"1px solid #EAEDF2",
              display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>Cálculo de nómina — quincena actual</span>
              <div style={{display:"flex",gap:"8px"}}>
                <button onClick={()=>{ EMPLEADOS.forEach(e=>descargarReciboNomina(e)); showToast(`✅ ${EMPLEADOS.length} recibos emitidos`); }} style={{
                  display:"flex",alignItems:"center",gap:"6px",padding:"7px 14px",
                  borderRadius:"9px",border:"none",background:"#0F9DA6",
                  color:"#1E2A4A",fontSize:"11.5px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                }}>Emitir todos los recibos</button>
                <button onClick={()=>setShowMontos(p=>!p)} style={{
                  display:"flex",alignItems:"center",gap:"6px",padding:"5px 12px",
                  borderRadius:"20px",border:"1.5px solid #DDE1EA",background:"transparent",
                  color:"#6B83A8",fontSize:"11px",cursor:"pointer",fontFamily:"inherit",
                }}>
                  {showMontos?<><EyeOff size={12}/> Ocultar</>:<><Eye size={12}/> Mostrar montos</>}
                </button>
              </div>
            </div>
            <div style={{padding:"10px 22px",background:"rgba(15,157,166,.04)",borderBottom:"1px solid #EAEDF2"}}>
              <p style={{fontSize:"11px",color:"#5C6579",margin:0}}>
                💡 Sueldo ÷ 30 ÷ 8 × horas · Descuento retardo ½h · H.O. al 1.5×
              </p>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:"11px"}}>
                <thead>
                  <tr style={{borderBottom:"2px solid #EAEDF2",background:"#FAFCFF"}}>
                    {["Empleado","Área","Sueldo base","Desc. retardos","H.O.","Neto",""].map(h=>(
                      <th key={h} style={{padding:"10px 18px",textAlign:"left",color:"#6B83A8",
                        fontWeight:600,fontSize:"9px",textTransform:"uppercase",letterSpacing:".6px"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EMPLEADOS.map(e=>{
                    const n=calcNomina(e);
                    const fmt=(v:number)=>showMontos?`$${Math.round(v).toLocaleString("es-MX")}`:"••••••";
                    return (
                      <tr key={e.id} style={{borderBottom:"1px solid #EAEDF2"}}>
                        <td style={{padding:"11px 18px",color:"#1E2A4A",fontWeight:500}}>{e.nombre}</td>
                        <td style={{padding:"11px 18px",color:"#6B83A8"}}>{e.area}</td>
                        <td style={{padding:"11px 18px",color:"#1E2A4A"}}>{fmt(e.sueldo)}</td>
                        <td style={{padding:"11px 18px",color:"#C0392B"}}>
                          {showMontos?`-$${Math.round(n.descRetardo).toLocaleString("es-MX")}`:"••••"}
                        </td>
                        <td style={{padding:"11px 18px",color:"#2E7D5B"}}>
                          {showMontos&&e.horasExtra>0?`+$${Math.round(n.pagoExtra).toLocaleString("es-MX")}`:"—"}
                        </td>
                        <td style={{padding:"11px 18px",fontWeight:700,color:"#1E2A4A"}}>{fmt(n.neto)}</td>
                        <td style={{padding:"11px 18px"}}>
                          <button
                            onClick={()=>descargarReciboNomina(e)}
                            title="Descargar recibo"
                            style={{
                              display:"flex",alignItems:"center",gap:"5px",
                              padding:"5px 10px",borderRadius:"8px",border:"1px solid #DDE1EA",
                              background:"transparent",color:"#0F9DA6",fontSize:"10.5px",
                              fontWeight:600,cursor:"pointer",fontFamily:"inherit",
                            }}
                          >
                            <Download size={11}/> Recibo
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {showMontos && (
                  <tfoot>
                    <tr style={{borderTop:"2px solid #DDE1EA",background:"#FFFFFF"}}>
                      <td colSpan={5} style={{padding:"12px 18px",fontWeight:600,color:"#1E2A4A",fontSize:"12px"}}>
                        Total nómina quincena
                      </td>
                      <td style={{padding:"12px 18px",fontWeight:700,color:"#1E2A4A",fontSize:"13px"}}>
                        ${EMPLEADOS.reduce((s,e)=>s+Math.round(calcNomina(e).neto),0).toLocaleString("es-MX")}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </>)}
        </div>
      </main>

          {tab==="expediente" && <ExpedienteMedico/>}
          {tab==="evaluaciones" && <Evaluaciones/>}
          {tab==="encuestas" && <Encuestas onToast={showToast}/>}
          {tab==="enfermeria" && <Enfermeria/>}
          {tab==="onboarding" && <Onboarding/>}
          {tab==="activos" && <Activos/>}
          {tab==="reclutamiento" && <Reclutamiento/>}
          {tab==="cursos" && <Cursos/>}
          {tab==="convenios" && <Convenios/>}
          {tab==="transporte" && <Transporte/>}

      {/* TOAST */}
      {toast && (
        <div style={{
          position:"fixed",bottom:"28px",right:"28px",
          background:"#1E2A4A",color:"#FFFFFF",
          padding:"13px 20px",borderRadius:"12px",fontSize:"13px",
          display:"flex",alignItems:"center",gap:"10px",
          boxShadow:"0 8px 30px rgba(30,42,74,.25)",
          borderLeft:"3px solid #0F9DA6",zIndex:9999,
          animation:"slideIn .3s ease",
        }}>
          <span style={{color:"#0F9DA6",fontSize:"16px"}}>✓</span>
          {toast}
        </div>
      )}
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}
