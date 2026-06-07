import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel, PanelLabel } from "@/components/analyze/panel";
import { fmt } from "@/components/analyze/utils";
import type { PnlAnalysis } from "@/lib/store/features/analyze-slice";

export function UnrealizedPnlPanel({ pnl }: { pnl: PnlAnalysis }) {
  const pnlUp = pnl.unrealized_pnl >= 0;
  return (
    <Panel className="justify-between">
      <PanelLabel>Unrealized P&L</PanelLabel>
      <div className="flex-1 flex flex-col justify-center">
        <p className={cn("text-4xl font-black tracking-tight font-mono", pnlUp ? "text-emerald-400" : "text-red-400")}>
          {pnlUp ? "+" : "-"}${fmt(pnl.unrealized_pnl)}
        </p>
        <div className={cn("flex items-center gap-1 mt-1.5", pnlUp ? "text-emerald-400" : "text-red-400")}>
          {pnlUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
          <span className="text-sm font-bold font-mono">
            {pnlUp ? "+" : ""}{pnl.unrealized_pnl_pct.toFixed(2)}%
          </span>
          <span className="text-xs text-muted-foreground font-medium">since deposit</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border/40">
        {pnlUp
          ? <TrendingUp  className="size-3 text-emerald-500" />
          : <TrendingDown className="size-3 text-red-500" />
        }
        <span className="text-[10px] text-muted-foreground font-medium">
          {pnlUp ? "Portfolio performing above cost" : "Portfolio below cost basis"}
        </span>
      </div>
    </Panel>
  );
}
