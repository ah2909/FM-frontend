"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ShieldAlert, ArrowRight } from "lucide-react";

export type Severity = "critical" | "high" | "medium" | "low";

export interface Alert {
  severity: Severity;
  asset: string;
  type: string;
  message: string;
  action: string;
}

interface AlertCardProps {
  alert: Alert;
}

export const AlertCard = ({ alert }: AlertCardProps) => {
  const severityColors: Record<Severity, string> = {
    critical: "bg-red-500/10 text-red-500 border-red-500/20",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <div className={cn("p-4 rounded-2xl border transition-all hover:bg-white/5 group", severityColors[alert.severity])}>
      <div className="flex items-start gap-3">
        <div className={cn("p-1.5 rounded-lg", severityColors[alert.severity])}>
          <ShieldAlert className="size-4" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider">{alert.asset} • {alert.type.replace('_', ' ')}</span>
            <Badge variant="outline" className={cn("text-[8px] font-black uppercase px-2 py-0 border-none", severityColors[alert.severity])}>
              {alert.severity}
            </Badge>
          </div>
          <p className="text-sm font-bold leading-tight line-clamp-2">{alert.message}</p>
          <div className="pt-2 flex items-center gap-2 group/action cursor-pointer">
            <span className="text-[10px] uppercase font-black tracking-widest opacity-70 group-hover/action:opacity-100 transition-opacity">Take Action: {alert.action}</span>
            <ArrowRight className="size-3 transition-transform group-hover/action:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
