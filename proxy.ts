import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/waitlist(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/waitlist(.*)",
  "/api/webhooks(.*)",
  "/api/bible(.*)",
  "/api/flash(.*)",
  "/api/cron(.*)",
  "/bible(.*)",
  "/study/shared(.*)",
  "/admin(.*)",  // admin uses its own cookie-based auth, not Clerk
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
