"use client";
import { useRef } from "react";
import { TitoSVG, useTito } from "./Tito";

/** Tito camina, hace gracias y hasta se echa una siesta por todo el dashboard. */
export default function TitoOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tito = useTito(containerRef);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute", inset: 0,
        pointerEvents: "none", zIndex: 5,
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute",
        left: tito.x - 40,
        top: tito.y - 95,
        willChange: "transform",
      }}>
        <TitoSVG state={tito} size={72}/>
      </div>
    </div>
  );
}
