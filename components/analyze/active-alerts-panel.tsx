import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertCard } from "@/components/analyze/alert-card";
import { Panel, PanelLabel } from "@/components/analyze/panel";
import type { Alert } from "@/lib/store/features/analyze-slice";

export function ActiveAlertsPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <Panel className="gap-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <AlertTriangle className="size-4 text-orange-400" />
          </div>
          <PanelLabel>Active Alerts</PanelLabel>
        </div>
        <span className={cn(
          "text-[10px] font-black px-2 py-0.5 rounded-full",
          alerts.length > 0 ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
        )}>
          {alerts.length}
        </span>
      </div>
      <div className="space-y-2.5">
        {alerts.length > 0 ? (
          alerts.map((alert, idx) => (
            <AlertCard key={`${alert.asset}-${idx}`} alert={alert} />
          ))
        ) : (
          <div className="py-10 flex flex-col items-center gap-2 text-muted-foreground/30">
            <CheckCircle2 className="size-8" />
            <p className="text-[10px] font-black uppercase tracking-widest">No active alerts</p>
          </div>
        )}
      </div>
    </Panel>
  );
}
