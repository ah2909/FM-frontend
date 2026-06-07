import { Lightbulb } from "lucide-react";
import { Panel, PanelLabel } from "@/components/analyze/panel";

export function RecommendationsPanel({ recommendations }: { recommendations: string[] }) {
  return (
    <Panel className="gap-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="size-4 text-primary" />
          </div>
          <PanelLabel>Recommendations</PanelLabel>
        </div>
        <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {recommendations.length}
        </span>
      </div>
      <div className="space-y-2.5">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl border border-border/50 bg-card/50 p-3 hover:border-primary/30 hover:bg-card transition-all group"
          >
            <div className="size-5 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[9px] font-black shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {i + 1}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
              {rec}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
