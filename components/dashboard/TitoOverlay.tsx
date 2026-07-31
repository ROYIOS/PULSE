"use client";
import { useRef } from "react";
import { TitoSVG, useTito } from "./Tito";

/** Tito pasea, se sienta y hasta se echa una siesta por todo el dashboard. */
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
        left: tito.x - 34,
        top: tito.y - 88,
        willChange: "transform",
      }}>
        <TitoSVG
          size={68}
          mood={tito.mood}
          phase={tito.phase}
          dir={tito.dir}
          walkFrame={tito.walkFrame}
          jetFlicker={tito.jetFlicker}
        />
      </div>
    </div>
  );
}
