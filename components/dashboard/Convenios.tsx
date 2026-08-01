"use client";
import { useState, useEffect } from "react";
import { Tag, Plus, Trash2, ExternalLink } from "lucide-react";

interface Convenio {
  id: number; empresa: string; categoria: string; descuento: string; nota: string;
}

const CATEGORIAS = ["Gimnasio", "Restaurantes", "Salud", "Educación", "Retail", "Entretenimiento", "Otro"];

function loadConvenios(): Convenio[] {
  try { return JSON.parse(localStorage.getItem("pulse_convenios") || "[]"); } catch { return []; }
}
function saveConvenios(d: Convenio[]) { localStorage.setItem("pulse_convenios", JSON.stringify(d)); }

export default function Convenios({ soloLectura = false }: { soloLectura?: boolean }) {
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ empresa: "", categoria: CATEGORIAS[0], descuento: "", nota: "" });

  useEffect(() => { setConvenios(loadConvenios()); }, []);

  function agregar() {
    if (!form.empresa.trim()) return;
    const nuevo: Convenio = { id: Date.now(), ...form };
    const updated = [nuevo, ...convenios];
    setConvenios(updated); saveConvenios(updated);
    setForm({ empresa: "", categoria: CATEGORIAS[0], descuento: "", nota: "" });
    setShowForm(false);
  }
  function eliminar(id: number) {
    const updated = convenios.filter(c => c.id !== id);
    setConvenios(updated); saveConvenios(updated);
  }

  const inp: React.CSSProperties = {
    width:"100%",padding:"9px 12px",borderRadius:"9px",
    border:"1.5px solid #DDE1EA",background:"#FFFFFF",
    color:"#1E2A4A",fontSize:"12.5px",outline:"none",
    boxSizing:"border-box",fontFamily:"inherit",
  };

  return (
    <div className="glass-static" style={{borderRadius:"14px",overflow:"hidden"}}>
      <div style={{padding:"18px 22px",borderBottom:"1px solid #DDE1EA",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <span style={{fontSize:"14px",fontWeight:700,fontFamily:"'Sora', sans-serif",color:"#1E2A4A"}}>Convenios y promociones</span>
          <p style={{fontSize:"11.5px",color:"#6B83A8",margin:"4px 0 0"}}>{convenios.length} convenios activos para empleados</p>
        </div>
        {!soloLectura && (
          <button onClick={()=>setShowForm(s=>!s)} style={{
            padding:"8px 16px",borderRadius:"9px",border:"none",
            background:"#0F9DA6",color:"#1E2A4A",fontSize:"12px",fontWeight:700,
            cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"5px",
          }}><Plus size={13}/> Agregar convenio</button>
        )}
      </div>

      {showForm && !soloLectura && (
        <div style={{padding:"16px 22px",borderBottom:"1px solid #EAEDF2",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Empresa</label>
            <input style={inp} value={form.empresa} onChange={e=>setForm(f=>({...f,empresa:e.target.value}))} placeholder="Ej. Smart Fit"/>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Categoría</label>
            <select style={inp} value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))}>
              {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Descuento</label>
            <input style={inp} value={form.descuento} onChange={e=>setForm(f=>({...f,descuento:e.target.value}))} placeholder="Ej. 20% en membresía"/>
          </div>
          <div>
            <label style={{fontSize:"9.5px",color:"#6B83A8",textTransform:"uppercase",fontWeight:600}}>Nota / cómo aplicarlo</label>
            <input style={inp} value={form.nota} onChange={e=>setForm(f=>({...f,nota:e.target.value}))} placeholder="Ej. Presentar credencial Zyrox"/>
          </div>
          <div style={{gridColumn:"1 / -1",display:"flex",justifyContent:"flex-end"}}>
            <button onClick={agregar} style={{
              padding:"9px 20px",borderRadius:"9px",border:"none",
              background:"#0F9DA6",color:"#1E2A4A",fontSize:"12.5px",fontWeight:700,
              cursor:"pointer",fontFamily:"inherit",
            }}>Guardar</button>
          </div>
        </div>
      )}

      {convenios.length === 0 ? (
        <div style={{padding:"30px",textAlign:"center",color:"#6B83A8",fontSize:"12.5px"}}>Sin convenios registrados todavía.</div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1px",background:"#EAEDF2"}}>
          {convenios.map(c => (
            <div key={c.id} style={{padding:"14px 22px",background:"#FFFFFF",display:"flex",justifyContent:"space-between",alignItems:"start"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"4px"}}>
                  <Tag size={12} color="#0F9DA6"/>
                  <span style={{fontSize:"9px",color:"#6B83A8",textTransform:"uppercase",fontWeight:700}}>{c.categoria}</span>
                </div>
                <div style={{fontSize:"13px",fontWeight:600,color:"#1E2A4A"}}>{c.empresa}</div>
                <div style={{fontSize:"12px",color:"#0F9DA6",fontWeight:700,marginTop:"2px"}}>{c.descuento}</div>
                {c.nota && <div style={{fontSize:"10.5px",color:"#6B83A8",marginTop:"3px"}}>{c.nota}</div>}
              </div>
              {!soloLectura && (
                <button onClick={()=>eliminar(c.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#C0392B"}}><Trash2 size={13}/></button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
