import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RiskScoreGauge } from "@/components/analyze/risk-score-gauge";
import { Panel, PanelLabel } from "@/components/analyze/panel";
import type { RiskAssessment } from "@/lib/store/features/analyze-slice";

const VOL_COLORS: Record<string, string> = {
  low:     "bg-emerald-500/10 text-emerald-400",
  medium:  "bg-yellow-500/10 text-yellow-400",
  high:    "bg-orange-500/10 text-orange-400",
  extreme: "bg-red-500/10 text-red-400",
};

export function RiskProfilePanel({ risk }: { risk: RiskAssessment }) {
  const vol = risk.volatility_risk;
  return (
    <Panel className="items-center text-center gap-2">
      <PanelLabel>Risk Profile</PanelLabel>
      <RiskScoreGauge score={risk.risk_score} />
      <div className="mt-2 flex flex-col items-center gap-1.5">
        <Badge
          variant="outline"
          className={cn(
            "text-[9px] font-bold border-none px-2.5",
            VOL_COLORS[vol.overall_volatility] ?? "bg-muted text-muted-foreground"
          )}
        >
          Volatility: {vol.overall_volatility}
        </Badge>
        {(vol.assets_overbought.length > 0 || vol.assets_oversold.length > 0) && (
          <div className="flex flex-wrap justify-center gap-1">
            {vol.assets_overbought.map((s) => (
              <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">{s}↑</span>
            ))}
            {vol.assets_oversold.map((s) => (
              <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">{s}↓</span>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
