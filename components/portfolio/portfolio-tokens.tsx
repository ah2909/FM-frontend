"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import {
	useRemoveTokenFromPortfolioMutation,
} from "@/lib/store/services/portfolio-api";
import { useDispatch } from "react-redux";
import { setTotalUnrealizedPNL } from "@/lib/store/features/portfolios-slice";
import { useWebSocketEvent } from "@/hooks/useWebSocketEvent";
import { removeSymbol } from "@/lib/store/features/portfolios-slice";

interface Token {
	id: number;
	symbol: string;
	name: string;
	price: number;
	amount: number;
	value: number;
	img_url: string;
	avg_price: number;
}
interface PortfolioTokensProps {
	portfolio: any;
}

export function PortfolioTokens({ portfolio }: PortfolioTokensProps) {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [tokenToDelete, setTokenToDelete] = useState<string | null>(null);
	const [tokens, setTokens] = useState(portfolio.assets || []);
	const [removeTokenFromPortfolio] = useRemoveTokenFromPortfolioMutation();
	const dispatch = useDispatch();

	const stream =
		"/stream?streams=" +
		tokens
			.map((token: Token) => token.symbol.toLowerCase() + "usdt@ticker")
			.join("/");
	const [priceData, setPriceData] = useState<any>({});

	if (tokens.length > 0) {
		useWebSocketEvent("ticker", stream, (data: any) => {
			let token = tokens.find(
				(token: Token) => token.symbol.toUpperCase() + "USDT" === data.s
			);
			if (token) {
				setPriceData((prev: any) => ({
					...prev,
					[token.symbol]: data.c,
				}));
			}
		});
	} else {
		// Handle error Error: Rendered more hooks than during the previous render
		useWebSocketEvent("", stream, () => {});
	}

	useEffect(() => {
		if (portfolio.assets) {
			setTokens([...portfolio.assets].sort((a: Token, b: Token) => b.value - a.value));
		}
	}, [portfolio.assets]);
	
	const handleDeleteClick = (token: string) => {
		setTokenToDelete(token);
		setOpenDeleteDialog(true);
	};

	const handleDeleteConfirm = async () => {
		if (tokenToDelete) {
			// Here you would call a server action to delete the token
			await removeTokenFromPortfolio({
				portfolio_id: portfolio.id,
				token: tokenToDelete,
			});
			dispatch(removeSymbol(tokenToDelete));
			toast.success("The token has been removed from your portfolio.");
			setOpenDeleteDialog(false);
			setTokenToDelete(null);
		}
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Portfolio Tokens</CardTitle>
					<CardDescription>
						Manage your tokens in this portfolio
					</CardDescription>
				</div>
				<Link href={`/portfolios/add-token`}>
					<Button size="sm">
						<Plus className="mr-2 h-4 w-4" />
						Add Token
					</Button>
				</Link>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{tokens.length === 0 ? (
						<div className="text-center py-4">
							<p className="text-muted-foreground">
								No tokens in this portfolio yet.
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Token</TableHead>
									<TableHead className="text-center">
										Portfolio (%)
									</TableHead>
									<TableHead className="text-center">
										Price
									</TableHead>
									<TableHead className="text-center">
										Value
									</TableHead>
									<TableHead className="text-center">
										Unrealize PnL
									</TableHead>
									<TableHead className="text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{tokens.map((token: Token) => {
									const unrealizedPnL = priceData[token.symbol]
										? Number(
												priceData[token.symbol] *
													token.amount -
													token.avg_price *
														token.amount
										  ).toFixed(2)
										: null;
									const allocation = Number(
										((priceData[token.symbol] *
											token.amount) /
											portfolio.totalValue) *
											100
									).toFixed(0);
									return (
										<TableRow key={token.id}>
											<TableCell>
												<div className="flex items-center">
													<Avatar className="h-9 w-9">
														<AvatarImage
															src={token.img_url}
															alt={token.symbol}
														/>
														<AvatarFallback>
															{token.symbol.toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div className="ml-4">
														<p className="font-medium">
															{token.name}
														</p>
														<p className="text-sm text-muted-foreground">
															{token.symbol.toUpperCase()}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell className="text-center">
												{/* Portfolio allocation percentage could be calculated here */}
												<div className="flex items-center gap-2">
													{!isNaN(Number(allocation)) ? (<span>{allocation}%</span>) : <Skeleton className="h-4 w-4" />}
													<div
														className="w-24 h-2 rounded-full overflow-hidden"
														style={{
															backgroundColor:
																"hsl(var(--muted))",
														}}
													>
														<div
															className="h-full rounded-full"
															style={{
																width: `${!isNaN(Number(allocation)) ? allocation : 0}%`,
																backgroundColor:
																	"hsl(var(--primary))",
															}}
														></div>
													</div>
												</div>
											</TableCell>
											<TableCell className="text-center">
												<div className="font-medium">
													{priceData[token.symbol] ? (
														"$" +
														Number(priceData[token.symbol])?.toFixed(2)
													) : (
														<Skeleton className="h-4 w-16 mx-auto" />
													)}
												</div>
											</TableCell>
											<TableCell className="text-center">
												<div>
													<div className="font-medium">
														{priceData[
															token.symbol
														] ? (
															"$" +
															Number(priceData[token.symbol] * token.amount)?.toFixed(2)) 
														: (
															<Skeleton className="h-4 w-16 mx-auto" />
														)}
													</div>
													<p className="text-sm text-muted-foreground">
														{token.amount}{" "}
														{token.symbol.toUpperCase()}
													</p>
												</div>
											</TableCell>
											<TableCell className="text-center">
												<div
													className={`font-medium ${
														unrealizedPnL &&
														Number(unrealizedPnL) >
															0
															? "text-green-700"
															: "text-red-700"
													}`}
												>
													{unrealizedPnL ? (
														`$${unrealizedPnL}`
													) : (
														<Skeleton className="h-4 w-16 mx-auto" />
													)}
												</div>
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger
														asChild
													>
														<Button
															variant="ghost"
															size="icon"
														>
															<MoreHorizontal className="h-4 w-4" />
															<span className="sr-only">
																Open menu
															</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															asChild
														>
															<Link href={`/transactions?id=${token.id}`}>
																<Plus className="mr-2 h-4 w-4" />
																View Transaction
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																handleDeleteClick(
																	token.symbol
																)
															}
															className="text-destructive"
														>
															<Trash2 className="mr-2 h-4 w-4" />
															Remove Token
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</div>
			</CardContent>

			<AlertDialog
				open={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will remove the token from your portfolio. This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteConfirm}>
							Remove
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	);
}
