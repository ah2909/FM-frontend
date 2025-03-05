"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
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
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner";
import { 
	useGetPortfoliosByUserIDQuery,
	useDeletePortfolioMutation
} from "@/lib/store/services/portfolio-api";
import { formatDate } from "@/lib/utils";
import { useDispatch, UseDispatch, useSelector } from "react-redux";
import { setPortfolios } from "@/lib/store/features/portfolios-slice";

export function PortfolioList() {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [portfolioToDelete, setPortfolioToDelete] = useState<number | null>(null);
	
	const dispatch = useDispatch();
	const { data, isLoading, isError } = useGetPortfoliosByUserIDQuery();
	const [deletePortfolio, {isLoading: isLoading_delete}] = useDeletePortfolioMutation();

	useEffect(() => {
		if(isLoading) return;
		if(typeof data !== 'undefined')
			dispatch(setPortfolios(data))
	}, [data, isLoading])

	const handleDeleteClick = (portfolioId: number) => {
		setPortfolioToDelete(portfolioId);
		setOpenDeleteDialog(true);
	};

	const handleDeleteConfirm = async () => {
		if (portfolioToDelete) {
			// Here you would call a server action to delete the portfolio
			// For now, we'll just update the local state
			await deletePortfolio(portfolioToDelete).unwrap();
			toast.success(
				"The portfolio has been deleted successfully."
			);

			setOpenDeleteDialog(false);
			setPortfolioToDelete(null);
		}
	};

	return (
		<>
		{isLoading ? (
			<div className="flex flex-col space-y-3">
				<Skeleton className="h-[125px] w-[250px] rounded-xl" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-[250px]" />
					<Skeleton className="h-4 w-[200px]" />
				</div>
			</div>
		)
		: (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{data?.map((portfolio) => (
				<Card key={portfolio.id}>
					<CardHeader className="flex flex-row items-start justify-between space-y-0">
						<div>
							<CardTitle>{portfolio.name}</CardTitle>
							<CardDescription>
								{portfolio.description}
							</CardDescription>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<MoreHorizontal className="h-4 w-4" />
									<span className="sr-only">Open menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem asChild>
									<Link
										href={`/portfolios/${portfolio.id}/edit`}
									>
										<Pencil className="mr-2 h-4 w-4" />
										Edit
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									className="text-destructive"
									onClick={() =>
										handleDeleteClick(portfolio.id)
									}
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</CardHeader>
					<CardContent>
						<div className="grid gap-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">
									Total Value:
								</span>
								<span className="font-bold">
									${portfolio.totalValue?.toLocaleString() ?? 0}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">
									Tokens:
								</span>
								<span>{portfolio.tokenCount ?? 0}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">
									Created:
								</span>
								<span>{formatDate(portfolio.created_at)}</span>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Link
							href={`/portfolios/${portfolio.id}`}
							className="w-full"
						>
							<Button variant="outline" className="w-full">
								View Details
							</Button>
						</Link>
					</CardFooter>
				</Card>
			))}

			<AlertDialog
				open={openDeleteDialog}
				onOpenChange={setOpenDeleteDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the portfolio and all
							its data. This action cannot be undone.
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
		</div>
	)}
	</>
	);
}
