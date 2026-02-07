import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
// Reference: https://clerk.com/docs/nextjs/guides/development/custom-sign-in-or-up-page
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/reset-password(.*)",
  "/waitlist(.*)",
  "/api/waitlist", // Waitlist signup (unauthenticated)
  "/", // Home page is public
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
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
