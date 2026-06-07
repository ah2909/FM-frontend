import { Activity } from "lucide-react";
import { Panel, PanelLabel } from "@/components/analyze/panel";
import { fmt } from "@/components/analyze/utils";
import type { PnlAnalysis } from "@/lib/store/features/analyze-slice";

export function TotalValuePanel({
  pnl,
  marketTrend,
}: {
  pnl: PnlAnalysis;
  marketTrend: string;
}) {
  return (
    <Panel className="justify-between">
      <PanelLabel>Total Value</PanelLabel>
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-4xl font-black tracking-tight font-mono">
          ${fmt(pnl.total_current_value)}
        </p>
        <p className="text-xs text-muted-foreground mt-1.5 font-medium">
          Invested: <span className="text-foreground font-bold">${fmt(pnl.total_invested, 0)}</span>
        </p>
      </div>
      <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border/40">
        <Activity className="size-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          {marketTrend.replace(/_/g, " ")}
        </span>
      </div>
    </Panel>
  );
}
