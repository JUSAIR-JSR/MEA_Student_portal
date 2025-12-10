import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("authToken")?.value;   // <-- FIXED
  const path = request.nextUrl.pathname;

  // Public page
  const isLoginPage = path === "/";

  // Not logged in → block dashboard/exam
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Logged in → prevent going back to login
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/exam/:path*"],
};
