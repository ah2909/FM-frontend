"use client";

import { useEffect, useState } from "react";
import {
  Database,
  Coins,
  Scale,
  BrainCircuit,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: "fetch", label: "Gathering Sources", icon: Database },
  { id: "token", label: "Reading Tokenomics", icon: Coins },
  { id: "weigh", label: "Weighing Bull / Bear", icon: Scale },
  { id: "synth", label: "Synthesising Outlook", icon: BrainCircuit },
];

export function ResearchLoading({ symbol }: { symbol: string }) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((c) => (c < STAGES.length - 1 ? c + 1 : c));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const progress = ((activeStage + 1) / STAGES.length) * 100;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/40 bg-card/60 p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, hsl(var(--primary) / 0.35) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
          Neural Research Engine
        </p>
        <h3 className="mt-1.5 text-xl font-black tracking-tight">
          Researching <span className="text-primary">{symbol.toUpperCase()}</span>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground/70">
          AI agents are scanning on-chain data and market signals…
        </p>

        <div className="mt-5 space-y-2">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const isActive = i === activeStage;
            const isDone = i < activeStage;
            return (
              <div
                key={stage.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-500",
                  isActive
                    ? "bg-primary/8 border-primary/30"
                    : isDone
                    ? "bg-muted/30 border-transparent opacity-60"
                    : "border-transparent opacity-30"
                )}
              >
                <div
                  className={cn(
                    "size-7 rounded-lg flex items-center justify-center shrink-0",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-muted/40 text-muted-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                </div>
                <span
                  className={cn(
                    "flex-1 text-[11px] font-black uppercase tracking-wide",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {stage.label}
                </span>
                {isActive && <Loader2 className="size-4 text-primary animate-spin" />}
                {isDone && <CheckCircle2 className="size-4 text-primary/60" />}
              </div>
            );
          })}
        </div>

        <div className="mt-5 h-1.5 rounded-full bg-muted/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
