import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("authToken")?.value;
  const path = req.nextUrl.pathname;

  const publicPages = ["/login"];

  const protectedPages = [
    "/dashboard",
    "/profile",
    "/results",
    "/notifications",
  ];

  // If user tries to access protected page without login → redirect
  if (protectedPages.some(p => path.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If already logged in → block going to login page
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
