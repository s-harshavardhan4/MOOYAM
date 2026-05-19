import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET 
    });
    const { pathname } = req.nextUrl;
    
    // Explicitly bypass all API routes (including /api/auth)
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    const isAuthRoute = pathname === "/login" || pathname === "/signup";
    const isAdminRoute = pathname.startsWith("/admin");

    // Define routes that require authentication for normal users
    const isProtectedRoute = ["/checkout", "/orders", "/profile", "/cart", "/account"].some(route => pathname.startsWith(route));

    // If user is logged in
    if (token) {
        // Block normal users from accessing admin routes
        if (!token.isAdmin && isAdminRoute) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        
        // Block logged in users (admin or normal) from viewing login/signup
        if (isAuthRoute) {
            const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "/";
            return NextResponse.redirect(new URL(callbackUrl, req.url));
        }
    }
    // If user is NOT logged in
    else {
        if (isAdminRoute || isProtectedRoute) {
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - media files (svg, png, jpg, jpeg, gif, webp, etc)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
    ],
};
