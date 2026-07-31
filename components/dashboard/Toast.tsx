"use client";

interface Props { message: string; }

export default function Toast({ message }: Props) {
  if (!message) return null;
  return (
    <div style={{
      position: "fixed", bottom: "28px", right: "28px",
      background: "#1E2A4A", color: "#FFFFFF",
      padding: "14px 20px", borderRadius: "12px",
      fontSize: "13.5px", display: "flex", alignItems: "center", gap: "10px",
      boxShadow: "0 8px 30px rgba(10,22,40,0.25)",
      animation: "slideInRight .4s cubic-bezier(0.34,1.56,0.64,1)",
      zIndex: 9999, maxWidth: "360px",
      borderLeft: "3px solid #0F9DA6",
    }}>
      <span style={{ color: "#0F9DA6", fontSize: "16px" }}>✓</span>
      {message}
      <style>{`
        @keyframes slideInRight {
          from { opacity:0; transform:translateX(30px) }
          to   { opacity:1; transform:translateX(0) }
        }
      `}</style>
    </div>
  );
}
