"use client";
import { useEffect, useRef, useState, RefObject } from "react";

type Bit = "idle" | "wave" | "spin" | "jump" | "look" | "yawn" | "sleeping" | "tongue";

interface TitoState {
  x: number; y: number; dir: 1 | -1;
  walking: boolean; walkFrame: number;
  bit: Bit; bitProgress: number;
}

/**
 * Tito camina por el "piso" (parte baja del contenedor), se detiene cada tanto
 * a hacer una gracia (saludar, girar, saltar, ver a los lados, bostezar/dormir),
 * y vuelve a caminar. Nada de flotar sin sentido.
 */
export function useTito(containerRef: RefObject<HTMLDivElement | null>) {
  const [state, setState] = useState<TitoState>({
    x: 80, y: 0, dir: 1, walking: true, walkFrame: 0, bit: "idle", bitProgress: 0,
  });
  const target = useRef(80);
  const bitTimer = useRef(0);
  const bitDuration = useRef(0);

  useEffect(() => {
    let raf: number;
    let frame = 0;

    function pickNewTarget(width: number) {
      const margin = 60;
      target.current = margin + Math.random() * Math.max(1, width - margin * 2);
    }

    function pickBit(): Bit {
      const opciones: Bit[] = ["wave", "spin", "jump", "look", "yawn", "tongue"];
      // 1 de cada ~6 bostezos termina en siesta real
      if (Math.random() < 0.12) return "sleeping";
      return opciones[Math.floor(Math.random() * opciones.length)];
    }

    function tick() {
      frame++;
      setState(s => {
        const el = containerRef.current;
        const width = el ? el.clientWidth : 320;
        const height = el ? el.clientHeight : 400;
        const floorY = Math.max(40, height - 70);

        let { x, y, dir, walking, walkFrame, bit, bitProgress } = s;
        y = floorY;

        if (walking) {
          const dx = target.current - x;
          if (Math.abs(dx) < 4) {
            // llegó: hace una gracia
            walking = false;
            bit = pickBit();
            bitProgress = 0;
            bitDuration.current = bit === "sleeping" ? 220 : bit === "wave" ? 55 : bit === "spin" ? 40 : 45;
          } else {
            dir = dx > 0 ? 1 : -1;
            x += dir * 1.6;
            walkFrame = (walkFrame + 1) % 8;
          }
        } else {
          bitProgress++;
          if (bitProgress > bitDuration.current) {
            walking = true;
            if (el) pickNewTarget(width);
          }
        }

        return { x, y, dir, walking, walkFrame, bit, bitProgress };
      });
      raf = requestAnimationFrame(tick);
    }

    if (containerRef.current) pickNewTarget(containerRef.current.clientWidth);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [containerRef]);

  return state;
}

export function TitoSVG({ state, size = 72 }: { state: TitoState; size?: number }) {
  const { dir, walking, walkFrame, bit, bitProgress } = state;

  const bob = walking ? Math.abs(Math.sin((walkFrame / 8) * Math.PI * 2)) * 3 : 0;
  const jumpH = bit === "jump" ? Math.abs(Math.sin((bitProgress / 45) * Math.PI)) * 14 : 0;
  const spin = bit === "spin" ? (bitProgress / 40) * 360 : 0;
  const lean = walking ? dir * 5 : 0;

  const legSwing = walking ? Math.sin((walkFrame / 8) * Math.PI * 2) * 16 : 0;
  const armSwing = walking ? -Math.sin((walkFrame / 8) * Math.PI * 2) * 12 : 0;

  const waving = bit === "wave" && bitProgress < 55;
  const looking = bit === "look";
  const yawning = bit === "yawn" && bitProgress < 45;
  const sleeping = bit === "sleeping";
  const tongue = bit === "tongue";

  const lookOffset = looking ? Math.sin(bitProgress / 6) * 4 : 0;
  const breathe = sleeping ? Math.sin(Date.now() / 600) * 1.5 : 0;

  return (
    <svg
      width={size} height={size * 1.15} viewBox="-20 -20 100 115"
      style={{
        transform: `scaleX(${dir}) translateY(${-jumpH - bob - breathe}px) rotate(${spin}deg)`,
        transformOrigin: "40px 60px",
        transition: bit === "spin" ? "none" : "transform .08s linear",
      }}
    >
      <style>{`@keyframes tZ{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-5px)}}`}</style>

      {/* sombra en el piso */}
      <ellipse cx="40" cy="92" rx={16 - jumpH * 0.3} ry="4" fill="rgba(30,42,74,0.15)"/>

      <g style={{ transform: `rotate(${lean}deg)`, transformOrigin: "40px 45px" }}>
        {/* pie trasero */}
        <ellipse cx={40 - 10 + legSwing * 0.4} cy={86} rx="9" ry="6" fill="#1B4D8A"/>
        {/* pie delantero */}
        <ellipse cx={40 + 10 - legSwing * 0.4} cy={86} rx="9" ry="6" fill="#0E3A6B"/>

        {/* cuerpo: blob turquesa/azul */}
        <path
          d="M40 8
             C 60 8, 70 26, 70 46
             C 70 68, 58 82, 40 82
             C 22 82, 10 68, 10 46
             C 10 26, 20 8, 40 8 Z"
          fill="url(#titoBody)"
        />
        <defs>
          <linearGradient id="titoBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3FD1D8"/>
            <stop offset="100%" stopColor="#0F9DA6"/>
          </linearGradient>
        </defs>

        {/* franja/cinturón con el logo, como un mono de trabajo mini */}
        <rect x="10" y="58" width="60" height="10" fill="#1E2A4A" opacity="0.85"/>
        <circle cx="40" cy="63" r="4" fill="#F5C93F"/>

        {/* brazo trasero */}
        <ellipse
          cx={16} cy={52 + armSwing * 0.3}
          rx="6" ry="16" fill="#0E3A6B"
          style={{ transformOrigin: "16px 42px", transform: `rotate(${waving ? 0 : armSwing}deg)` }}
        />
        {/* brazo delantero — se levanta al saludar */}
        <g style={{ transformOrigin: "64px 42px", transform: `rotate(${waving ? -140 + Math.sin(bitProgress/3)*20 : -armSwing}deg)` }}>
          <ellipse cx="64" cy="52" rx="6" ry="16" fill="#12A6AF"/>
        </g>

        {/* ojos: grandes, expresivos, el elemento chistoso principal */}
        {sleeping ? (
          <>
            <path d="M22 40 Q30 46 38 40" stroke="#0B2338" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M42 40 Q50 46 58 40" stroke="#0B2338" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </>
        ) : yawning ? (
          <>
            <ellipse cx="30" cy="38" rx="9" ry="10" fill="#FFFFFF"/>
            <ellipse cx="30" cy="40" rx="4" ry="5" fill="#12324A"/>
            <ellipse cx="50" cy="38" rx="9" ry="10" fill="#FFFFFF"/>
            <ellipse cx="50" cy="40" rx="4" ry="5" fill="#12324A"/>
          </>
        ) : (
          <>
            <ellipse cx="30" cy="38" rx="10" ry="11" fill="#FFFFFF"/>
            <ellipse cx={30 + lookOffset} cy="39" rx="5" ry="6" fill="#12324A"/>
            <circle cx={31 + lookOffset} cy="36" r="1.6" fill="#FFFFFF"/>
            <ellipse cx="50" cy="38" rx="10" ry="11" fill="#FFFFFF"/>
            <ellipse cx={50 + lookOffset} cy="39" rx="5" ry="6" fill="#12324A"/>
            <circle cx={51 + lookOffset} cy="36" r="1.6" fill="#FFFFFF"/>
          </>
        )}

        {/* boca */}
        {sleeping ? null : yawning ? (
          <ellipse cx="40" cy="52" rx="6" ry="8" fill="#7A2E2E"/>
        ) : tongue ? (
          <>
            <path d="M32 52 Q40 60 48 52" fill="#7A2E2E"/>
            <ellipse cx="40" cy="58" rx="4" ry="5" fill="#E8657A"/>
          </>
        ) : (
          <path d="M31 52 Q40 58 49 52" stroke="#0B2338" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
        )}
      </g>

      {sleeping && (
        <g style={{ animation: "tZ 2.2s ease-in-out infinite" }}>
          <text x="66" y="10" fontSize="10" fontWeight={700} fill="#0F9DA6">z</text>
          <text x="74" y="0" fontSize="13" fontWeight={700} fill="#0F9DA6">Z</text>
        </g>
      )}
    </svg>
  );
}
