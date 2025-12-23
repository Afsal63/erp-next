import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Backend cookie name
  const token = req.cookies.get("token")?.value;

  const isAuthPage = pathname === "/login";
  const isAdminRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/inventory") ||
    pathname.startsWith("/customers") ||
    pathname.startsWith("/sale-order") ||
    pathname.startsWith("/employees") ||
    pathname.startsWith("/users");

  // // ❌ Not logged in → admin route
  // if (isAdminRoute && !token) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // // ❌ Logged in → login page
  // if (isAuthPage && token) {
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/inventory/:path*",
    "/customers/:path*",
    "/sale-order/:path*",
    "/employees/:path*",
    "/users/:path*",
  ],
};