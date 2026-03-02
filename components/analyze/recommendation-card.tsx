"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

interface RecommendationCardProps {
  recommendations: string[];
}

export const RecommendationCard = ({ recommendations }: RecommendationCardProps) => (
  <Card className="glass-morphism border-none shadow-xl overflow-hidden">
    <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-transparent flex flex-row items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
          <Lightbulb className="size-4" />
        </div>
        <div>
          <CardTitle className="text-lg font-black tracking-tight">Strategy Recommendations</CardTitle>
          <CardDescription className="text-[10px] font-black uppercase tracking-widest opacity-60">AI-optimized portfolio adjustments</CardDescription>
        </div>
      </div>
      <Badge className="bg-primary/10 text-primary border-none font-black text-[10px]">{recommendations.length} Steps</Badge>
    </CardHeader>
    <CardContent className="pt-6">
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/40 transition-all group">
              <div className="flex-shrink-0 size-8 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs group-hover:bg-primary group-hover:text-white transition-all">
                {i + 1}
              </div>
              <p className="text-sm font-bold leading-snug group-hover:text-foreground transition-colors">{rec}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground opacity-50 space-y-3">
          <div className="p-3 rounded-full bg-white/5">
            <Lightbulb className="size-6" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest">No strategic recommendations available yet</p>
        </div>
      )}
    </CardContent>
  </Card>
);
