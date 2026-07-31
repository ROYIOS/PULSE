"use client";

interface Props {
  value: number; // 0-100
  label: string;
  color?: string;
  size?: number;
}

export default function ProgressRing({ value, label, color = "#0F9DA6", size = 56 }: Props) {
  const stroke = Math.round(size * 0.11);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#EAF1F4" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
        <text
          x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
          style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: size * 0.24 }}
          fill="#1E2A4A"
        >
          {Math.round(value)}%
        </text>
      </svg>
      <div style={{
        fontSize: "9px", textTransform: "uppercase", letterSpacing: "1px",
        color: "#6B83A8", fontWeight: 600, marginTop: "6px",
      }}>
        {label}
      </div>
    </div>
  );
}
