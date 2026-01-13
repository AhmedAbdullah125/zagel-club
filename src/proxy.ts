import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PATHS = ["/login", "/register", "/forget-password"];
const DEFAULT_AFTER_LOGIN = "/";

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow Next internals / assets
    if (
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico" ||
        pathname === "/robots.txt" ||
        pathname === "/sitemap.xml"
    ) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;

    // If logged in, prevent visiting auth pages
    if (token && AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
        const url = req.nextUrl.clone();
        url.pathname = DEFAULT_AFTER_LOGIN;
        url.searchParams.delete("from");
        return NextResponse.redirect(url);
    }

    // If NOT logged in, allow only auth pages
    if (!token && !AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
