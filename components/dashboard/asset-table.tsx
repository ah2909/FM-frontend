"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent";

export interface Token {
	id: number;
	symbol: string;
	name: string;
	price: number;
	amount: number;
	value: number;
	img_url: string;
	avg_price: number;
}

interface AssetTableProps {
  tokens: Token[]
  totalValue: number
}

export function AssetTable({ tokens, totalValue }: AssetTableProps) {
	// const { data, isLoading } = useGetPortfoliosByUserIDQuery();
	const [priceData, setPriceData] = useState<any>({});
	// Get the top 5 highest value tokens
	const top5Tokens = [...tokens].sort((a: Token, b: Token) => b.value - a.value).slice(0, 5);
  

	const stream =
		"/stream?streams=" +
		top5Tokens
			.map((token: Token) => token.symbol.toLowerCase() + "usdt@ticker")
			.join("/");

	if (top5Tokens.length > 0) {
		useWebSocketEvent("ticker", stream, (data: any) => {
			let token = top5Tokens.find(
				(token: Token) => token.symbol.toUpperCase() + "USDT" === data.s
			);
			if (token)
				setPriceData((prev: any) => ({
					...prev,
					[token.symbol]: data.c,
				}));
		});
	} else {
		useWebSocketEvent("", stream, () => {});
	}

	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-12">NO</TableHead>
						<TableHead>NAME</TableHead>
						<TableHead>PORTFOLIO (%)</TableHead>
						<TableHead>HOLDINGS</TableHead>
						<TableHead>PRICE (24H)</TableHead>
						{/* <TableHead>MARKET CAP</TableHead>
						<TableHead>LAST 24H</TableHead> */}
						<TableHead className="w-12">ACTION</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{top5Tokens.map((token: Token, index: number) => {
						const currentPrice = priceData[token.symbol] ?? token.price;
						const value = currentPrice
							? Number(currentPrice * token.amount)
							: 0;
            			const allocation = Number(value / totalValue * 100).toFixed(0);

						return (
							<TableRow key={token.id}>
								<TableCell className="font-medium">
									{index + 1}
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 rounded-full overflow-hidden">
											<img
												src={token.img_url}
												alt={token.symbol}
												className="w-full h-full object-cover"
											/>
										</div>
										<div>
											<div className="font-medium">
												{token.name}
											</div>
											<div className="text-xs text-muted-foreground">
												{token.symbol.toUpperCase()}
											</div>
										</div>
									</div>
								</TableCell>
								<TableCell>
									{/* Portfolio allocation percentage could be calculated here */}
									<div className="flex items-center gap-2">
										{!isNaN(Number(allocation)) ? (<span>{allocation}%</span>) : <Skeleton className="h-4 w-4" />}
										<div
											className="w-24 h-2 rounded-full overflow-hidden"
											style={{ backgroundColor: "hsl(var(--muted))" }}
										>
										<div
											className="h-full rounded-full"
											style={{
											width: `${!isNaN(Number(allocation)) ? allocation : 0}%`,
											backgroundColor: "hsl(var(--primary))",
											}}
										></div>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div>
										{token.amount.toFixed(4)}{" "}
										{token.symbol.toUpperCase()}
									</div>
									<div className="text-xs text-muted-foreground">
										{currentPrice ? (
											`$${value.toFixed(2)}`
										) : (
											<Skeleton className="h-4 w-16" />
										)}
									</div>
								</TableCell>
								<TableCell>
									{currentPrice ? (
										`$${Number(currentPrice).toFixed(2)}`
									) : (
										<Skeleton className="h-4 w-16" />
									)}
								</TableCell>
								<TableCell>
									<Button variant="ghost" size="icon">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
