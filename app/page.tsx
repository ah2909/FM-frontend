"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { AssetTable } from "@/components/dashboard/asset-table";
import { PortfolioAllocation } from "@/components/dashboard/portfolio-allocation";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
	useGetPortfoliosByUserIDQuery,
	useGetBalanceDataQuery,
} from "@/lib/store/services/portfolio-api";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { TransactionSyncButton } from "@/components/dashboard/transaction-sync-button";

export default function DashboardPage() {
	const router = useRouter();
	const [timeframe, setTimeframe] = useState("1w");
	const dispatch = useDispatch();
	const { data, isLoading: isLoadingPortfolio } = useGetPortfoliosByUserIDQuery();
	const { data: balanceData, isLoading: isLoadingBalance } = useGetBalanceDataQuery();
	const portfolio = useSelector((state: any) => state.portfolios.portfolio);
	const tokens = useSelector((state: any) => state.portfolios.assets ?? []);
	const isLoading = isLoadingPortfolio || isLoadingBalance;
	// Check if we have any data
	const hasPortfolioData = portfolio && Object.keys(portfolio).length > 0;
	const hasTokens = tokens && tokens.length > 0;
	const hasBalanceData = balanceData?.data && balanceData.data.length > 0;

	useEffect(() => {
		if (isLoadingPortfolio) return;
		if (data?.data?.length === 0) router.push("/welcome");
	}, [data, isLoadingPortfolio, dispatch]);

	return (
		<ProtectedRoute>
      <BaseShell>
        <BaseHeader
          heading="Dashboard"
          text="Welcome back! Here's your portfolio overview"
        >
          {hasTokens && (
            <div className="flex items-center justify-between mb-4">
              <TransactionSyncButton
                portfolio_id={portfolio?.id}
              />
            </div>
          )}
        </BaseHeader>

        {/* Main Content Grid */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          {/* Portfolio Chart - Takes up more space */}
          <Card className="lg:col-span-4">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-lg sm:text-xl">
                  Portfolio Performance
                </CardTitle>
                <Tabs
                  defaultValue={timeframe}
                  onValueChange={setTimeframe}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                    <TabsTrigger
                      value="1w"
                      className="text-xs sm:text-sm"
                    >
                      1W
                    </TabsTrigger>
                    <TabsTrigger
                      value="1m"
                      className="text-xs sm:text-sm"
                    >
                      1M
                    </TabsTrigger>
                    <TabsTrigger
                      value="1y"
                      className="text-xs sm:text-sm"
                    >
                      1Y
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {hasPortfolioData && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-bold">
                    ${Number(portfolio?.totalValue || 0).toLocaleString()}
                  </span>
                  {hasBalanceData &&
                  balanceData?.data?.[0]?.balance
                    ? (() => {
                        const prev = balanceData.data[0].balance
                        const curr = portfolio?.totalValue ?? 0
                        const percent = prev !== 0 ? (curr / prev) * 100 - 100 : 0
                        const isUp = percent > 0
                        const isDown = percent < 0
                        return (
                          <span
                            className={
                              "text-sm font-medium flex items-center " +
                              (isUp
                                ? "text-green-500"
                                : isDown
                                ? "text-red-500"
                                : "text-gray-500")
                            }
                          >
                            {isUp && (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="mr-1"
                              >
                                <path
                                  d="M7 14L12 9L17 14"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                            {isDown && (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="mr-1"
                              >
                                <path
                                  d="M17 10L12 15L7 10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                            {percent.toFixed(2)}
                            %
                          </span>
                        );
                      })()
                    : null}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] w-full">
                <PortfolioChart
                  timeframe={timeframe}
                  data={balanceData?.data}
                  isLoading={isLoadingBalance}
                />
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Allocation */}
          <div className="lg:col-span-3">
            <PortfolioAllocation
              tokens={tokens}
              totalValue={portfolio?.totalValue || 0}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          {/* Assets Table */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <CardTitle className="text-lg sm:text-xl">
                  Top Holdings
                </CardTitle>
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

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-4">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </div>
      </BaseShell>	
		</ProtectedRoute>
	);
}
