import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    const isAuthRoute = pathname === "/login" || pathname === "/signup";
    const isAdminRoute = pathname.startsWith("/admin");

    // Define routes that require authentication for normal users
    const isProtectedRoute = ["/checkout", "/orders", "/profile", "/cart"].some(route => pathname.startsWith(route));

    // If user is logged in
    if (token) {
        // Admin Routing Logic
        if (token.isAdmin) {
            // Admin MUST stay within /admin routes
            if (!isAdminRoute) {
                return NextResponse.redirect(new URL("/admin", req.url));
            }
        }
        // User Routing Logic
        else {
            if (isAdminRoute) {
                return NextResponse.redirect(new URL("/", req.url));
            }
            if (isAuthRoute) {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }
    }
    // If user is NOT logged in
    else {
        if (isAdminRoute || isProtectedRoute) {
            return NextResponse.redirect(new URL("/login", req.url));
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
