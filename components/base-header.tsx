"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
interface BaseHeaderProps {
	heading: string;
	text?: string;
	children?: React.ReactNode;
	showBackButton?: boolean;
}

export function BaseHeader({
	heading,
	text,
	children,
	showBackButton = true,
}: BaseHeaderProps) {
	const router = useRouter();
	return (
		<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
			<div>
				{showBackButton && (
					<Button
						variant="ghost"
						size="icon"
						onClick={() => router.back()}
						className="mr-2"
						aria-label="Go back"
					>
						<ChevronLeft className="h-5 w-5" />
					</Button>
				)}
				<h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
				{text && <p className="text-muted-foreground">{text}</p>}
			</div>
			{children}
		</div>
	);
}
