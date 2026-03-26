import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper to decode JWT payload safely in Edge runtime
function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch(e) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Retrieve token from HttpOnly cookie
  const token = req.cookies.get("token")?.value;
  const decodedToken = token ? decodeJwt(token) : null;
  const userRole = decodedToken?.role;

  const isAuthPage = pathname === "/login";
  
  // Define route spaces
  const isAdminRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/inventory") ||
    pathname.startsWith("/customers") ||
    pathname.startsWith("/sale-order") ||
    pathname.startsWith("/sales-report") ||
    pathname.startsWith("/employees") ||
    pathname.startsWith("/users");

  const isExecutiveRoute =
    pathname.startsWith("/executive-customers") ||
    pathname.startsWith("/executive-saleOrder");

  // 1. Not logged in -> Redirect to Login if trying to access protected routes
  if ((isAdminRoute || isExecutiveRoute) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. Logged in -> Ensure they can't access Login page, redirect to Dashboard
  if (isAuthPage && token) {
    if (userRole === "super admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else if (userRole === "executive") {
      return NextResponse.redirect(new URL("/executive-customers", req.url));
    } else {
      // Unknown role, force relogin
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // 3. Logged in Role Checks
  if (token && userRole) {
    if (isAdminRoute && userRole !== "super admin") {
      // Executives trying to access admin routes get bounced to their dashboard
      if (userRole === "executive") {
        return NextResponse.redirect(new URL("/executive-customers", req.url));
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isExecutiveRoute && userRole !== "executive") {
      // Admins (or others) trying to access executive routes get bounced to their dashboard
      if (userRole === "super admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/inventory/:path*",
    "/customers/:path*",
    "/sale-order/:path*",
    "/sales-report/:path*",
    "/employees/:path*",
    "/users/:path*",
    "/executive-customers/:path*",
    "/executive-saleOrder/:path*",
  ],
};