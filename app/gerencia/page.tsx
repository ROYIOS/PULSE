"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { BarChart2, Users, Clock, Calendar, Eye, EyeOff } from "lucide-react";
import AsistenciaGrid from "@/components/dashboard/AsistenciaGrid";

type Rol = "gerente" | "rrhh" | "nomina";
type Status = "pendiente" | "aprobada" | "rechazada";

interface Incidencia {
  id:number; empleado:string; tipo:string; fecha:string; status:Status;
}
interface Vacacion {
  id:number; empleado:string; inicio:string; fin:string; dias:number; status:Status;
}
interface Empleado {
  id:number; nombre:string; area:string;
  horasTrabajadas:number; horasExtra:number; sueldo:number; retardos:number;
}

const INC_DEFAULT: Incidencia[] = [
  {id:1,empleado:"Ana García",    tipo:"Retardo",            fecha:"2025-05-20",status:"pendiente"},
  {id:2,empleado:"Carlos Méndez", tipo:"Falta justificada",  fecha:"2025-05-19",status:"pendiente"},
  {id:3,empleado:"Laura Torres",  tipo:"Retardo",            fecha:"2025-05-21",status:"pendiente"},
  {id:4,empleado:"Pedro Ramírez", tipo:"Falta injustificada",fecha:"2025-05-18",status:"aprobada"},
  {id:5,empleado:"Sofía López",   tipo:"Retardo",            fecha:"2025-05-22",status:"pendiente"},
];

const VAC_DEFAULT: Vacacion[] = [
  {id:1,empleado:"Ana García",   inicio:"2025-06-02",fin:"2025-06-13",dias:10,status:"pendiente"},
  {id:2,empleado:"Raúl Sánchez", inicio:"2025-06-09",fin:"2025-06-13",dias:5, status:"pendiente"},
  {id:3,empleado:"Elena Vargas", inicio:"2025-06-16",fin:"2025-06-20",dias:5, status:"aprobada"},
];

const EMPLEADOS: Empleado[] = [
  {id:1,nombre:"Ana García",    area:"Ventas",    horasTrabajadas:72,horasExtra:8, sueldo:18000,retardos:2},
  {id:2,nombre:"Carlos Méndez", area:"Logística", horasTrabajadas:68,horasExtra:0, sueldo:16500,retardos:1},
  {id:3,nombre:"Laura Torres",  area:"Finanzas",  horasTrabajadas:80,horasExtra:12,sueldo:22000,retardos:3},
  {id:4,nombre:"Pedro Ramírez", area:"Planta A",  horasTrabajadas:64,horasExtra:0, sueldo:15000,retardos:0},
  {id:5,nombre:"Sofía López",   area:"RH",        horasTrabajadas:76,horasExtra:4, sueldo:19500,retardos:4},
  {id:6,nombre:"Raúl Sánchez",  area:"CxC",       horasTrabajadas:70,horasExtra:0, sueldo:17000,retardos:1},
];

const TOTAL_HORAS = 96;

function calcNomina(e: Empleado) {
  const sdHora      = (e.sueldo/30)/8;
  const descRetardo = e.retardos * sdHora * .5;
  const pagoExtra   = e.horasExtra * sdHora * 1.5;
  return { descRetardo, pagoExtra, neto: e.sueldo - descRetardo + pagoExtra };
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

  const [tab, setTab]               = useState<"incidencias"|"vacaciones"|"horas"|"nomina">("incidencias");
  const [incidencias, setInc]       = useState<Incidencia[]>(INC_DEFAULT);
  const [vacaciones,  setVac]       = useState<Vacacion[]>(VAC_DEFAULT);
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

        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"24px"}}>
          {[
            {label:"Empleados activos",value:"6",          color:"#0F9DA6",icon:Users},
            {label:"Incidencias pend.", value:`${pendInc}`,color:"#C0392B",icon:Clock},
            {label:"Vacaciones pend.",  value:`${pendVac}`,color:"#F5A623",icon:Calendar},
            {label:"H.O. quincena",     value:"24h",       color:"#2E7D5B",icon:BarChart2},
          ].map(k=>(
            <div key={k.label} style={{
              background:"#FFFFFF",borderRadius:"12px",padding:"16px",
              border:"1.5px solid #DDE1EA",boxShadow:"0 1px 4px rgba(30,42,74,.05)",
              display:"flex",alignItems:"center",gap:"12px",
            }}>
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
          ))}
        </div>

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
            <div style={{padding:"0 22px"}}>
              {incidencias.map(inc=>(
                <div key={inc.id} style={row}>
                  <Sello status={inc.status}/>
                  <div style={{flex:1,minWidth:"160px"}}>
                    <p style={{fontSize:"13px",fontWeight:500,color:"#1E2A4A",margin:0}}>{inc.empleado}</p>
                    <p style={{fontSize:"11px",color:"#6B83A8",marginTop:"2px"}}>{inc.tipo} · {inc.fecha}</p>
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
            <div style={{padding:"0 22px"}}>
              {vacaciones.map(vac=>(
                <div key={vac.id} style={row}>
                  <Sello status={vac.status}/>
                  <div style={{flex:1,minWidth:"160px"}}>
                    <p style={{fontSize:"13px",fontWeight:500,color:"#1E2A4A",margin:0}}>{vac.empleado}</p>
                    <p style={{fontSize:"11px",color:"#6B83A8",marginTop:"2px"}}>
                      {vac.inicio} → {vac.fin} · {vac.dias} días
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
            <div style={{padding:"0 22px"}}>
              {EMPLEADOS.map(e=>{
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
              <button onClick={()=>setShowMontos(p=>!p)} style={{
                display:"flex",alignItems:"center",gap:"6px",padding:"5px 12px",
                borderRadius:"20px",border:"1.5px solid #DDE1EA",background:"transparent",
                color:"#6B83A8",fontSize:"11px",cursor:"pointer",fontFamily:"inherit",
              }}>
                {showMontos?<><EyeOff size={12}/> Ocultar</>:<><Eye size={12}/> Mostrar montos</>}
              </button>
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
                    {["Empleado","Área","Sueldo base","Desc. retardos","H.O.","Neto"].map(h=>(
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
