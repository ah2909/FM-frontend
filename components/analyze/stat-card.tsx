"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  colorClass?: string;
}

export const StatCard = ({ title, value, subValue, icon: Icon, trend, colorClass }: StatCardProps) => (
  <Card className="glass border-none shadow-sm card-hover overflow-hidden relative group">
    <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 rounded-full transition-transform group-hover:scale-110", colorClass)} />
    <CardHeader className="pb-2 flex flex-row items-center justify-between relative z-10">
      <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{title}</CardTitle>
      <div className={cn("p-1.5 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors", 
        trend === 'up' ? "bg-green-500/10" : trend === 'down' ? "bg-red-500/10" : "bg-primary/10"
      )}>
        <Icon className={cn("size-4", trend === 'up' ? "text-green-500" : trend === 'down' ? "text-red-500" : "text-primary")} />
      </div>
    </CardHeader>
    <CardContent className="relative z-10 pt-1">
      <div className="text-2xl font-black tracking-tight font-mono">{value}</div>
      {subValue && (
        <div className={cn("text-[10px] font-bold mt-1 flex items-center gap-1", trend === 'up' ? "text-green-500" : trend === 'down' ? "text-red-500" : "text-muted-foreground/60")}>
          {trend === 'up' && <ChevronUp className="size-3" />}
          {trend === 'down' && <ChevronDown className="size-3" />}
          {subValue}
        </div>
      )}
    </CardContent>
  </Card>
);
