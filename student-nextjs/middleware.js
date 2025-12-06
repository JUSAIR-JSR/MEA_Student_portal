import { NextResponse } from "next/server";

export function middleware(req) {
  // FIX: use correct cookie name
  const token =
    req.cookies.get("studentAuthToken")?.value ||
    req.cookies.get("authToken")?.value ||
    req.cookies.get("token")?.value;

  const path = req.nextUrl.pathname;

  const publicPages = ["/login"];
  const protectedPages = ["/dashboard", "/profile", "/results", "/notifications"];

  // Not logged in → block protected pages
  if (protectedPages.some((p) => path.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Already logged in → stop going back to login
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
