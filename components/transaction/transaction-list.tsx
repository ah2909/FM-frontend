"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSelector } from "react-redux";

interface TransactionListProps {
	selectedToken: any;
}

export function TransactionList({ selectedToken }: TransactionListProps) {
	const [selectedExchange, setSelectedExchange] = useState<string>("all");
	const [selectedType, setSelectedType] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [transactionToDelete, setTransactionToDelete] = useState<
		string | null
	>(null);

	const transactions = useSelector((state: any) => state.portfolios.transactions);
	const transByAsset = transactions.filter((tran: any) => tran.asset_id === selectedToken?.id).reverse();

	const handleDeleteClick = (transactionId: string) => {
		setTransactionToDelete(transactionId);
		setOpenDeleteDialog(true);
	};

	const handleDeleteConfirm = async () => {
		if (transactionToDelete) {
			try {
				toast.success("Transaction deleted successfully");
				setOpenDeleteDialog(false);
				setTransactionToDelete(null);
			} catch (error) {
				toast.error("Failed to delete transaction");
			}
		}
	};

	const mappingExchanges = (exchange_id: number) => {
		switch (exchange_id) {
			case 1:
				return "Binance";
			case 2:
				return "OKX";
			case 3:
				return "Bybit";
			default:
				return "Unknown Exchange";
		}
	}

	const mappingExchangesLogo = (exchange_id: number) => {
		switch (exchange_id) {
			case 1:
				return "/binance.png";
			case 2:
				return "/okx.png";
			case 3:
				return "/bybit.png";
			default:
				return "/placeholder-logo.png";
		}
	}
	

	const filteredTransactions = transByAsset?.filter((transaction: any) => {
		if (
			selectedExchange !== "all" &&
			transaction.exchange !== selectedExchange
		) {
			return false;
		}
		if (selectedType !== "all" && transaction.type !== selectedType) {
			return false;
		}
		if (
			searchQuery &&
			!transaction.token
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) &&
			!transaction.symbol
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		) {
			return false;
		}
		return true;
	});

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	const formatAmount = (amount: number, symbol: string) => {
		if (amount >= 1) {
			return `${amount.toLocaleString()} ${symbol}`;
		} else {
			return `${amount} ${symbol}`;
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>All Transactions</CardTitle>
							<CardDescription>
								View and manage all your crypto transactions
							</CardDescription>
						</div>
					</div>

					{/* Filters */}
					{/* <div className="flex flex-col md:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by asset name or symbol..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-8"
							/>
						</div>
						<Select
							value={selectedExchange}
							onValueChange={setSelectedExchange}
						>
							<SelectTrigger className="w-full md:w-[180px]">
								<SelectValue placeholder="All Exchanges" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									All Exchanges
								</SelectItem>
								{exchanges?.map((exchange) => (
									<SelectItem
										key={exchange.id}
										value={exchange.id}
									>
										{exchange.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={selectedType}
							onValueChange={setSelectedType}
						>
							<SelectTrigger className="w-full md:w-[140px]">
								<SelectValue placeholder="All Types" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="buy">Received</SelectItem>
								<SelectItem value="sell">Send</SelectItem>
							</SelectContent>
						</Select>
					</div> */}
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-1">
					{filteredTransactions?.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">
								No transactions found matching your filters.
							</p>
						</div>
					) : (
						transByAsset?.map((transaction: any) => (
							<div
								key={transaction.id}
								className="grid grid-cols-12 items-center py-4 px-2 hover:bg-muted/30 rounded-lg transition-colors group gap-4"
							>
								{/* Left side - Crypto icon and info */}
								<div className="col-span-2 flex items-center space-x-4">
									<Avatar className="h-9 w-9">
										<AvatarImage
											src={selectedToken.img_url}
											alt={selectedToken.symbol}
										/>
										<AvatarFallback>
											{selectedToken.symbol.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="min-w-0">
										<div className="font-medium text-base truncate">
											{selectedToken.name}
										</div>
										<div className="text-sm text-muted-foreground">
											{selectedToken.symbol.toUpperCase()}
										</div>
									</div>
								</div>

								{/* Transaction type badge */}
								<div className="col-span-1 flex justify-center">
									<Badge
										variant="outline"
										className={`${
											transaction.type === "BUY"
												? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
												: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
										}`}
									>
										{transaction.type}
									</Badge>
								</div>

								{/* Amount and Value */}
								<div className="col-span-4 text-center">
									<div className="font-semibold text-lg">
										$ {Number(transaction.price * transaction.quantity).toLocaleString()}
									</div>
									<div className="text-sm text-muted-foreground">
										{formatAmount(
											transaction.quantity,
											selectedToken.symbol.toUpperCase()
										)}
									</div>
								</div>

								{/* Exchange */}
								<div className="col-span-2 flex items-center space-x-2">
									<Avatar className="h-8 w-8 shrink-0">
										<AvatarImage
											src={mappingExchangesLogo(transaction.exchange_id)}
											alt={mappingExchanges(transaction.exchange_id)}
										/>
										<AvatarFallback className="text-xs">
											{mappingExchanges(transaction.exchange_id)}
										</AvatarFallback>
									</Avatar>
									<span className="text-sm font-medium truncate">
										{mappingExchanges(transaction.exchange_id)}
									</span>
								</div>

								{/* Date */}
								<div className="col-span-2 text-sm text-muted-foreground text-right">
									{formatDate(transaction.transact_date)}
								</div>

								{/* Actions */}
								<div className="col-span-1">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
											>
												<MoreHorizontal className="h-4 w-4" />
												<span className="sr-only">
													Open menu
												</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem asChild>
												<Link
													href={`/transactions/${transaction.id}/edit`}
												>
													<Pencil className="mr-2 h-4 w-4" />
													Edit Transaction
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													handleDeleteClick(
														transaction.id
													)
												}
												className="text-destructive"
											>
												<Trash2 className="mr-2 h-4 w-4" />
												Delete Transaction
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						))
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
							This will permanently delete the transaction. This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteConfirm}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	);
}
