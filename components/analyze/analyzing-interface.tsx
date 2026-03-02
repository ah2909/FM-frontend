"use client";

import { BaseShell } from "@/components/base-shell";
import { 
  Database, 
  ShieldAlert, 
  BellRing, 
  BrainCircuit, 
  Layers, 
  CheckCircle2,
  Loader2,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const STAGES = [
  { id: "df", label: "Data Fetcher", description: "Reading chain intelligence", icon: Database },
  { id: "ra", label: "Risk Assessor", description: "Evaluating volatility vectors", icon: ShieldAlert },
  { id: "ag", label: "Alert Generator", description: "Synthesizing critical signals", icon: BellRing },
  { id: "ie", label: "Insight Engine", description: "Distilling neural patterns", icon: BrainCircuit },
  { id: "agg", label: "Aggregator", description: "Finalizing intelligence report", icon: Layers },
];

export const AnalyzingInterface = () => {
  const [activeStage, setActiveStage] = useState(-1); // -1 for Start

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((current) => (current < STAGES.length ? current + 1 : current));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <BaseShell>
      <div className="relative min-h-[650px] w-full flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-border/40 bg-background px-6">
        {/* Subtle Grain Overlay - adapted for light/dark */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-multiply dark:blend-screen" />
        
        {/* Minimalist Background Aura - dynamic colors */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
          {/* Main Visual Core */}
          <div className="mb-12 relative">
            <div className="size-16 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Cpu className="size-6 text-primary animate-pulse opacity-70" />
            </div>
            {/* Pulsing ring */}
            <div className="absolute -inset-4 border border-primary/20 rounded-3xl animate-[ping_3s_linear_infinite] opacity-30" />
          </div>

          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl font-light tracking-tight text-foreground/90">
              Analyzing <span className="text-primary font-normal">Portfolio Vectors</span>
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-[0.3em]">
                Neural Engine v4.0.12
              </span>
              <div className="size-1 rounded-full bg-primary/60 animate-pulse" />
            </div>
          </div>

          {/* Elegant DAG Flow */}
          <div className="w-full space-y-5">
            {/* Start Node */}
            <div className={cn(
              "flex items-center gap-4 transition-all duration-700",
              activeStage === -1 ? "opacity-100" : "opacity-30"
            )}>
              <div className="size-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/60">Start</span>
            </div>

            {STAGES.map((stage, index) => {
              const isActive = index === activeStage;
              const isCompleted = index < activeStage;
              
              return (
                <div 
                  key={stage.id}
                  className={cn(
                    "group flex items-center gap-4 pl-0.5 border-l transition-all duration-700 h-10",
                    isActive 
                      ? "border-primary/50 opacity-100 translate-x-1" 
                      : isCompleted 
                        ? "border-border opacity-40" 
                        : "border-border/30 opacity-20"
                  )}
                >
                  <div className={cn(
                    "ml-4 flex flex-col transition-all duration-500",
                    isActive ? "translate-x-0" : "-translate-x-1"
                  )}>
                    <span className={cn(
                      "text-[11px] font-medium transition-colors",
                      isActive ? "text-foreground" : "text-foreground/60"
                    )}>
                      {stage.label}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-light">
                      {stage.description}
                    </span>
                  </div>
                  
                  {isActive && (
                    <div className="ml-auto flex items-center gap-2 pr-2">
                      <Loader2 className="size-3 text-primary animate-spin" />
                    </div>
                  )}
                  {isCompleted && (
                    <div className="ml-auto pr-2">
                      <CheckCircle2 className="size-3 text-primary/60" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* End Node */}
            <div className={cn(
              "flex items-center gap-4 transition-all duration-700 pt-2",
              activeStage === STAGES.length ? "opacity-100" : "opacity-20"
            )}>
              <div className={cn(
                "size-2 rounded-full transition-all duration-1000",
                activeStage === STAGES.length ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-muted"
              )} />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/60">End Analysis</span>
            </div>
          </div>
        </div>

        {/* Minimal Progress Bar at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-border/30">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-out" 
            style={{ width: `${((activeStage + 1) / (STAGES.length + 1)) * 100}%` }} 
          />
        </div>
      </div>
    </BaseShell>
  );
};

