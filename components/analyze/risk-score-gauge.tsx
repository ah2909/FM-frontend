"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RiskScoreGaugeProps {
  score: number;
}

export const RiskScoreGauge = ({ score }: RiskScoreGaugeProps) => {
  // Score is 1-10
  const normalizedScore = (score / 10) * 100;
  
  const getRiskColor = (s: number) => {
    if (s <= 3) return "text-green-500";
    if (s <= 6) return "text-yellow-500";
    if (s <= 8) return "text-orange-500";
    return "text-red-500";
  };
  
  const getRiskLabel = (s: number) => {
    if (s <= 3) return "Low";
    if (s <= 6) return "Moderate";
    if (s <= 8) return "High";
    return "Extreme";
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative size-40">
        <svg className="size-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset,
              transition: 'stroke-dashoffset 1s ease-in-out',
              stroke: normalizedScore <= 30 ? '#22c55e' : normalizedScore <= 60 ? '#eab308' : normalizedScore <= 80 ? '#f97316' : '#ef4444'
            }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-5xl font-black tracking-tighter", getRiskColor(score))}>{score}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Risk Scale</span>
        </div>
      </div>
      <div className="text-center">
        <Badge variant="outline" className={cn("font-black uppercase tracking-widest px-4 py-1 border-none", 
          score <= 3 ? "bg-green-500/10 text-green-500" : 
          score <= 6 ? "bg-yellow-500/10 text-yellow-500" : 
          score <= 8 ? "bg-orange-500/10 text-orange-500" : "bg-red-500/10 text-red-500"
        )}>
          {getRiskLabel(score)} Risk Profile
        </Badge>
      </div>
    </div>
  );
};
