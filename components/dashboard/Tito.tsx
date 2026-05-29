"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type Mood  = "happy"|"work"|"curious"|"wave"|"sitting";
type Phase = "idle"|"takeoff"|"flying"|"landing"|"sitting"|"walking"|"looking";

interface TitoState {
  x:number; y:number; vx:number; vy:number;
  phase:Phase; mood:Mood; dir:number;
  targetX:number; targetY:number;
  timer:number;
  lean:number;
  wobble:number;
  wobbleDir:number;
}

export function TitoSVG({
  size=60, mood="happy", phase="idle", dir=1,
  walkFrame=0, jetFlicker=0, lean=0,
}:{
  size?:number; mood?:Mood; phase?:Phase; dir?:number;
  walkFrame?:number; jetFlicker?:number; lean?:number;
}) {
  const id  = useRef(`t${Math.random().toString(36).slice(2,6)}`).current;
  const fly = phase==="flying"||phase==="takeoff"||phase==="landing";
  const sit = phase==="sitting";
  const wlk = phase==="walking";
  const lk  = phase==="looking";
  const jf  = jetFlicker;

  // 8-frame walk cycle — smooth gait
  const legAngles = [8,16,20,14,6,-2,-6,-2];
  const legL = wlk ? legAngles[walkFrame%8]              : sit ? 38  : lk ? 5  : 0;
  const legR = wlk ? legAngles[(walkFrame+4)%8]          : sit ? -38 : lk ? -5 : 0;
  const aL   = wlk ? -legAngles[(walkFrame+4)%8]*.8      : sit ? 28  : lk ? 15 : 10;
  const aR   = wlk ? -legAngles[walkFrame%8]*.8          : sit ? -28 : lk ? -8 : -10;
  const bob  = wlk ? Math.sin(walkFrame/8*Math.PI*2)*2.5 : 0;
  const bodyLean = wlk ? lean*18 : lk ? 12 : 0;

  const tLL = sit ? "rotate(38 27 76)"  : `rotate(${legL} 32 76)`;
  const tLR = sit ? "rotate(-38 53 76)" : `rotate(${legR} 48 76)`;

  return (
    <svg width={size} height={size*1.3} viewBox="0 0 80 104"
      style={{overflow:"visible", transform:`scaleX(${dir})`}}>
      <defs>
        <radialGradient id={`v${id}`} cx="36%" cy="28%">
          <stop offset="0%"   stopColor="#EAF9FF" stopOpacity=".97"/>
          <stop offset="48%"  stopColor="#00B4D8" stopOpacity=".62"/>
          <stop offset="100%" stopColor="#083A5A" stopOpacity=".92"/>
        </radialGradient>
        <radialGradient id={`s${id}`} cx="24%" cy="18%">
          <stop offset="0%"   stopColor="#F4FAFF"/>
          <stop offset="100%" stopColor="#B8D2E4"/>
        </radialGradient>
        <radialGradient id={`g${id}`} cx="28%" cy="24%">
          <stop offset="0%"   stopColor="#2A5A9B"/>
          <stop offset="100%" stopColor="#0A1828"/>
        </radialGradient>
        <filter id={`gl${id}`}>
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <style>{`@keyframes tAnt{0%,100%{r:3.5;opacity:.8}50%{r:5.5;opacity:1}}`}</style>

      <g transform={`translate(0,${bob})`}>

        {/* FOOT THRUSTERS — only when flying */}
        {fly && (<>
          <ellipse cx={30} cy={97+jf*8}  rx={3}   ry={5+jf*9}
            fill="#00B4D8" opacity={.85} filter={`url(#gl${id})`}/>
          <ellipse cx={50} cy={97+jf*8}  rx={3}   ry={5+jf*9}
            fill="#00B4D8" opacity={.85} filter={`url(#gl${id})`}/>
          <ellipse cx={30} cy={100+jf*8} rx={1.8} ry={3+jf*5}
            fill="#CAF0F8" opacity={.95}/>
          <ellipse cx={50} cy={100+jf*8} rx={1.8} ry={3+jf*5}
            fill="#CAF0F8" opacity={.95}/>
          <ellipse cx={22} cy={72+jf*3}  rx={2} ry={3+jf*2} fill="#00B4D8" opacity={.5}/>
          <ellipse cx={58} cy={72+jf*3}  rx={2} ry={3+jf*2} fill="#00B4D8" opacity={.5}/>
        </>)}

        {/* TAKEOFF DUST */}
        {phase==="takeoff" && (
          <g opacity={Math.max(0,1-jf*2)}>
            <ellipse cx={30} cy={102} rx={9+jf*14} ry={3} fill="#CAF0F8" opacity={.3}/>
            <ellipse cx={50} cy={102} rx={9+jf*14} ry={3} fill="#CAF0F8" opacity={.3}/>
          </g>
        )}

        {/* BOOTS */}
        <g transform={tLL}>
          <rect x={22} y={90} width={12} height={8}  rx={3.5} fill="#1A3A6B"/>
          <rect x={20} y={95} width={15} height={5}  rx={2.5} fill="#0A1628"/>
          {fly && <ellipse cx={28} cy={97} rx={3.5} ry={2} fill="#1A3A6B"/>}
        </g>
        <g transform={tLR}>
          <rect x={46} y={90} width={12} height={8}  rx={3.5} fill="#1A3A6B"/>
          <rect x={45} y={95} width={15} height={5}  rx={2.5} fill="#0A1628"/>
          {fly && <ellipse cx={52} cy={97} rx={3.5} ry={2} fill="#1A3A6B"/>}
        </g>

        {/* LEGS */}
        <rect x={27} y={74} width={10} height={18} rx={5}
          transform={tLL} fill={`url(#s${id})`} stroke="#8AAABB" strokeWidth={.5}/>
        <rect x={43} y={74} width={10} height={18} rx={5}
          transform={tLR} fill={`url(#s${id})`} stroke="#8AAABB" strokeWidth={.5}/>

        {/* JETPACK */}
        <rect x={27} y={58} width={26} height={16} rx={5} fill="#0A1628"/>
        <rect x={30} y={61} width={8}  height={4}  rx={2} fill="#00B4D8" opacity={fly?.85:.6}/>
        <rect x={42} y={61} width={8}  height={4}  rx={2} fill="#00B4D8" opacity={fly?.55:.28}/>
        <rect x={28} y={71} width={7}  height={5}  rx={2.5} fill="#1A3A6B"/>
        <rect x={45} y={71} width={7}  height={5}  rx={2.5} fill="#1A3A6B"/>

        {/* BODY — tilts with lean */}
        <g transform={`rotate(${bodyLean} 40 62)`}>
          <rect x={20} y={42} width={40} height={30} rx={13}
            fill={`url(#s${id})`} stroke="#8AAABB" strokeWidth={.6}/>
          <rect x={26} y={47} width={28} height={18} rx={7} fill="white" opacity={.22}/>
          <text x={40} y={54} fontSize={4.5} textAnchor="middle"
            fill="#0A1628" fontWeight={700} opacity={.4}>PULSE</text>
          <circle cx={29} cy={63} r={2.2} fill="#00B4D8" opacity={.9}/>
          <circle cx={36} cy={65} r={1.8} fill="#D85A30" opacity={.75}/>
          <circle cx={44} cy={65} r={1.8} fill="#0F6E56" opacity={.75}/>
          <circle cx={51} cy={63} r={2.2} fill="#00B4D8" opacity={.9}/>
          <ellipse cx={28} cy={45} rx={9} ry={5} fill="white" opacity={.13}/>

          {/* LAPTOP — work mood */}
          {mood==="work" && (<>
            <rect x={26} y={70} width={28} height={4}  rx={1.5} fill="#0A1628"/>
            <rect x={27} y={54} width={26} height={18} rx={3}   fill="#0A1628"/>
            <rect x={28} y={55} width={24} height={14} rx={2}   fill="#00B4D8" opacity={.85}/>
            <rect x={31} y={58} width={14} height={1.5} rx={1}  fill="white" opacity={.7}/>
            <rect x={31} y={62} width={10} height={1.5} rx={1}  fill="white" opacity={.5}/>
          </>)}
        </g>

        {/* ARM LEFT */}
        <g transform={`rotate(${aL} 18 50)`}>
          <rect x={10} y={46} width={10} height={18} rx={5}
            fill={`url(#s${id})`} stroke="#8AAABB" strokeWidth={.5}/>
          <circle cx={15} cy={65} r={7}   fill={`url(#g${id})`}/>
          <circle cx={15} cy={65} r={4.5} fill="#1A3A5A"/>
          <ellipse cx={12} cy={60} rx={3} ry={2} fill="white" opacity={.12}/>
        </g>

        {/* ARM RIGHT */}
        {(mood as string)==="wave" ? (
          <g transform="rotate(-115 62 46)">
            <rect x={60} y={46} width={10} height={18} rx={5}
              fill={`url(#s${id})`} stroke="#8AAABB" strokeWidth={.5}/>
            <circle cx={65} cy={65} r={7}   fill={`url(#g${id})`}/>
            <circle cx={65} cy={65} r={4.5} fill="#1A3A5A"/>
          </g>
        ):(
          <g transform={`rotate(${aR} 62 50)`}>
            <rect x={60} y={46} width={10} height={18} rx={5}
              fill={`url(#s${id})`} stroke="#8AAABB" strokeWidth={.5}/>
            <circle cx={65} cy={65} r={7}   fill={`url(#g${id})`}/>
            <circle cx={65} cy={65} r={4.5} fill="#1A3A5A"/>
            <ellipse cx={62} cy={60} rx={3} ry={2} fill="white" opacity={.12}/>
          </g>
        )}

        {/* HELMET */}
        <ellipse cx={40} cy={24} rx={22} ry={25}
          fill={`url(#s${id})`} stroke="#8AAABB" strokeWidth={.6}/>
        <ellipse cx={34} cy={10} rx={8}  ry={5}  fill="white" opacity={.18}/>
        <rect x={20} y={42} width={40} height={8} rx={4}
          fill="#B8CCD8" stroke="#8AAABB" strokeWidth={.5}/>
        <ellipse cx={40} cy={24} rx={15} ry={17}
          fill={`url(#v${id})`} stroke="#00B4D8" strokeWidth={1}/>
        <ellipse cx={34} cy={14} rx={6}  ry={3.5} fill="white" opacity={.2}/>

        {/* EYES */}
        {mood==="curious"||lk ? (<>
          <ellipse cx={33} cy={22} rx={5}   ry={6}   fill="rgba(10,26,40,.65)"/>
          <ellipse cx={33} cy={22} rx={3.5} ry={4.5} fill="#00B4D8"/>
          <ellipse cx={33} cy={22} rx={2.2} ry={3}   fill="#CAF0F8"/>
          <circle  cx={34} cy={19} r={1.3}  fill="white"/>
          <ellipse cx={47} cy={21} rx={7}   ry={7.5} fill="rgba(10,26,40,.65)"/>
          <ellipse cx={47} cy={21} rx={5.5} ry={5.5} fill="#00B4D8"/>
          <ellipse cx={47} cy={21} rx={3.5} ry={3.5} fill="#CAF0F8"/>
          <circle  cx={48} cy={18} r={1.8}  fill="white"/>
        </>) : mood==="sitting"||(mood as string)==="wave" ? (<>
          <ellipse cx={33} cy={23} rx={5.5} ry={4}   fill="rgba(10,26,40,.65)"/>
          <ellipse cx={33} cy={23} rx={4}   ry={3}   fill="#00B4D8"/>
          <ellipse cx={33} cy={23} rx={2.5} ry={2}   fill="#CAF0F8"/>
          <ellipse cx={47} cy={23} rx={5.5} ry={4}   fill="rgba(10,26,40,.65)"/>
          <ellipse cx={47} cy={23} rx={4}   ry={3}   fill="#00B4D8"/>
          <ellipse cx={47} cy={23} rx={2.5} ry={2}   fill="#CAF0F8"/>
        </>) : (<>
          <ellipse cx={33} cy={22} rx={5.5} ry={6}   fill="rgba(10,26,40,.65)"/>
          <ellipse cx={33} cy={22} rx={4}   ry={4.5} fill="#00B4D8"/>
          <ellipse cx={33} cy={22} rx={2.5} ry={3}   fill="#CAF0F8"/>
          <circle  cx={34} cy={19} r={1.4}  fill="white"/>
          <ellipse cx={47} cy={22} rx={5.5} ry={6}   fill="rgba(10,26,40,.65)"/>
          <ellipse cx={47} cy={22} rx={4}   ry={4.5} fill="#00B4D8"/>
          <ellipse cx={47} cy={22} rx={2.5} ry={3}   fill="#CAF0F8"/>
          <circle  cx={48} cy={19} r={1.4}  fill="white"/>
        </>)}

        {/* MOUTH */}
        <path d={
          mood==="work"    ? "M35 32 L45 32" :
          mood==="curious"||lk ? "M34 32 Q40 30 46 32" :
          "M34 31 Q40 37 46 31"
        } fill="none" stroke="rgba(10,58,90,.55)" strokeWidth={1.4} strokeLinecap="round"/>

        {/* ANTENNA */}
        <rect x={38} y={0} width={3} height={10} rx={1.5} fill="#1A3A6B"/>
        <circle cx={39} cy={-1} r={4} fill="#00B4D8" opacity={.9}
          style={{animation:"tAnt .8s ease-in-out infinite"} as React.CSSProperties}/>
        <circle cx={39} cy={-1} r={2} fill="#CAF0F8"/>
      </g>
    </svg>
  );
}

/* ── useTito hook ─────────────────────────────────────────────── */
export function useTito(containerRef: React.RefObject<HTMLDivElement|null>) {
  const st = useRef<TitoState>({
    x:80, y:50, vx:0, vy:0,
    phase:"idle", mood:"happy", dir:1,
    targetX:80, targetY:50, timer:60,
    lean:0, wobble:0, wobbleDir:1,
  });
  const [,redraw] = useState(0);

  const wFrame   = useRef(0);
  const wTimer   = useRef(0);
  const jFlick   = useRef(0);
  const raf      = useRef(0);
  const seatIdx  = useRef(0);
  const waving   = useRef(false);
  const waveTmr  = useRef(0);
  const leanRef  = useRef(0);

  const getSeats = useCallback(()=>{
    const el = containerRef.current;
    if(!el) return [];
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    return [
      // progress bar seats
      {x:w*.12, y:h*.60},{x:w*.42, y:h*.60},{x:w*.72, y:h*.60},
      // stat card tops
      {x:w*.18, y:h*.25},{x:w*.50, y:h*.25},{x:w*.80, y:h*.25},
      // wander spots — no sit
      {x:w*.30, y:h*.45},{x:w*.65, y:h*.38},{x:w*.20, y:h*.55},
    ];
  },[containerRef]);

  useEffect(()=>{
    function loop(){
      const s     = st.current;
      const seats = getSeats();
      if(!seats.length){raf.current=requestAnimationFrame(loop);return;}

      // organic jet flicker
      jFlick.current = .5+.5*Math.sin(Date.now()*.022+Math.sin(Date.now()*.007)*2);

      // smooth lean
      const targetLean = s.phase==="walking" ? Math.sign(s.vx)*.6 : 0;
      leanRef.current += (targetLean-leanRef.current)*.08;
      s.lean = leanRef.current;

      // walk frame — 1 frame per 7px traveled = steps sync with movement
      if(s.phase==="walking"){
        const dist = Math.sqrt(s.vx*s.vx + s.vy*s.vy);
        wTimer.current += dist;
        if(wTimer.current >= 7){
          wTimer.current = 0;
          wFrame.current = (wFrame.current+1)%8;
        }
      }

      // wave cycle while sitting
      if(s.phase==="sitting"){
        waveTmr.current--;
        if(waveTmr.current<=0){
          waving.current=!waving.current;
          waveTmr.current = waving.current ? 55 : 100+Math.floor(Math.random()*80);
          s.mood = waving.current ? "wave" : "sitting";
        }
      }

      switch(s.phase){

        case "idle":{
          s.timer--;
          if(s.timer>0) break;
          seatIdx.current=(seatIdx.current+1)%seats.length;
          const seat=seats[seatIdx.current];
          s.targetX=seat.x; s.targetY=seat.y;
          const dx0=seat.x-s.x, dy0=seat.y-s.y;
          const dist0=Math.sqrt(dx0*dx0+dy0*dy0);
          s.dir=dx0>0?1:-1;
          if(Math.random()<.3 && dist0>40){
            s.phase="looking"; s.mood="curious";
            s.timer=40+Math.floor(Math.random()*50);
          } else if(dist0<150){
            s.phase="walking"; s.mood="happy"; s.timer=0;
            s.vx=0; s.vy=0;
          } else {
            s.phase="takeoff"; s.mood="work";
            s.timer=28; s.vx=0; s.vy=0;
          }
          break;
        }

        case "looking":{
          s.timer--;
          if(s.timer<=0){
            const dx=s.targetX-s.x;
            const dist=Math.sqrt(dx*dx+(s.targetY-s.y)**2);
            s.dir=dx>0?1:-1;
            if(dist<150){
              s.phase="walking"; s.mood="happy"; s.timer=0;
            } else {
              s.phase="takeoff"; s.mood="work"; s.timer=28;
              s.vx=0; s.vy=0;
            }
          }
          break;
        }

        case "walking":{
          const dx=s.targetX-s.x, dy=s.targetY-s.y;
          const dist=Math.sqrt(dx*dx+dy*dy);

          if(dist<3){
            s.x=s.targetX; s.y=s.targetY;
            s.vx=0; s.vy=0;
            leanRef.current=0;
            wFrame.current=0;
            if(seatIdx.current<6){
              s.phase="sitting"; s.mood="sitting";
              waving.current=false;
              waveTmr.current=70+Math.floor(Math.random()*60);
              s.timer=180+Math.floor(Math.random()*140);
            } else {
              s.phase="idle"; s.timer=20+Math.floor(Math.random()*30);
              s.mood="happy";
            }
            break;
          }

          // ease-in ease-out
          const maxSpd = 3.2;
          const ramp   = Math.min(1, dist/40);
          const accel  = Math.min(1, (s.timer+1)/20);
          const spd    = maxSpd * Math.min(ramp, accel<1?accel:1);

          // organic wobble perpendicular to path
          s.wobble += .06*s.wobbleDir;
          if(Math.abs(s.wobble)>1.2) s.wobbleDir*=-1;
          const perp = Math.atan2(dy,dx)+Math.PI/2;
          s.vx = (dx/dist)*spd + Math.cos(perp)*s.wobble*.4;
          s.vy = (dy/dist)*spd*.4 + Math.sin(perp)*s.wobble*.2;
          s.x += s.vx;
          s.y += s.vy;
          s.dir = s.vx>0?1:-1;
          s.timer=(s.timer||0)+1;
          break;
        }

        case "takeoff":{
          s.timer--;
          s.y -= jFlick.current*.9+.3;
          s.x += Math.sin(s.timer*.4)*.5;
          if(s.timer<=0){
            s.phase="flying";
            const dx=s.targetX-s.x, dy=s.targetY-s.y;
            const dist=Math.sqrt(dx*dx+dy*dy);
            const spd=Math.min(6,dist*.052);
            s.vx=(dx/dist)*spd; s.vy=(dy/dist)*spd;
            s.dir=dx>0?1:-1;
          }
          break;
        }

        case "flying":{
          const dx=s.targetX-s.x, dy=s.targetY-s.y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if(dist>15){s.vx+=(dx/dist)*.12; s.vy+=(dy/dist)*.12;}
          const spd=Math.sqrt(s.vx*s.vx+s.vy*s.vy);
          if(spd>6){s.vx=(s.vx/spd)*6; s.vy=(s.vy/spd)*6;}
          // gravity arc + micro-turbulence
          s.vy+=.05;
          s.vx+=Math.sin(Date.now()*.008)*.04;
          s.vy+=Math.cos(Date.now()*.011)*.03;
          s.x+=s.vx; s.y+=s.vy;
          s.dir=s.vx>0?1:-1;
          if(dist<22){s.phase="landing"; s.timer=30;}
          break;
        }

        case "landing":{
          s.timer--;
          s.vx*=.75; s.vy*=.75;
          s.x+=s.vx; s.y+=s.vy;
          s.x+=(s.targetX-s.x)*.2;
          s.y+=(s.targetY-s.y)*.2;
          if(s.timer<=0){
            s.x=s.targetX; s.y=s.targetY;
            s.vx=0; s.vy=0;
            s.phase="sitting"; s.mood="sitting";
            waving.current=false;
            waveTmr.current=70+Math.floor(Math.random()*60);
            s.timer=180+Math.floor(Math.random()*140);
          }
          break;
        }

        case "sitting":{
          s.timer--;
          if(s.timer<=0){
            s.phase="idle"; s.timer=15; s.mood="happy";
            waving.current=false;
          }
          break;
        }
      }

      redraw(r=>r+1);
      raf.current=requestAnimationFrame(loop);
    }
    raf.current=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(raf.current);
  },[getSeats]);

  return {
    x:st.current.x, y:st.current.y,
    phase:st.current.phase, mood:st.current.mood, dir:st.current.dir,
    walkFrame:wFrame.current, jetFlicker:jFlick.current,
    lean:leanRef.current,
  };
}
