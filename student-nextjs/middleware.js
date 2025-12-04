import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("authToken")?.value;
  const path = req.nextUrl.pathname;

  // Public page
  const publicPaths = ["/login"];

  if (!token && !publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/profile/:path*",
    "/results/:path*",
    "/notifications/:path*",
  ],
};
