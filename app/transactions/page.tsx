'use client'

import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { TransactionList } from "@/components/transaction/transaction-list";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useGetPortfoliosByUserIDQuery } from "@/lib/store/services/portfolio-api";
import { setPortfolio, setAssets, setTransactions } from "@/lib/store/features/portfolios-slice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function TransactionsPage() {
	const params = useSearchParams()
  	const token_id = params.get('id') || '';
	const dispatch = useDispatch();
	const { data, isLoading } = useGetPortfoliosByUserIDQuery();
	const tokens = useSelector((state: any) => state.portfolios.assets);
	const selectedToken = tokens.find((token: any) => token.id === parseInt(token_id));
	const router = useRouter();

	useEffect(() => {
		if (isLoading) return;
		if (data?.data?.length === 0) router.push("/welcome");
		
		dispatch(setPortfolio(data?.data));
		dispatch(setAssets(data?.data?.assets));
		dispatch(setTransactions(data?.data?.transactions));
	}, [data, isLoading, dispatch]);
	
	return (
		<ProtectedRoute>
			<BaseShell>
				<BaseHeader
					heading="Transactions"
					text="Manage your crypto transactions"
				>
					{/* <Link href="/transactions/new">
						<Button>
							<PlusCircle className="mr-2 h-4 w-4" />
							New Transaction
						</Button>
					</Link> */}
				</BaseHeader>
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
					<TransactionList selectedToken={selectedToken}/>
				)
				}
				
			</BaseShell>
		</ProtectedRoute>
	);
}
