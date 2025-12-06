import { NextResponse } from "next/server";

export function middleware(req) {
  // ✅ Students, teachers, admins ALL use this cookie name
  const token = req.cookies.get("authToken")?.value;

  const path = req.nextUrl.pathname;

  const publicPages = ["/login"];
  const protectedPages = [
    "/dashboard",
    "/profile",
    "/results",
    "/notifications",
  ];

  // ❌ If not logged in → block protected pages
  if (protectedPages.some((p) => path.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ❌ If logged in → prevent login page access
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
