"use client";

import { BaseShell } from "@/components/base-shell";
import { BaseHeader } from "@/components/base-header";
import {
  Database,
  ShieldAlert,
  BellRing,
  BrainCircuit,
  Layers,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const STAGES = [
  {
    id: "df",
    label: "Data Fetcher",
    description: "Reading chain intelligence",
    icon: Database,
  },
  {
    id: "ra",
    label: "Risk Assessor",
    description: "Evaluating volatility vectors",
    icon: ShieldAlert,
  },
  {
    id: "ag",
    label: "Alert Generator",
    description: "Synthesising critical signals",
    icon: BellRing,
  },
  {
    id: "ie",
    label: "Insight Engine",
    description: "Distilling neural patterns",
    icon: BrainCircuit,
  },
  {
    id: "agg",
    label: "Aggregator",
    description: "Finalising intelligence report",
    icon: Layers,
  },
];

export const AnalyzingInterface = () => {
  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((c) => (c < STAGES.length ? c + 1 : c));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const progress = ((activeStage + 1) / (STAGES.length + 1)) * 100;

  return (
    <BaseShell>
      <BaseHeader
        heading="Portfolio Analysis"
        text="Initialising analysis pipeline…"
      />

      {/* Main card — matches glass-morphism used in page panels */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl dark:bg-card/40 dark:border-white/8">

        {/* Subtle radial glow behind the content */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(var(--primary) / 0.35) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-[540px]">

          {/* ── LEFT: branding + progress bar ─────────────────── */}
          <div className="flex flex-col justify-between p-8 md:p-10 border-b md:border-b-0 md:border-r border-border/30 dark:border-white/8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Neural Engine v4.0
              </p>
              <h2 className="text-3xl font-black tracking-tight leading-tight text-foreground">
                Analysing
                <br />
                <span className="text-primary">Portfolio</span>
                <br />
                Vectors
              </h2>
              <p className="mt-4 text-sm text-muted-foreground/70 font-medium max-w-xs leading-relaxed">
                AI agents are scanning your holdings, assessing risk exposure, and
                generating personalised insights.
              </p>
            </div>

            {/* Progress section */}
            <div className="mt-10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  {activeStage < 0
                    ? "Initialising"
                    : activeStage < STAGES.length
                    ? STAGES[activeStage].label
                    : "Complete"}
                </span>
                <span className="text-[10px] font-mono font-bold text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              {/* Bar */}
              <div className="h-1.5 rounded-full bg-muted/40 dark:bg-white/8 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Step dots */}
              <div className="flex items-center gap-1.5 pt-1">
                {STAGES.map((s, i) => (
                  <div
                    key={s.id}
                    className={cn(
                      "h-1 rounded-full flex-1 transition-all duration-500",
                      i < activeStage
                        ? "bg-primary"
                        : i === activeStage
                        ? "bg-primary/60 animate-pulse"
                        : "bg-muted/40 dark:bg-white/10"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: stage pipeline ──────────────────────────── */}
          <div className="flex flex-col justify-center p-8 md:p-10 gap-2">
            {/* Start node */}
            <div
              className={cn(
                "flex items-center gap-3 mb-2 transition-all duration-500",
                activeStage === -1 ? "opacity-100" : "opacity-25"
              )}
            >
              <div
                className={cn(
                  "size-2 rounded-full shrink-0 transition-all",
                  activeStage === -1
                    ? "bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
                    : "bg-muted-foreground/30"
                )}
              />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Start
              </span>
            </div>

            {STAGES.map((stage, index) => {
              const StageIcon = stage.icon;
              const isActive    = index === activeStage;
              const isCompleted = index < activeStage;
              const isPending   = index > activeStage;

              return (
                <div
                  key={stage.id}
                  className={cn(
                    "relative flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-500 border",
                    isActive
                      ? "bg-primary/8 dark:bg-primary/12 border-primary/30 translate-x-0"
                      : isCompleted
                      ? "bg-muted/30 dark:bg-white/4 border-transparent opacity-50"
                      : "bg-transparent border-transparent opacity-20"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "size-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                      isActive
                        ? "bg-primary/15 dark:bg-primary/20 text-primary"
                        : isCompleted
                        ? "bg-muted/50 dark:bg-white/8 text-muted-foreground"
                        : "bg-muted/20 text-muted-foreground/30"
                    )}
                  >
                    <StageIcon className="size-4" />
                  </div>

                  {/* Labels */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-[11px] font-black uppercase tracking-wide leading-none mb-0.5",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {stage.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 font-medium truncate">
                      {stage.description}
                    </p>
                  </div>

                  {/* Status icon */}
                  <div className="shrink-0">
                    {isActive && (
                      <Loader2 className="size-4 text-primary animate-spin" />
                    )}
                    {isCompleted && (
                      <CheckCircle2 className="size-4 text-primary/60" />
                    )}
                    {isPending && (
                      <div className="size-1.5 rounded-full bg-muted-foreground/20" />
                    )}
                  </div>

                  {/* Active left accent line */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-primary" />
                  )}
                </div>
              );
            })}

            {/* End node */}
            <div
              className={cn(
                "flex items-center gap-3 mt-2 transition-all duration-500",
                activeStage === STAGES.length ? "opacity-100" : "opacity-20"
              )}
            >
              <div
                className={cn(
                  "size-2 rounded-full shrink-0 transition-all duration-700",
                  activeStage === STAGES.length
                    ? "bg-emerald-500 shadow-[0_0_10px_theme(colors.emerald.500/0.6)]"
                    : "bg-muted-foreground/20"
                )}
              />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Analysis Complete
              </span>
            </div>
            {activeStage === STAGES.length && (
              <p className="text-xs text-muted-foreground/60 font-medium mt-1 ml-5 animate-pulse">
                Summarising results, please wait a few seconds…
              </p>
            )}
          </div>
        </div>
      </div>
    </BaseShell>
  );
};
