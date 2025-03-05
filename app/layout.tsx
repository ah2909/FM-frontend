"use client"

import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "sonner";
import { store } from "@/lib/store/store";
import { Provider } from "react-redux";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Provider store={store}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
				>
					<div className="relative flex min-h-screen flex-col">
						<SiteHeader />
						<div className="flex-1">{children}</div>
					</div>
					<Toaster richColors />
				</ThemeProvider>
				</Provider>
			</body>
		</html>
	);
}

import "./globals.css";
