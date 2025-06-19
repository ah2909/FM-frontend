"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { PortfolioTokens } from "@/components/portfolio/portfolio-tokens";
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview";
import { useDispatch, useSelector } from "react-redux";
import { ImportDataButton } from "@/components/portfolio/import-data-button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useGetPortfoliosByUserIDQuery } from "@/lib/store/services/portfolio-api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function PortfolioPage() {
	const dispatch = useDispatch();
	const { data, isLoading } = useGetPortfoliosByUserIDQuery();
	const portfolio = useSelector((state: any) => state.portfolios.portfolio);
	const tokens = useSelector((state: any) => state.portfolios.assets);
	const router = useRouter();
	
	useEffect(() => {
		if (isLoading) return;
		if (data?.data?.length === 0) router.push("/welcome");
	}, [isLoading, data, dispatch]);

	return (
		<ProtectedRoute>
			<BaseShell>
				{isLoading ? (
					<Loading />
				) : (
					<>
						<BaseHeader
							heading={portfolio.name}
							text={portfolio.description}
							showBackButton={false}
						>
							<div className="flex space-x-2">
								<ImportDataButton 
									portfolio_id={portfolio.id} 
									assets_array={tokens?.map((token: any) => token.symbol.toUpperCase())} 
								/>
								<Button variant="outline">
									<PlusCircle className="mr-2 h-4 w-4" />
									<Link href={`/portfolios/edit`}>
										Edit Portfolio
									</Link>
								</Button>		
							</div>
						</BaseHeader>

						<div className="grid gap-8">
							{tokens.length > 0 && (
								<PortfolioOverview portfolio={portfolio} />
							)}
							<PortfolioTokens portfolio={portfolio} />
						</div>
					</>
				)}
			</BaseShell>
		</ProtectedRoute>
	);
}
