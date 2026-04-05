"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PerformerItemProps {
  p: {
    symbol: string;
    pnl_pct: number;
    reason: string;
  };
  type: "best" | "worst";
}

export const PerformerItem = ({ p, type }: PerformerItemProps) => {
  const isPositive = p.pnl_pct >= 0;
  const isGreen = type === "best";

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0 group">
      {/* Symbol */}
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "size-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0",
            isGreen
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          )}
        >
          {p.symbol.slice(0, 3)}
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide leading-none">{p.symbol}</p>
          <p className="text-[10px] text-muted-foreground/60 font-medium mt-0.5 line-clamp-1 max-w-[120px]">
            {p.reason}
          </p>
        </div>
      </div>

      {/* PnL */}
      <div className={cn("flex items-center gap-1 shrink-0", isPositive ? "text-emerald-400" : "text-red-400")}>
        {isPositive
          ? <TrendingUp className="size-3" />
          : <TrendingDown className="size-3" />
        }
        <span className="text-xs font-black font-mono">
          {isPositive ? "+" : ""}{p.pnl_pct.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};
