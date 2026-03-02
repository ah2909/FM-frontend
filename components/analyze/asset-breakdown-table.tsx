"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Activity, Info } from "lucide-react";

interface AssetBreakdownTableProps {
  pnlAnalysis: any;
  volatilityRisk: any;
}

export const AssetBreakdownTable = ({ pnlAnalysis, volatilityRisk }: AssetBreakdownTableProps) => (
  <Card className="glass-morphism border-none shadow-xl overflow-hidden">
    <CardHeader className="bg-white/5 border-b border-white/5 py-4">
      <CardTitle className="text-sm font-black uppercase tracking-[0.2em]">Asset PnL Breakdown</CardTitle>
    </CardHeader>
    <div className="h-[400px]">
      <ScrollArea className="h-full">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-20 border-b border-white/5">
            <tr className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">Cost Basis</th>
              <th className="px-6 py-4 text-right">Current</th>
              <th className="px-6 py-4 text-right">PnL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pnlAnalysis?.per_asset?.length > 0 ? (
              pnlAnalysis.per_asset.map((asset: any) => (
                <tr key={asset?.symbol || Math.random()} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-sm">{asset?.symbol || 'Unknown'}</span>
                      <div className="flex gap-1 mt-1">
                        {volatilityRisk?.assets_overbought?.includes(asset?.symbol) && (
                          <Badge className="text-[8px] bg-red-500/10 text-red-500 border-none font-black py-0 h-3">OVERBOUGHT</Badge>
                        )}
                        {volatilityRisk?.assets_oversold?.includes(asset?.symbol) && (
                          <Badge className="text-[8px] bg-blue-500/10 text-blue-500 border-none font-black py-0 h-3">OVERSOLD</Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-muted-foreground">
                    ${(asset?.invested ?? 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-sm font-black">${(asset?.current ?? 0).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={cn("font-mono text-xs font-black", (asset?.pnl ?? 0) >= 0 ? "text-green-500" : "text-red-500")}>
                      {(asset?.pnl ?? 0) >= 0 ? "+" : ""}{(asset?.pnl ?? 0).toLocaleString()}
                    </div>
                    <div className={cn("text-[10px] font-bold", (asset?.pnl_pct ?? 0) >= 0 ? "text-green-500/70" : "text-red-500/70")}>
                      {(asset?.pnl_pct ?? 0) >= 0 ? "+" : ""}{(asset?.pnl_pct ?? 0).toFixed(2)}%
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground opacity-30">
                    <Activity className="size-10" />
                    <p className="text-xs font-black uppercase tracking-widest">Error in analyzing progress</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  </Card>
);
