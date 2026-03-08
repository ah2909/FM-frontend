"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import {
  useGetPortfoliosByUserIDQuery,
  useGetBalanceDataQuery,
} from "@/lib/store/services/portfolio-api";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { TransactionSyncButton } from "@/components/dashboard/transaction-sync-button";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const PortfolioChart = dynamic(
  () => import("@/components/dashboard/portfolio-chart").then((m) => m.PortfolioChart),
  {
    loading: () => <Skeleton className="h-full w-full rounded-lg" />,
    ssr: false,
  }
);
const AssetTable = dynamic(
  () => import("@/components/dashboard/asset-table").then((m) => m.AssetTable),
  {
    loading: () => (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    ),
    ssr: false,
  }
);
const PortfolioAllocation = dynamic(
  () =>
    import("@/components/dashboard/portfolio-allocation").then((m) => m.PortfolioAllocation),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-lg" />,
    ssr: false,
  }
);

// ── Gain/loss badge ───────────────────────────────────────────────────────────
function GainLossBadge({ prev, curr }: { prev: number; curr: number }) {
  const percent = prev !== 0 ? (curr / prev) * 100 - 100 : 0;
  const isUp = percent > 0;
  const isDown = percent < 0;
  if (!isUp && !isDown) return null;
  return (
    <span className={isUp ? "badge-gain" : "badge-loss"}>
      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {isUp ? "+" : ""}
      {percent.toFixed(2)}%
    </span>
  );
}

function PortfolioValueSkeleton() {
  return (
    <div className="flex items-center gap-3 mt-1.5">
      <Skeleton className="h-9 w-36 rounded-md" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState("1w");
  const dispatch = useDispatch();
  const { data, isLoading: isLoadingPortfolio } = useGetPortfoliosByUserIDQuery();
  const { data: balanceData, isLoading: isLoadingBalance } = useGetBalanceDataQuery();
  const portfolio = useSelector((state: any) => state.portfolios.portfolio);
  const tokens = useSelector((state: any) => state.portfolios.assets ?? []);
  const isLoading = isLoadingPortfolio || isLoadingBalance;
  const isMobile = useIsMobile();

  const hasPortfolioData = portfolio && Object.keys(portfolio).length > 0;
  const hasTokens = tokens && tokens.length > 0;
  const hasBalanceData = balanceData?.data && balanceData.data.length > 0;

  useEffect(() => {
    if (isLoadingPortfolio) return;
    if (data?.data?.length === 0) router.push("/welcome");
  }, [data, isLoadingPortfolio, dispatch]);

  const mobileMenuItems =
    hasTokens && isMobile
      ? [{ label: "Import Data", component: <TransactionSyncButton portfolio_id={portfolio?.id} /> }]
      : [];

  return (
    <BaseShell>
      <BaseHeader
        heading="Dashboard"
        text="Welcome back! Here's your portfolio overview"
        mobileMenuItems={mobileMenuItems}
      >
        {hasTokens && !isMobile && (
          <TransactionSyncButton portfolio_id={portfolio?.id} />
        )}
      </BaseHeader>

      <div className="space-y-6">
        {/* Row 1: Performance chart (wider) + Allocation donut */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Performance chart — col-8 on desktop */}
          <div className="lg:col-span-8">
            <Card className="h-full card-hover flex flex-col border-none glass overflow-hidden shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">
                      Portfolio Performance
                    </CardTitle>
                    {isLoading ? (
                      <PortfolioValueSkeleton />
                    ) : hasPortfolioData ? (
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-3xl sm:text-4xl font-black tracking-tighter leading-none">
                          $
                          {Number(portfolio?.totalValue || 0).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        {hasBalanceData && balanceData?.data?.[0]?.balance && (
                          <GainLossBadge
                            prev={balanceData.data[0].balance}
                            curr={portfolio?.totalValue ?? 0}
                          />
                        )}
                      </div>
                    ) : null}
                  </div>

                  <Tabs
                    defaultValue={timeframe}
                    onValueChange={setTimeframe}
                    className="w-full sm:w-auto flex-shrink-0"
                  >
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

              <CardContent className="flex-1 pt-4 pb-6">
                <div className="h-full min-h-[260px] sm:min-h-[320px] w-full">
                  <PortfolioChart
                    timeframe={timeframe}
                    data={balanceData?.data}
                    isLoading={isLoadingBalance}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Allocation donut — col-4 on desktop */}
          <div className="lg:col-span-4">
            <PortfolioAllocation
              tokens={tokens}
              totalValue={portfolio?.totalValue || 0}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Row 2: Top Holdings — full width */}
        <Card className="card-hover border-none glass shadow-sm overflow-hidden pt-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">
                  Top Holdings
                </CardTitle>
                {hasTokens && (
                  <CardDescription className="mt-0.5">
                    Showing top {Math.min(tokens.length, 5)} of {tokens.length}{" "}
                    {tokens.length === 1 ? "asset" : "assets"}
                  </CardDescription>
                )}
              </div>
              {hasTokens && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="flex-shrink-0 text-xs text-muted-foreground gap-1.5 hover:text-foreground"
                >
                  <Link href="/portfolios">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <AssetTable
              tokens={tokens}
              totalValue={portfolio?.totalValue || 0}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </BaseShell>
  );
}
