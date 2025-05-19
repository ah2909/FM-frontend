"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { EditPortfolioForm } from "@/components/portfolio/edit-portfolio-form";
import { UseDispatch, useSelector } from "react-redux";
import { Portfolio } from "@/lib/store/services/portfolio-api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface EditPortfolioPageProps {
	params: {
		id: number;
	};
}

export default function EditPortfolioPage({ params }: EditPortfolioPageProps) {
	const portfolioId = params.id;
	const local = useSelector((state: any) => state.portfolios.portfolios);
	const portfolio = local.find((port: Portfolio) => port.id == portfolioId);

	if (!portfolio) {
		notFound();
	}

	return (
		<ProtectedRoute>
			<BaseShell>
				<BaseHeader
					heading="Edit Portfolio"
					text="Update your portfolio details"
				>
					<Link href={`/portfolios/${portfolioId}`}>
						<Button variant="outline">Cancel</Button>
					</Link>
				</BaseHeader>
				<div className="grid gap-8">
					<EditPortfolioForm portfolio={portfolio} />
				</div>
			</BaseShell>
		</ProtectedRoute>
	);
}
