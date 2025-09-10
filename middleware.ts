// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("refreshToken")?.value;
  const GUEST_ROUTES = ["/login", "/register"]
  const { pathname } = req.nextUrl;

  if (!token && !GUEST_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  if (token && GUEST_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher:  ["/", "/login", "/register", "/welcome", "/portfolios", "/transactions", "/exchanges"],
};
