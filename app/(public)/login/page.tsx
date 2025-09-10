"use client";
import type React from "react";
import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

declare global {
	interface Window {
		google: any;
	}
}

// Define Zod schema for form validation
const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
	const { login } = useAuth();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	const handleGoogleOneTap = useCallback(
		async (response: { credential: string }) => {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/google/verify`,
					{
						method: "POST",
						credentials: "include",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ idToken: response.credential }),
					}
				);
				if (!res.ok) throw new Error("Google verification failed");
				const data: any = await res.json();
				login(data);
			} catch (error) {
				console.error("Google login error:", error);
				toast.error("Login failed. Please try again.");
			}
		},
		[]
	);

	useEffect(() => {
		const { google } = window;
		if (google) {
			google.accounts.id.initialize({
				client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
				callback: handleGoogleOneTap,
				auto_select: false,
			});
		}
	}, [handleGoogleOneTap]);

	const triggerGooglePrompt = () => {
		const { google } = window;
		google.accounts.id.prompt();
	};

	const onSubmit = async (data: LoginFormValues) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/login`,
				{
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);
			if (!response.ok) throw new Error("Login failed");
			const result: any = await response.json();
			login(result);
		} catch (error) {
			console.error("Login error:", error);
			toast.error("Login failed. Please try again.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
			<div className={cn("flex flex-col gap-6 w-full max-w-md")}>
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl sm:text-2xl">
							Welcome back
						</CardTitle>
						<CardDescription className="text-sm sm:text-base">
							Login with your Google account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-6">
							{/* Social Logins */}
							<div className="flex flex-col gap-4">
								<Button
									variant="outline"
									className="w-full text-sm sm:text-base bg-transparent"
									onClick={triggerGooglePrompt}
									disabled={isSubmitting}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										className="mr-2 h-4 w-4"
									>
										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									Sign in with Google
								</Button>
							</div>
							{/* Divider */}
							<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
								<span className="relative z-10 bg-background px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
							{/* Email/Password Form */}
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="grid gap-6">
									<div className="grid gap-2">
										<Label
											htmlFor="email"
											className="text-sm"
										>
											Email
										</Label>
										<Input
											id="email"
											type="email"
											tabIndex={1}
											className="text-sm"
											{...register("email")}
											disabled={isSubmitting}
										/>
										{errors.email && (
											<p className="text-red-500 text-xs sm:text-sm">
												{errors.email.message}
											</p>
										)}
									</div>
									<div className="grid gap-2">
										<div className="flex items-center">
											<Label
												htmlFor="password"
												className="text-sm"
											>
												Password
											</Label>
											<a
												href="#"
												className="ml-auto text-xs sm:text-sm underline-offset-4 hover:underline"
											>
												Forgot your password?
											</a>
										</div>
										<Input
											id="password"
											type="password"
											tabIndex={2}
											className="text-sm"
											{...register("password")}
											disabled={isSubmitting}
										/>
										{errors.password && (
											<p className="text-red-500 text-xs sm:text-sm">
												{errors.password.message}
											</p>
										)}
									</div>
									<Button
										type="submit"
										className="w-full text-sm sm:text-base"
										disabled={isSubmitting}
									>
										{isSubmitting
											? "Logging in..."
											: "Login"}
									</Button>
								</div>
								<div className="text-center text-xs sm:text-sm mt-4">
									Don&apos;t have an account?{" "}
									<Link
										href="/register"
										className="underline underline-offset-4"
									>
										Sign up
									</Link>
								</div>
							</form>
						</div>
					</CardContent>
				</Card>
				<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary px-4">
					By clicking continue, you agree to our{" "}
					<a href="#">Terms of Service</a> and{" "}
					<a href="#">Privacy Policy</a>.
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
