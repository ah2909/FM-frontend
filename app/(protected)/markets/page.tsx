"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";

const PerformanceChart = dynamic(
  () => import("@/components/markets/performance-chart").then((m) => m.PerformanceChart),
  {
    loading: () => <Skeleton className="h-full w-full rounded-lg" />,
    ssr: false,
  }
);

export default function MarketsPage() {
  const [range, setRange] = useState("1m");

  return (
    <BaseShell>
      <BaseHeader heading="Markets" text="Cross-asset performance comparison" />

      <div className="space-y-6">
        <Card className="card-hover border-none glass shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">
                  Performance Comparison
                </CardTitle>
                <CardDescription>
                  Indexed to 100 at the start of the period
                </CardDescription>
              </div>
              <Tabs value={range} onValueChange={setRange} className="w-full sm:w-auto flex-shrink-0">
                <TabsList className="grid grid-cols-3 w-full sm:w-auto p-1 bg-muted/50 rounded-lg">
                  {(["1w", "1m", "1y"] as const).map((tf) => (
                    <TabsTrigger
                      key={tf}
                      value={tf}
                      className="text-xs sm:text-sm uppercase font-bold tracking-wider data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      {tf}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-6">
            <div className="h-[320px] sm:h-[380px] w-full">
              <PerformanceChart range={range} />
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseShell>
  );
}
