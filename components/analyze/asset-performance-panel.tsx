import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PerformerItem } from "@/components/analyze/performer-item";
import { Panel, PanelLabel } from "@/components/analyze/panel";
import type { Performer } from "@/lib/store/features/analyze-slice";

function PerformersSection({
  performers,
  type,
  className,
}: {
  performers: Performer[];
  type: "best" | "worst";
  className?: string;
}) {
  const isBest = type === "best";
  const Icon = isBest ? TrendingUp : TrendingDown;
  return (
    <div className={className}>
      <div className={cn("flex items-center gap-1.5 mb-1", isBest && "bg-emerald-500/5 p-1 rounded-lg")}>
        <Icon className={cn("size-3", isBest ? "text-emerald-400" : "text-red-400")} />
        <span className={cn("text-[9px] font-black uppercase tracking-widest", isBest ? "text-emerald-400/70" : "text-red-400/70")}>
          {isBest ? "Top Performers" : "Underperformers"}
        </span>
      </div>
      <div>
        {performers.length > 0 ? (
          performers.map((p) => <PerformerItem key={p.symbol} p={p} type={type} />)
        ) : (
          <p className="text-[10px] text-muted-foreground/40 py-2 px-1">No data</p>
        )}
      </div>
    </div>
  );
}

export function AssetPerformancePanel({
  best,
  worst,
}: {
  best: Performer[];
  worst: Performer[];
}) {
  return (
    <Panel className="gap-0">
      <PanelLabel>Asset Performance</PanelLabel>
      <PerformersSection performers={best} type="best" className="mb-1" />
      <div className="my-2 border-t border-border/40" />
      <PerformersSection performers={worst} type="worst" />
    </Panel>
  );
}
