import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// When WAITLIST_ONLY=true (e.g. production), only waitlist and its API are reachable; all other routes redirect to /waitlist.
const WAITLIST_ONLY = process.env.WAITLIST_ONLY === "true" || process.env.WAITLIST_ONLY === "1";

function isWaitlistAllowedPath(pathname: string): boolean {
  return (
    pathname === "/waitlist" || pathname.startsWith("/waitlist/") || pathname === "/api/waitlist"
  );
}

// Define public routes that don't require authentication
// Reference: https://clerk.com/docs/nextjs/guides/development/custom-sign-in-or-up-page
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/reset-password(.*)",
  "/waitlist(.*)",
  "/welcome", // Welcome page (sign in / get started)
  "/api/waitlist", // Waitlist signup (unauthenticated)
  "/api/webhooks(.*)", // Clerk webhooks (no auth; verified by signature)
  // Bible flash cards app (standalone, cookie-based admin only)
  "/bible(.*)",
  "/api/bible(.*)",
  "/api/flash",
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  // Bible app: /bible/admin (not login) requires is_admin cookie
  if (pathname === "/bible/admin" || pathname.startsWith("/bible/admin/")) {
    if (pathname !== "/bible/admin/login") {
      const isAdmin = req.cookies.get("is_admin")?.value === "true";
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/bible/admin/login", req.url));
      }
    }
    return NextResponse.next();
  }

  if (WAITLIST_ONLY && !isWaitlistAllowedPath(pathname)) {
    return NextResponse.redirect(new URL("/waitlist", req.url));
  }

  // Root: redirect without rendering MainPage to avoid Performance API / negative timestamp errors
  if (pathname === "/") {
    const { isAuthenticated } = await auth();
    const target = isAuthenticated ? "/dashboard" : "/welcome";
    return NextResponse.redirect(new URL(target, req.url));
  }

  const isInviteAccept = pathname.startsWith("/org/invites/");

  // Org invite accept: unauthenticated → sign-in with redirect back
  if (isInviteAccept && !isPublicRoute(req)) {
    const { isAuthenticated } = await auth();
    if (!isAuthenticated) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Protected route: unauthenticated users go to waitlist (pages) or 401 (API)
  if (!isPublicRoute(req)) {
    const { isAuthenticated } = await auth();
    if (!isAuthenticated) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/waitlist", req.url));
    }
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
