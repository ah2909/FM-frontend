"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import {
  useGetPortfoliosByUserIDQuery,
  useGetBalanceDataQuery,
} from "@/lib/store/services/portfolio-api";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { TransactionSyncButton } from "@/components/dashboard/transaction-sync-button";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy-load heavy chart components so they don't block initial render
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
          <Skeleton key={i} className="h-10 w-full rounded-md" />
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
const RecentActivity = dynamic(
  () => import("@/components/dashboard/recent-activity"),
  {
    loading: () => (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    ),
    ssr: false,
  }
);

// ── Derived gain/loss badge ──────────────────────────────────────────────────
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

// ── Card skeletons for first-load ────────────────────────────────────────────
function PortfolioValueSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-9 w-36 rounded-md" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState("1w");
  const [typeFilter, setTypeFilter] = useState<string>("all");
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

  const mobileMenuItems = hasTokens && isMobile
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
          <div className="flex items-center justify-between mb-4">
            <TransactionSyncButton portfolio_id={portfolio?.id} />
          </div>
        )}
      </BaseHeader>

      {/* Balanced 2-Row Grid for Desktop */}
      <div className="space-y-6">
        {/* Row 1: Performance + Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7">
            <Card className="h-full card-hover flex flex-col border-none glass overflow-hidden shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">Portfolio Performance</CardTitle>
                  <Tabs
                    defaultValue={timeframe}
                    onValueChange={setTimeframe}
                    className="w-full sm:w-auto"
                  >
                    <TabsList className="grid grid-cols-3 w-full sm:w-auto p-1 bg-muted/50 rounded-lg">
                      {(["1w", "1m", "1y"] as const).map((tf) => (
                        <TabsTrigger key={tf} value={tf} className="text-xs sm:text-sm uppercase font-bold tracking-wider data-[state=active]:bg-background data-[state=active]:shadow-sm">
                          {tf}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                {/* Portfolio value + gain badge */}
                {isLoading ? (
                  <PortfolioValueSkeleton />
                ) : hasPortfolioData ? (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-3xl sm:text-4xl font-black tracking-tighter leading-none">
                      ${Number(portfolio?.totalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {hasBalanceData && balanceData?.data?.[0]?.balance && (
                      <GainLossBadge
                        prev={balanceData.data[0].balance}
                        curr={portfolio?.totalValue ?? 0}
                      />
                    )}
                  </div>
                ) : null}
              </CardHeader>
              <CardContent className="flex-1 pt-4 pb-6">
                <div className="h-full min-h-[280px] w-full">
                  <PortfolioChart
                    timeframe={timeframe}
                    data={balanceData?.data}
                    isLoading={isLoadingBalance}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <PortfolioAllocation
              tokens={tokens}
              totalValue={portfolio?.totalValue || 0}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Row 2: Holdings + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7">
            <Card className="h-full card-hover border-none glass shadow-sm overflow-hidden flex flex-col pt-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">Top Holdings</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <AssetTable
                  tokens={tokens}
                  totalValue={portfolio?.totalValue || 0}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card className="h-full card-hover border-none glass shadow-sm overflow-hidden flex flex-col pt-2">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">Recent Activity</CardTitle>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-28 text-[10px] font-bold uppercase tracking-widest bg-muted/40 border-none h-8">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent className="glass border-none">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Add asset">Add</SelectItem>
                      <SelectItem value="Remove asset">Remove</SelectItem>
                      <SelectItem value="Sync asset transactions">Sync</SelectItem>
                      <SelectItem value="Update asset">Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="flex-1 max-h-[500px] overflow-auto scrollbar-hide py-0">
                <RecentActivity typeFilter={typeFilter} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BaseShell>
  );
}
