"use client";

import { Suspense } from "react";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { TransactionList } from "@/components/transaction/transaction-list";
import { useSelector, useDispatch } from "react-redux";
import { useGetPortfoliosByUserIDQuery } from "@/lib/store/services/portfolio-api";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import {
	ChevronLeft,
	Calculator,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionHistoryWarning } from "@/components/transaction/transaction-history-warning";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function TransactionsContent() {
	const params = useSearchParams();
	const token_id = params.get("id") || "";
	const dispatch = useDispatch();
	const { data, isLoading } = useGetPortfoliosByUserIDQuery();
	const tokens = useSelector((state: any) => state.portfolios.assets);
	const selectedToken = tokens.find(
		(token: any) => token.id === parseInt(token_id)
	);
	const router = useRouter();
	const [unrealizedPnL, setUnrealizedPnL] = useState(0);

	useEffect(() => {
		if (isLoading) return;
		if (data?.data?.length === 0) router.push("/welcome");
		setUnrealizedPnL(selectedToken ? Number((selectedToken.value - selectedToken.avg_price * selectedToken.amount).toFixed(2)) : 0);
	}, [data, isLoading, dispatch]);

	const mobileMenuItems = [
		{
			label: "Back",
			icon: <ChevronLeft className="h-4 w-4" />,
			onClick: () => router.back(),
		},
	];

	return (
		<BaseShell>
			<BaseHeader
				heading="Transactions"
				text="Manage your crypto transactions"
				mobileMenuItems={mobileMenuItems}
			>
				<Button
					variant="outline"
					size="sm"
					onClick={() => router.back()}
					className="flex items-center gap-2"
				>
					<ChevronLeft className="h-4 w-4" />
					<span>Back</span>
				</Button>
			</BaseHeader>
			<TransactionHistoryWarning className="mb-6" />
			{isLoading ? (
				<Loading />
			) : !selectedToken ? (
				<div className="text-center text-muted-foreground">
					Please select a token to view transactions.
				</div>
			) : selectedToken?.transactions?.length === 0 ? (
				<div className="text-center text-muted-foreground">
					No transactions found for {selectedToken.name}.
				</div>
			) : (
				<>
					<Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
						<CardContent className="p-4">
							<div className="flex flex-row items-center justify-between gap-4">
								{/* Left side - Asset info and average price */}
								<div className="flex items-center space-x-4">
									<div className="relative">
										<Avatar className="h-12 w-12 ring-4 ring-blue-100 dark:ring-blue-900 shadow-lg">
											<AvatarImage
												src={
													selectedToken.img_url ||
													"/placeholder.svg"
												}
												alt={selectedToken.symbol}
											/>
											<AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
												{selectedToken.symbol
													.slice(0, 2)
													.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5">
											<Calculator className="h-4 w-4 text-white" />
										</div>
									</div>
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<h3 className="text-lg sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
												{selectedToken.name}
											</h3>
											<Badge
												variant="secondary"
												className="text-xs"
											>
												{selectedToken.symbol.toUpperCase()}
											</Badge>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
											<span>Average Buy Price</span>
										</div>
										<div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
											$
											{selectedToken.avg_price.toFixed(2)}
										</div>
									</div>
								</div>
								{/* P&L Indicator */}
								<div className="text-center sm:text-right">
									<div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
										Unrealized P&L
									</div>
									<div
										className={`flex items-center justify-center sm:justify-end gap-2 text-xl lg:text-2xl font-semibold ${
											unrealizedPnL > 0
												? "text-emerald-600 dark:text-emerald-400"
												: "text-red-600 dark:text-red-400"
										}`}
									>
										{unrealizedPnL !== 0 ? (
											<>
												{unrealizedPnL > 0 ? (
													<TrendingUp className="h-6 w-6" />
												) : (
													<TrendingDown className="h-6 w-6" />
												)}
												${unrealizedPnL.toFixed(2)}
											</>
										) : (
											<span className="text-lg">--</span>
										)}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
					{/* Transaction List */}
					<TransactionList selectedToken={selectedToken} />
				</>
			)}
		</BaseShell>
	);
}

export default function TransactionsPage() {
	return (
		<Suspense fallback={<Loading />}>
			<TransactionsContent />
		</Suspense>
	);
}
