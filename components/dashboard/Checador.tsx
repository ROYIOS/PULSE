"use client";
import { useState, useEffect } from "react";
import { LogIn, LogOut } from "lucide-react";

const KEY = "pulse_checador";
const TOLERANCIA = "09:10"; // hora de entrada 09:00, con 10 min de tolerancia

interface Registro {
  date: string;
  entrada?: string;
  salida?: string;
  status?: "temprano" | "tarde";
}

function todayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function nowHM() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function loadAll(): Registro[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAll(regs: Registro[]) {
  localStorage.setItem(KEY, JSON.stringify(regs));
}

export default function Checador() {
  const [hoy, setHoy] = useState<Registro>({ date: todayStr() });
  const [clock, setClock] = useState(nowHM());

  useEffect(() => {
    const all = loadAll();
    const found = all.find(r => r.date === todayStr());
    if (found) setHoy(found);
    const timer = setInterval(() => setClock(nowHM()), 30000);
    return () => clearInterval(timer);
  }, []);

  function registrar(tipo: "entrada" | "salida") {
    const all = loadAll();
    const idx = all.findIndex(r => r.date === todayStr());
    const hora = nowHM();
    let record: Registro = idx >= 0 ? all[idx] : { date: todayStr() };

    if (tipo === "entrada") {
      record.entrada = hora;
      record.status = hora <= TOLERANCIA ? "temprano" : "tarde";
    } else {
      record.salida = hora;
    }

    if (idx >= 0) all[idx] = record; else all.push(record);
    saveAll(all);
    setHoy({ ...record });
  }

  const yaEntro = !!hoy.entrada;
  const yaSalio = !!hoy.salida;

  return (
    <div className="glass-static" style={{
      borderRadius: "18px", padding: "22px 24px", marginBottom: "18px",
      display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "18px",
    }}>
      <div>
        <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "15px", color: "#1E2A4A" }}>
          Reloj checador
        </div>
        <div style={{ fontSize: "11.5px", color: "#6B83A8", marginTop: "2px" }}>
          {clock} · entrada 9:00am (tolerancia 10 min)
        </div>
        {yaEntro && (
          <div style={{ fontSize: "12px", marginTop: "8px" }}>
            <span style={{
              color: hoy.status === "temprano" ? "#2E7D5B" : "#C0392B", fontWeight: 700,
            }}>
              {hoy.status === "temprano" ? "😀 A tiempo" : "😕 Retardo"}
            </span>
            {" "}· entrada {hoy.entrada}
            {yaSalio && <> · salida {hoy.salida}</>}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => registrar("entrada")}
          disabled={yaEntro}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "10px 18px", borderRadius: "12px", border: "none",
            background: yaEntro ? "#EAF1F4" : "linear-gradient(135deg, #17B3C2, #0F9DA6)",
            color: yaEntro ? "#6B83A8" : "#FFFFFF",
            fontSize: "13px", fontWeight: 600, cursor: yaEntro ? "default" : "pointer",
            fontFamily: "inherit", transition: "all .2s",
          }}
        >
          <LogIn size={14} /> {yaEntro ? "Entrada registrada" : "Registrar entrada"}
        </button>
        <button
          onClick={() => registrar("salida")}
          disabled={!yaEntro || yaSalio}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "10px 18px", borderRadius: "12px",
            border: "1.5px solid " + (!yaEntro || yaSalio ? "#DDE1EA" : "#2D4A7A"),
            background: "transparent",
            color: !yaEntro || yaSalio ? "#6B83A8" : "#2D4A7A",
            fontSize: "13px", fontWeight: 600,
            cursor: !yaEntro || yaSalio ? "default" : "pointer",
            fontFamily: "inherit", transition: "all .2s",
          }}
        >
          <LogOut size={14} /> {yaSalio ? "Salida registrada" : "Registrar salida"}
        </button>
      </div>
    </div>
  );
}
