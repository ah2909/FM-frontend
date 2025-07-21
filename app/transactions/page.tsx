"use client";

import { Suspense } from "react";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { TransactionList } from "@/components/transaction/transaction-list";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSelector, useDispatch } from "react-redux";
import { useGetPortfoliosByUserIDQuery } from "@/lib/store/services/portfolio-api";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";

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

	useEffect(() => {
		if (isLoading) return;
		if (data?.data?.length === 0) router.push("/welcome");
	}, [data, isLoading, dispatch]);

	return (
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
				<TransactionList selectedToken={selectedToken} />
			)}
		</BaseShell>
	);
}

export default function TransactionsPage() {
	return (
		<ProtectedRoute>
			<Suspense fallback={<Loading />}>
				<TransactionsContent />
			</Suspense>
		</ProtectedRoute>
	);
}
