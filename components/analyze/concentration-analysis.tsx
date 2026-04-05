"use client";

import { cn } from "@/lib/utils";

interface ConcentrationAnalysisProps {
  allocations: { symbol: string; percentage: number; flag: string }[];
  herfindahl_index: number;
}

const FLAG: Record<string, { bar: string; text: string }> = {
  extreme: { bar: "bg-red-500",     text: "text-red-400" },
  high:    { bar: "bg-orange-500",  text: "text-orange-400" },
  moderate:{ bar: "bg-yellow-500",  text: "text-yellow-400" },
  safe:    { bar: "bg-emerald-500", text: "text-emerald-400" },
};

export const ConcentrationAnalysis = ({
  allocations,
  herfindahl_index,
}: ConcentrationAnalysisProps) => {
  const nonZero = allocations.filter((a) => a.percentage > 0);
  const visible = nonZero.slice(0, 8);
  const maxPct  = visible[0]?.percentage ?? 1;
  const hidden  = nonZero.length - visible.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          Concentration Analysis
        </p>
        <span className="text-[10px] font-mono text-muted-foreground/50">
          HHI {herfindahl_index.toFixed(3)}
        </span>
      </div>

      {/* Bars */}
      <div className="space-y-2.5 flex-1">
        {visible.map((a) => {
          const cfg = FLAG[a.flag] ?? FLAG.safe;
          return (
            <div key={a.symbol} className="flex items-center gap-3">
              <span className="text-[11px] font-black w-12 shrink-0 tracking-wide">
                {a.symbol}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-border/40 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-700 ease-out", cfg.bar)}
                  style={{ width: `${(a.percentage / maxPct) * 100}%` }}
                />
              </div>
              <span className={cn("text-[11px] font-mono font-bold w-12 text-right shrink-0", cfg.text)}>
                {a.percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {(["extreme","high","moderate","safe"] as const).map((flag) => (
            <div key={flag} className="flex items-center gap-1">
              <div className={cn("size-1.5 rounded-full", FLAG[flag].bar)} />
              <span className="text-[9px] font-semibold text-muted-foreground/50 capitalize">{flag}</span>
            </div>
          ))}
        </div>
        {hidden > 0 && (
          <span className="text-[9px] text-muted-foreground/40 font-medium">+{hidden} more</span>
        )}
      </div>
    </div>
  );
};
