import type React from "react";
interface BaseShellProps {
	children: React.ReactNode;
}

export function BaseShell({ children }: BaseShellProps) {
	return (
		<div className="container mx-auto px-4 py-6 space-y-8">{children}</div>
	);
}
