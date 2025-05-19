"use client"

import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "sonner";
import { store } from "@/lib/store/store";
import { Provider } from "react-redux";
import { WebSocketProvider } from '../contexts/WebSocketContext';
import { AuthProvider } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
const GUEST_ROUTES = ['/login', '/register', '/welcome'];

export default function RootLayout({ children }: { children: React.ReactNode; }) 
{
	const pathname = usePathname();
	// Function to check if the current route is a guest route
	const isGuestRoute = () => GUEST_ROUTES.includes(pathname);

	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>
				<WebSocketProvider>
				<Provider store={store}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
				>
					<div className="relative flex min-h-screen flex-col">
						{ !isGuestRoute() && <SiteHeader /> }
						<div className="flex-1">{children}</div>
						<Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
					</div>
					<Toaster richColors />
				</ThemeProvider>
				</Provider>
				</WebSocketProvider>
				</AuthProvider>
			</body>
		</html>
	);
}

import "./globals.css";
