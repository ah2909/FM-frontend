import type React from "react";
interface BaseShellProps {
	children: React.ReactNode;
	className?: string;
}

export function BaseShell({ children, className = "" }: BaseShellProps) {
	return (
		<div className={`flex-1 space-y-4 p-3 sm:p-4 md:p-6 lg:p-8 pt-4 sm:pt-6 ${className}`}>{children}</div>
	);
}
