"use client";

import { cn } from "@/lib/utils";

interface RiskScoreGaugeProps {
  score: number;
}

const getRiskColor = (s: number) => {
  if (s <= 3) return { stroke: "#22c55e", text: "text-emerald-500", badge: "text-emerald-400 bg-emerald-500/10", label: "Low Risk" };
  if (s <= 6) return { stroke: "#eab308", text: "text-yellow-500",  badge: "text-yellow-400 bg-yellow-500/10",  label: "Moderate Risk" };
  if (s <= 8) return { stroke: "#f97316", text: "text-orange-500",  badge: "text-orange-400 bg-orange-500/10",  label: "High Risk" };
  return         { stroke: "#ef4444", text: "text-red-500",         badge: "text-red-400 bg-red-500/10",         label: "Extreme Risk" };
};

export const RiskScoreGauge = ({ score }: RiskScoreGaugeProps) => {
  const cfg = getRiskColor(score);

  // Arc: starts at -215deg, sweeps 250deg (like a speedometer, opening at bottom)
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r = 46;
  const startAngle = -215; // degrees
  const totalSweep = 250;
  const filledSweep = (score / 10) * totalSweep;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (sweep: number, color: string) => {
    const start = toRad(startAngle);
    const end   = toRad(startAngle + sweep);
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = sweep > 180 ? 1 : 0;
    return (
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
      />
    );
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ color: "hsl(var(--border))" }}>
          {/* Track */}
          {arcPath(totalSweep, "currentColor")}
          {/* Filled arc */}
          {arcPath(filledSweep, cfg.stroke)}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-4xl font-black tracking-tighter leading-none", cfg.text)}>
            {score}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 mt-0.5">
            / 10
          </span>
        </div>
      </div>

      <span className={cn("text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full", cfg.badge)}>
        {cfg.label} Profile
      </span>
    </div>
  );
};
