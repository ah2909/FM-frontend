"use client";

import { useState, useEffect } from "react";
import { Search, Plus, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { AssetTable } from "@/components/dashboard/asset-table";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useGetPortfoliosByUserIDQuery } from "@/lib/store/services/portfolio-api";
import { useDispatch, useSelector } from "react-redux";
import { setPortfolio, setAssets, setTransactions } from "@/lib/store/features/portfolios-slice";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function DashboardPage() {
	const router = useRouter();
	const [timeframe, setTimeframe] = useState("1w");
	const dispatch = useDispatch();
	const { data, isLoading } = useGetPortfoliosByUserIDQuery();

	const portfolio = useSelector((state: any) => state.portfolios.portfolio);
	const tokens = useSelector((state: any) => state.portfolios.assets);

	useEffect(() => {
		if (isLoading) return;
		if (data?.data?.length === 0) router.push("/welcome");

		dispatch(setPortfolio(data?.data));
		dispatch(setAssets(data?.data?.assets));
		dispatch(setTransactions(data?.data?.transactions));
	}, [data, isLoading, dispatch]);

	return (
		<ProtectedRoute>
			{isLoading ? (
				<Loading />
			) : (
				<BaseShell>
					<BaseHeader
						heading="Dashboard"
						text="View your portfolio performance and manage your assets"
						showBackButton={false}
					>
						<div className="flex items-center justify-between mb-4">
							<Button
								style={{
									backgroundColor: "hsl(var(--primary))",
									color: "hsl(var(--primary-foreground))",
								}}
							>
								<Plus className="mr-2 h-4 w-4" /> Create
								transaction
							</Button>
						</div>
					</BaseHeader>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle>Portfolio Balance</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
								<div className="flex items-center gap-2">
									<span className="text-3xl font-bold">
										{Number(portfolio?.totalValue).toFixed(
											2
										)}
									</span>
									<span className="text-sm font-medium text-green-500 flex items-center">
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
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
										1.8%
									</span>
								</div>
								<Tabs
									defaultValue={timeframe}
									onValueChange={setTimeframe}
									className="w-full md:w-auto"
								>
									<TabsList className="grid grid-cols-6 w-full md:w-auto">
										<TabsTrigger value="1h">1H</TabsTrigger>
										<TabsTrigger value="1d">1D</TabsTrigger>
										<TabsTrigger value="1w">1W</TabsTrigger>
										<TabsTrigger value="1m">1M</TabsTrigger>
										<TabsTrigger value="1y">1Y</TabsTrigger>
										<TabsTrigger value="all">
											ALL
										</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>
							<div className="h-[300px] w-full">
								<PortfolioChart timeframe={timeframe} />
							</div>
						</CardContent>
					</Card>

					<div className="rounded-lg shadow">
						<div className="p-6">
							<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
								<h2 className="text-xl font-bold">My Assets</h2>
								<div className="flex w-full md:w-auto gap-2 mt-2 md:mt-0">
									<div className="relative w-full md:w-auto">
										<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type="search"
											placeholder="Search assets..."
											className="pl-8 w-full md:w-[240px]"
										/>
									</div>
									<Button
										variant="outline"
										className="flex items-center gap-1"
									>
										Filter
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							</div>
							<AssetTable
								tokens={tokens}
								totalValue={portfolio?.totalValue}
							/>
						</div>
					</div>
				</BaseShell>
			)}
		</ProtectedRoute>
	);
}
