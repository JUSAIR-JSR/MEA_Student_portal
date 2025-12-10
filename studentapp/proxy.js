import { NextResponse } from "next/server";

export function proxy(req) {
  const token = req.cookies.get("authToken")?.value;
  const path = req.nextUrl.pathname;

  const protectedPages = [
    "/dashboard",
    "/profile",
    "/results",
    "/notifications"
  ];

  if (protectedPages.some(p => path.startsWith(p)) && !token) {
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
    "/notifications/:path*"
  ]
};
