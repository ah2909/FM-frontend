"use client";

import { useState } from "react";
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
import { toast } from "sonner";

interface PortfolioTokensProps {
	portfolioId: number;
	tokens: {
		id: string;
		name: string;
		symbol: string;
		amount: number;
		value: number;
		icon: string;
	}[];
}

export function PortfolioTokens({ portfolioId, tokens }: PortfolioTokensProps) {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [tokenToDelete, setTokenToDelete] = useState<string | null>(null);

	const handleDeleteClick = (tokenId: string) => {
		setTokenToDelete(tokenId);
		setOpenDeleteDialog(true);
	};

	const handleDeleteConfirm = () => {
		if (tokenToDelete) {
			// Here you would call a server action to delete the token
			toast.success(
				"The token has been removed from your portfolio."
			);
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
				<Link href={`/portfolios/${portfolioId}/add-token`}>
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
						tokens.map((token) => (
							<div
								key={token.id}
								className="flex items-center justify-between p-2 border rounded-md"
							>
								<div className="flex items-center">
									<Avatar className="h-9 w-9">
										<AvatarImage
											src={token.icon}
											alt={token.name}
										/>
										<AvatarFallback>
											{token.symbol.substring(0, 2)}
										</AvatarFallback>
									</Avatar>
									<div className="ml-4">
										<p className="font-medium">
											{token.name}
										</p>
										<p className="text-sm text-muted-foreground">
											{token.symbol}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<div className="text-right">
										<p className="font-medium">
											${token.value.toLocaleString()}
										</p>
										<p className="text-sm text-muted-foreground">
											{token.amount} {token.symbol}
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
													href={`/portfolios/${portfolioId}/tokens/${token.id}/transactions/new`}
												>
													<Plus className="mr-2 h-4 w-4" />
													Add Transaction
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link
													href={`/portfolios/${portfolioId}/tokens/${token.id}/edit`}
												>
													<Pencil className="mr-2 h-4 w-4" />
													Edit Token
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													handleDeleteClick(token.id)
												}
												className="text-destructive"
											>
												<Trash2 className="mr-2 h-4 w-4" />
												Remove Token
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
