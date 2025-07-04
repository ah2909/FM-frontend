"use client"

import { useState, useEffect } from "react"
import { Search, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortfolioChart } from "@/components/dashboard/portfolio-chart"
import { AssetTable } from "@/components/dashboard/asset-table"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { PortfolioAllocation } from "@/components/dashboard/portfolio-allocation"
import { MarketOverview } from "@/components/dashboard/market-overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { BaseHeader } from "@/components/base-header"
import { BaseShell } from "@/components/base-shell"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useGetPortfoliosByUserIDQuery, useGetBalanceDataQuery } from "@/lib/store/services/portfolio-api"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import Loading from "@/components/Loading"
import { TransactionSyncButton } from "@/components/dashboard/transaction-sync-button"

export default function DashboardPage() {
  const router = useRouter()
  const [timeframe, setTimeframe] = useState("1w")
  const dispatch = useDispatch()
  const { data, isLoading: isLoadingPortfolio } = useGetPortfoliosByUserIDQuery()
  const { data: balanceData, isLoading: isLoadingBalance } = useGetBalanceDataQuery()
  const portfolio = useSelector((state: any) => state.portfolios.portfolio)
  const tokens = useSelector((state: any) => state.portfolios.assets ?? [])
  const isLoading = isLoadingPortfolio || isLoadingBalance

  useEffect(() => {
    if (isLoadingPortfolio) return
    if (data?.data?.length === 0) router.push("/welcome")
  }, [data, isLoadingPortfolio, dispatch])

  // Calculate day change percentage
  const dayChange = balanceData?.data?.[0]?.balance
    ? (() => {
        const prev = balanceData.data[0].balance
        const curr = portfolio?.totalValue ?? 0
        return prev !== 0 ? (curr / prev) * 100 - 100 : 0
      })()
    : 0

  return (
    <ProtectedRoute>
      {isLoading ? (
        <Loading />
      ) : (
        <BaseShell>
          <BaseHeader heading="Dashboard" text="Welcome back! Here's your portfolio overview" showBackButton={false}>
            {tokens.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <TransactionSyncButton portfolio_id={portfolio.id} />
              </div>
            )}
          </BaseHeader>

          {/* Stats Cards */}
          <StatsCards
            totalValue={portfolio?.totalValue || 0}
            dayChange={dayChange}
            totalAssets={tokens.length}
            totalTransactions={42} // This would come from your API
          />

          {/* Main Content Grid */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            {/* Portfolio Chart - Takes up more space */}
            <Card className="lg:col-span-4">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="text-lg sm:text-xl">Portfolio Performance</CardTitle>
                  <Tabs defaultValue={timeframe} onValueChange={setTimeframe} className="w-full sm:w-auto">
                    <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                      <TabsTrigger value="1w" className="text-xs sm:text-sm">
                        1W
                      </TabsTrigger>
                      <TabsTrigger value="1m" className="text-xs sm:text-sm">
                        1M
                      </TabsTrigger>
                      <TabsTrigger value="1y" className="text-xs sm:text-sm">
                        1Y
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-bold">
                    ${Number(portfolio?.totalValue || 0).toLocaleString()}
                  </span>
                  {balanceData?.data?.[0]?.balance
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
                              (isUp ? "text-green-500" : isDown ? "text-red-500" : "text-gray-500")
                            }
                          >
                            {isUp && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1">
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
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1">
                                <path
                                  d="M17 10L12 15L7 10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                            {percent.toFixed(2)}%
                          </span>
                        )
                      })()
                    : null}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px] w-full">
                  <PortfolioChart timeframe={timeframe} data={balanceData?.data} />
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Allocation */}
            <div className="lg:col-span-3">
              <PortfolioAllocation tokens={tokens} totalValue={portfolio?.totalValue || 0} />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            {/* Assets Table */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <CardTitle className="text-lg sm:text-xl">Top Holdings</CardTitle>
                  <div className="flex w-full lg:w-auto gap-2">
                    <div className="relative flex-1 lg:flex-none">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search assets..."
                        className="pl-8 w-full lg:w-[240px] text-sm"
                      />
                    </div>
                    <Button variant="outline" className="flex items-center gap-1 bg-transparent text-sm px-3">
                      Filter
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AssetTable tokens={tokens} totalValue={portfolio?.totalValue} />
              </CardContent>
            </Card>

            {/* Right Column */}
            <div className="lg:col-span-3 space-y-4">
              {/* Market Overview */}
              <MarketOverview />

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentTransactions />
                </CardContent>
              </Card>
            </div>
          </div>
        </BaseShell>
      )}
    </ProtectedRoute>
  )
}
