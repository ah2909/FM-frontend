"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { BaseHeader } from "@/components/base-header";
import { BaseShell } from "@/components/base-shell";
import { EditPortfolioForm } from "@/components/portfolio/edit-portfolio-form";
import { UseDispatch, useSelector } from "react-redux";

export default function EditPortfolioPage() {
	const portfolio = useSelector((state: any) => state.portfolios.portfolio);

	if (!portfolio) {
		notFound();
	}

	return (
		<BaseShell>
			<BaseHeader
				heading="Edit Portfolio"
				text="Update your portfolio details"
			>
				<Link href={`/portfolios`}>
					<Button variant="outline">Cancel</Button>
				</Link>
			</BaseHeader>
			<div className="grid gap-8">
				<EditPortfolioForm portfolio={portfolio} />
			</div>
		</BaseShell>
	);
}
