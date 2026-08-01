export type Status = "pendiente" | "aprobada" | "rechazada";

export interface Incidencia {
  id: number; empleado: string; tipo: string; fecha: string; status: Status;
}
export interface Vacacion {
  id: number; empleado: string; inicio: string; fin: string; dias: number; status: Status;
}
export interface Empleado {
  id: number; nombre: string; area: string;
  horasTrabajadas: number; horasExtra: number; sueldo: number; retardos: number;
}

export const INC_DEFAULT: Incidencia[] = [
  {id:1,empleado:"Ana García",    tipo:"Retardo",            fecha:"2025-05-20",status:"pendiente"},
  {id:2,empleado:"Carlos Méndez", tipo:"Falta justificada",  fecha:"2025-05-19",status:"pendiente"},
  {id:3,empleado:"Laura Torres",  tipo:"Retardo",            fecha:"2025-05-21",status:"pendiente"},
  {id:4,empleado:"Pedro Ramírez", tipo:"Falta injustificada",fecha:"2025-05-18",status:"aprobada"},
  {id:5,empleado:"Sofía López",   tipo:"Retardo",            fecha:"2025-05-22",status:"pendiente"},
];

export const VAC_DEFAULT: Vacacion[] = [
  {id:1,empleado:"Ana García",   inicio:"2025-06-02",fin:"2025-06-13",dias:10,status:"pendiente"},
  {id:2,empleado:"Raúl Sánchez", inicio:"2025-06-09",fin:"2025-06-13",dias:5, status:"pendiente"},
  {id:3,empleado:"Elena Vargas", inicio:"2025-06-16",fin:"2025-06-20",dias:5, status:"aprobada"},
];

export const EMPLEADOS: Empleado[] = [
  {id:1,nombre:"Ana García",     area:"Ventas",    horasTrabajadas:72,horasExtra:8, sueldo:18000,retardos:2},
  {id:2,nombre:"Carlos Méndez",  area:"Logística", horasTrabajadas:68,horasExtra:0, sueldo:16500,retardos:1},
  {id:3,nombre:"Laura Torres",   area:"Finanzas",  horasTrabajadas:80,horasExtra:12,sueldo:22000,retardos:3},
  {id:4,nombre:"Pedro Ramírez",  area:"Planta A",  horasTrabajadas:64,horasExtra:0, sueldo:15000,retardos:0},
  {id:5,nombre:"Sofía López",    area:"RH",        horasTrabajadas:76,horasExtra:4, sueldo:19500,retardos:4},
  {id:6,nombre:"Raúl Sánchez",   area:"CxC",       horasTrabajadas:70,horasExtra:0, sueldo:17000,retardos:1},
  {id:7,nombre:"Jorge Ramírez",  area:"Producción",horasTrabajadas:74,horasExtra:2, sueldo:17500,retardos:0},
];

export const TOTAL_HORAS = 96;

export function calcNomina(e: Empleado) {
  const sdHora      = (e.sueldo/30)/8;
  const descRetardo = e.retardos * sdHora * .5;
  const pagoExtra   = e.horasExtra * sdHora * 1.5;
  return { descRetardo, pagoExtra, neto: e.sueldo - descRetardo + pagoExtra };
}

/** M4: genera y descarga (imprime) el recibo de nómina de un empleado. */
export function descargarReciboNomina(e: Empleado) {
  const n = calcNomina(e);
  const folio = `PLS-NOM-${Math.floor(Math.random()*9000)+1000}`;
  const fmt = (v:number) => `$${Math.round(v).toLocaleString("es-MX")}`;
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Recibo de nómina - ${e.nombre} - PULSE</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',Arial,sans-serif;color:#1E2A4A;background:#fff;padding:40px}
    .header{background:#1E2A4A;color:#fff;padding:24px 32px;border-radius:12px;
      display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}
    .logo{font-size:22px;font-weight:300;letter-spacing:8px}
    .logo span{color:#0F9DA6}
    .folio{text-align:right;font-size:12px;color:#6B83A8}
    .folio strong{color:#0F9DA6;font-size:16px;display:block}
    h1{font-size:20px;font-weight:700;color:#1E2A4A;padding-bottom:12px;
      border-bottom:3px solid #0F9DA6;margin-bottom:24px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
    .field label{font-size:10px;text-transform:uppercase;letter-spacing:1px;
      color:#6B83A8;font-weight:600;display:block;margin-bottom:4px}
    .field p{font-size:14px;color:#1E2A4A;font-weight:500;
      border-bottom:1px solid #DDE1EA;padding-bottom:8px}
    table{width:100%;border-collapse:collapse;margin-bottom:24px}
    th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.6px;
      color:#6B83A8;padding:10px 4px;border-bottom:2px solid #EAEDF2}
    td{padding:12px 4px;font-size:13px;border-bottom:1px solid #EAEDF2}
    .neto{background:rgba(15,157,166,.06);border-radius:10px;padding:16px 20px;
      display:flex;justify-content:space-between;align-items:center;margin-top:8px}
    .neto strong{font-size:20px;color:#0F9DA6}
    .firmas{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:48px}
    .firma{border-top:1.5px solid #DDE1EA;padding-top:8px;
      text-align:center;font-size:10px;text-transform:uppercase;
      letter-spacing:1px;color:#6B83A8}
    @media print{body{padding:20px}}
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">PULSE<span>·</span></div>
    <div class="folio">Folio<strong>${folio}</strong></div>
  </div>

  <h1>Recibo de nómina — quincena actual</h1>

  <div class="grid">
    <div class="field"><label>Empleado</label><p>${e.nombre}</p></div>
    <div class="field"><label>Área</label><p>${e.area}</p></div>
    <div class="field"><label>Horas trabajadas</label><p>${e.horasTrabajadas}h de ${TOTAL_HORAS}h</p></div>
    <div class="field"><label>Retardos en el periodo</label><p>${e.retardos}</p></div>
  </div>

  <table>
    <thead><tr><th>Concepto</th><th style="text-align:right">Monto</th></tr></thead>
    <tbody>
      <tr><td>Sueldo base</td><td style="text-align:right">${fmt(e.sueldo)}</td></tr>
      <tr><td>Descuento por retardos (½h c/u)</td><td style="text-align:right;color:#C0392B">-${fmt(n.descRetardo)}</td></tr>
      <tr><td>Horas extra (${e.horasExtra}h × 1.5)</td><td style="text-align:right;color:#2E7D5B">${e.horasExtra>0?"+"+fmt(n.pagoExtra):"—"}</td></tr>
    </tbody>
  </table>

  <div class="neto">
    <span>Neto a pagar</span>
    <strong>${fmt(n.neto)}</strong>
  </div>

  <div class="firmas">
    <div class="firma">Firma del empleado</div>
    <div class="firma">Autorización RRHH / Nómina</div>
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

// ---- Helpers de localStorage compartidos ----

export function loadIncidencias(): Incidencia[] {
  try {
    const raw = localStorage.getItem("pulse_incidencias");
    return raw ? JSON.parse(raw) : INC_DEFAULT;
  } catch {
    return INC_DEFAULT;
  }
}

export function saveIncidencias(data: Incidencia[]) {
  localStorage.setItem("pulse_incidencias", JSON.stringify(data));
}

/** Notificaciones in-app compartidas (bandeja de Notificaciones del empleado). */
export function addNotif(n: { tipo: string; texto: string; fecha: string }) {
  try {
    const prev = JSON.parse(localStorage.getItem("pulse_notifs") || "[]");
    localStorage.setItem("pulse_notifs", JSON.stringify([n, ...prev]));
  } catch(_) {}
}
export function crearIncidenciaRetardo(empleado: string, fechaISO: string) {
  return crearIncidencia(empleado, "Retardo", fechaISO);
}

/** M11: genera y descarga el documento de aceptación firmado por el empleado. */
export function descargarAceptacionActivo(activo: { empleado: string; tipo: string; descripcion: string; fechaAsignacion: string }) {
  const folio = `PLS-ACT-${Math.floor(Math.random()*9000)+1000}`;
  const fechaAceptacion = new Date().toLocaleDateString("es-MX", { day:"numeric", month:"long", year:"numeric" });
  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"/><title>Aceptación de activo - ${activo.empleado} - PULSE</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1E2A4A;background:#fff;padding:40px}
.header{background:#1E2A4A;color:#fff;padding:24px 32px;border-radius:12px;
  display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}
.logo{font-size:22px;font-weight:300;letter-spacing:8px}
.logo span{color:#0F9DA6}
.folio{text-align:right;font-size:12px;color:#6B83A8}
.folio strong{color:#0F9DA6;font-size:16px;display:block}
h1{font-size:20px;font-weight:700;padding-bottom:12px;border-bottom:3px solid #0F9DA6;margin-bottom:24px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
.field label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#6B83A8;font-weight:600;display:block;margin-bottom:4px}
.field p{font-size:14px;font-weight:500;border-bottom:1px solid #DDE1EA;padding-bottom:8px}
.texto{font-size:13px;line-height:1.7;color:#3B4B5C;margin-bottom:36px}
.firma{margin-top:60px;border-top:1.5px solid #1E2A4A;padding-top:10px;width:280px;text-align:center;font-size:11px;color:#6B83A8}
.firma b{display:block;font-size:14px;color:#1E2A4A;margin-bottom:2px}
@media print{body{padding:20px}}
</style></head>
<body>
  <div class="header">
    <div class="logo">PULSE<span>·</span></div>
    <div class="folio">Folio<strong>${folio}</strong></div>
  </div>
  <h1>Carta responsiva de activo asignado</h1>
  <div class="grid">
    <div class="field"><label>Empleado</label><p>${activo.empleado}</p></div>
    <div class="field"><label>Fecha de asignación</label><p>${activo.fechaAsignacion}</p></div>
    <div class="field"><label>Tipo de activo</label><p>${activo.tipo}</p></div>
    <div class="field"><label>Descripción</label><p>${activo.descripcion}</p></div>
  </div>
  <p class="texto">
    Por medio del presente, el empleado arriba mencionado confirma haber recibido el activo descrito,
    en buen estado y funcionando correctamente, comprometiéndose a darle buen uso y a devolverlo
    en las mismas condiciones al término de su relación laboral o cuando la empresa lo requiera.
  </p>
  <div class="firma">
    <b>${activo.empleado}</b>
    Aceptado electrónicamente el ${fechaAceptacion}
  </div>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.onload = () => { win.print(); URL.revokeObjectURL(url); };
  }
}

/** M5: crea una incidencia de cualquier tipo (permiso, falta, retardo...) evitando duplicados el mismo día. */
export function crearIncidencia(empleado: string, tipo: string, fechaISO: string) {
  const actuales = loadIncidencias();
  const yaExiste = actuales.some(
    i => i.empleado === empleado && i.tipo === tipo && i.fecha === fechaISO
  );
  if (yaExiste) return false;

  const nextId = actuales.length ? Math.max(...actuales.map(i => i.id)) + 1 : 1;
  const nueva: Incidencia = {
    id: nextId, empleado, tipo, fecha: fechaISO, status: "pendiente",
  };
  saveIncidencias([nueva, ...actuales]);
  return true;
}
