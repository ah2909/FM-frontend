"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PerformerItemProps {
  p: {
    symbol: string;
    pnl_pct: number;
    reason: string;
  };
  type: 'best' | 'worst';
}

export const PerformerItem = ({ p, type }: PerformerItemProps) => (
  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className={cn("size-8 rounded-xl flex items-center justify-center font-black text-xs border border-white/10", type === 'best' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
          {p?.symbol || '?'}
        </div>
        <span className="font-black text-xs tracking-tight uppercase">{p?.symbol || 'Unknown'}</span>
      </div>
      <Badge variant="outline" className={cn("text-xs font-mono font-bold px-2 py-0 h-5 border-none", type === 'best' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
        {(p?.pnl_pct ?? 0) >= 0 ? "+" : ""}{(p?.pnl_pct ?? 0).toFixed(2)}%
      </Badge>
    </div>
    <p className="text-[11px] text-muted-foreground/80 leading-relaxed font-medium italic group-hover:text-foreground/90 transition-colors">
      "{p?.reason || 'Strategic observation pending.'}"
    </p>
  </div>
);
