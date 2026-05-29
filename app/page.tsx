"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Loader2, ArrowRight, BarChart2 } from "lucide-react";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [hoverBtn, setHoverBtn] = useState(false);
  const [hoverGerencia, setHoverGerencia] = useState(false);
  const [hoverLogo, setHoverLogo] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!mainRef.current) return;
      const { width, height } = mainRef.current.getBoundingClientRect();
      setMouse({ x: e.clientX / width, y: e.clientY / height });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    window.location.href = "/dashboard";
  }

  function handleGerencia() {
    window.location.href = "/dashboard?page=gerencia";
  }

  const glowX = `${mouse.x * 100}%`;
  const glowY = `${mouse.y * 100}%`;

  return (
    <main
      ref={mainRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        borderRadius: "0px",
      }}
    >
      {/* IZQUIERDA */}
      <div
        style={{
          width: "52%",
          background: "#0A1628",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 64px",
          position: "relative",
          overflow: "hidden",
          borderRadius: "0 24px 24px 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,180,216,0.20) 0%, transparent 60%)",
            transform: "translate(-50%, -50%)",
            left: glowX,
            top: glowY,
            transition:
              "left .8s cubic-bezier(0.25,1,0.5,1), top .8s cubic-bezier(0.25,1,0.5,1)",
            mixBlendMode: "screen",
          }}
        />

        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(26,58,107,0.5) 0%, transparent 65%)",
            transform: "translate(-50%, -50%)",
            left: `${(1 - mouse.x) * 100}%`,
            top: `${(1 - mouse.y) * 100}%`,
            transition:
              "left 1.2s cubic-bezier(0.25,1,0.5,1), top 1.2s cubic-bezier(0.25,1,0.5,1)",
          }}
        />

        {/* Logo */}
        <div
          style={{ position: "relative", cursor: "default" }}
          onMouseEnter={() => setHoverLogo(true)}
          onMouseLeave={() => setHoverLogo(false)}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 18px 10px 14px",
              borderRadius: "40px",
              border: `1px solid ${
                hoverLogo
                  ? "rgba(0,180,216,0.4)"
                  : "rgba(255,255,255,0.06)"
              }`,
              background: hoverLogo ? "rgba(0,180,216,0.08)" : "transparent",
              backdropFilter: hoverLogo ? "blur(12px)" : "none",
              transition: "all .4s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#00B4D8",
                boxShadow: hoverLogo
                  ? "0 0 16px rgba(0,180,216,1)"
                  : "0 0 8px rgba(0,180,216,0.6)",
                transition: "box-shadow .3s",
              }}
            />

            <span
              style={{
                fontSize: "18px",
                fontWeight: 300,
                letterSpacing: "10px",
                color: "#FFFFFF",
              }}
            >
              PULSE
            </span>
          </div>

          <p
            style={{
              fontSize: "10px",
              color: "#4A6080",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginTop: "8px",
              marginLeft: "14px",
            }}
          >
            People & Workforce Management
          </p>
        </div>

        {/* Texto */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "28px",
              height: "2px",
              background: "#00B4D8",
              boxShadow: "0 0 8px rgba(0,180,216,0.6)",
              marginBottom: "28px",
            }}
          />

          <h2
            style={{
              fontSize: "40px",
              fontWeight: 300,
              color: "#FFFFFF",
              lineHeight: 1.2,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Tu historial.
            <br />
            Tus vacaciones.
            <br />
            <span
              style={{
                color: "#00B4D8",
                fontWeight: 500,
                textShadow: "0 0 30px rgba(0,180,216,0.4)",
              }}
            >
              Tu control.
            </span>
          </h2>

          <p
            style={{
              color: "#4A6080",
              fontSize: "13.5px",
              marginTop: "24px",
              lineHeight: 1.75,
              maxWidth: "320px",
            }}
          >
            Incidencias, vacaciones, retardos y gestión gerencial desde un solo
            lugar.
          </p>
        </div>

        <p style={{ color: "#1E3050", fontSize: "11px", position: "relative" }}>
          v1.0 · 2026 · Confidencial
        </p>
      </div>

      {/* DERECHA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4F8FB",
          padding: "48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            position: "relative",
          }}
        >
          <h2
            style={{
              fontSize: "26px",
              fontWeight: 600,
              color: "#0A1628",
              margin: 0,
            }}
          >
            Bienvenido de vuelta
          </h2>

          <p
            style={{
              color: "#8BA3BF",
              fontSize: "14px",
              marginTop: "6px",
              marginBottom: "36px",
            }}
          >
            Ingresa tus credenciales para continuar
          </p>

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#4A6080",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "8px",
                }}
              >
                Correo corporativo
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jorge@empresa.com"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #D8E6F0",
                  background: "#FFFFFF",
                  color: "#0A1628",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#4A6080",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "8px",
                }}
              >
                Contraseña
              </label>

              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "13px 44px 13px 16px",
                    borderRadius: "12px",
                    border: "1.5px solid #D8E6F0",
                    background: "#FFFFFF",
                    color: "#0A1628",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#8BA3BF",
                    display: "flex",
                    padding: 0,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "12px",
                border: "none",
                background: "#00B4D8",
                color: "#0A1628",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "4px",
                fontFamily: "inherit",
                opacity: loading ? 0.7 : 1,
                boxShadow:
                  hoverBtn && !loading
                    ? "0 8px 28px rgba(0,180,216,0.50)"
                    : "0 4px 14px rgba(0,180,216,0.28)",
                transform:
                  hoverBtn && !loading
                    ? "translateY(-2px) scale(1.01)"
                    : "translateY(0) scale(1)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <span>Ingresar a PULSE</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleGerencia}
              onMouseEnter={() => setHoverGerencia(true)}
              onMouseLeave={() => setHoverGerencia(false)}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "1.5px solid #D8E6F0",
                background: hoverGerencia ? "#FFFFFF" : "transparent",
                color: hoverGerencia ? "#00B4D8" : "#4A6080",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "inherit",
                transition: "all .25s",
              }}
            >
              <BarChart2 size={16} />
              Entrar a Gerencia
            </button>
          </form>

          <div
            style={{
              marginTop: "40px",
              paddingTop: "24px",
              borderTop: "1px solid #D8E6F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#00B4D8",
                opacity: 0.5,
              }}
            />

            <p style={{ fontSize: "11px", color: "#8BA3BF", margin: 0 }}>
              PULSE · v1.0 · 2026
            </p>

            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#00B4D8",
                opacity: 0.5,
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          main > div:first-child { display: none !important; }
          main > div:last-child { padding: 32px 24px !important; }
        }
      `}</style>
    </main>
  );
}