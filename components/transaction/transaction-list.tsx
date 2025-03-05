"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { toast } from "sonner";

const transactionsData = [
	{
		id: "1",
		type: "buy",
		token: "Bitcoin",
		symbol: "BTC",
		amount: 0.05,
		price: 32456.78,
		value: 1622.84,
		date: "2023-10-15",
		portfolio: "Long Term Hodl",
		portfolioId: "1",
		icon: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "2",
		type: "sell",
		token: "Ethereum",
		symbol: "ETH",
		amount: 1.2,
		price: 1845.23,
		value: 2214.28,
		date: "2023-10-12",
		portfolio: "Trading Portfolio",
		portfolioId: "2",
		icon: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "3",
		type: "buy",
		token: "Solana",
		symbol: "SOL",
		amount: 10,
		price: 98.45,
		value: 984.5,
		date: "2023-10-10",
		portfolio: "Altcoin Gems",
		portfolioId: "3",
		icon: "/placeholder.svg?height=40&width=40",
	},
	{
		id: "4",
		type: "buy",
		token: "Cardano",
		symbol: "ADA",
		amount: 500,
		price: 0.45,
		value: 225.0,
		date: "2023-10-05",
		portfolio: "Altcoin Gems",
		portfolioId: "3",
		icon: "/placeholder.svg?height=40&width=40",
	},
];

export function TransactionList() {
	const [transactions, setTransactions] = useState(transactionsData);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [transactionToDelete, setTransactionToDelete] = useState<
		string | null
	>(null);

	const handleDeleteClick = (transactionId: string) => {
		setTransactionToDelete(transactionId);
		setOpenDeleteDialog(true);
	};

	const handleDeleteConfirm = () => {
		if (transactionToDelete) {
			// Here you would call a server action to delete the transaction
			// For now, we'll just update the local state
			setTransactions(
				transactions.filter(
					(transaction) => transaction.id !== transactionToDelete
				)
			);

			toast.success(
				"The transaction has been deleted."
			);
			setOpenDeleteDialog(false);
			setTransactionToDelete(null);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>All Transactions</CardTitle>
				<CardDescription>
					View and manage all your crypto transactions
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{transactions.map((transaction) => (
						<div
							key={transaction.id}
							className="flex items-center justify-between p-2 border rounded-md"
						>
							<div className="flex items-center">
								<Avatar className="h-9 w-9">
									<AvatarImage
										src={transaction.icon}
										alt={transaction.token}
									/>
									<AvatarFallback>
										{transaction.symbol.substring(0, 2)}
									</AvatarFallback>
								</Avatar>
								<div className="ml-4">
									<div className="flex items-center gap-2">
										<p className="font-medium">
											{transaction.token}
										</p>
										<Badge
											variant={
												transaction.type === "buy"
													? "default"
													: "destructive"
											}
										>
											{transaction.type.toUpperCase()}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										{transaction.date} •{" "}
										{transaction.portfolio}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="text-right">
									<p className="font-medium">
										${transaction.value.toLocaleString()}
									</p>
									<p className="text-sm text-muted-foreground">
										{transaction.amount}{" "}
										{transaction.symbol} @ $
										{transaction.price.toLocaleString()}
									</p>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon">
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
					))}
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
