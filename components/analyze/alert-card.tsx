"use client";

import { cn } from "@/lib/utils";
import type { Alert, Severity } from "@/lib/store/features/analyze-slice";

interface AlertCardProps {
  alert: Alert;
}

const SEVERITY: Record<Severity, { border: string; badge: string; dot: string }> = {
  critical: {
    border: "border-l-red-500",
    badge:  "bg-red-500/10 text-red-400",
    dot:    "bg-red-500",
  },
  high: {
    border: "border-l-orange-500",
    badge:  "bg-orange-500/10 text-orange-400",
    dot:    "bg-orange-500",
  },
  medium: {
    border: "border-l-yellow-500",
    badge:  "bg-yellow-500/10 text-yellow-400",
    dot:    "bg-yellow-500",
  },
  low: {
    border: "border-l-blue-500",
    badge:  "bg-blue-500/10 text-blue-400",
    dot:    "bg-blue-500",
  },
};

export const AlertCard = ({ alert }: AlertCardProps) => {
  const cfg = SEVERITY[alert.severity] ?? SEVERITY.low;
  const typeLabel = alert.type.replace(/_/g, " ");

  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 border-l-2 bg-card/50 p-3.5 transition-colors hover:bg-card",
        cfg.border
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={cn("size-2 rounded-full shrink-0", cfg.dot)} />
          <span className="text-sm font-black uppercase tracking-wide">
            {alert.asset}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium capitalize">
            · {typeLabel}
          </span>
        </div>
        <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full", cfg.badge)}>
          {alert.severity}
        </span>
      </div>

      {/* Message */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
        {alert.message}
      </p>

      {/* Action */}
      <p className="text-[10px] font-semibold text-foreground/60">
        → {alert.action}
      </p>
    </div>
  );
};
