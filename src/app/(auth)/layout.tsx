import { cookies } from "next/headers";

/**
 * Auth Layout - Runtime signal for Clerk authentication routes
 *
 * This layout uses cookies() as an implicit runtime signal to disable prerendering
 * for all routes under this layout. This is required for Next.js 16 with cacheComponents
 * enabled, as Clerk routes depend on request-time APIs (cookies, headers).
 *
 * Segment configs like runtime = "nodejs" or dynamic = "force-dynamic" are not
 * compatible with cacheComponents, so we use this implicit signal instead.
 *
 * Routes under this layout:
 * - /sign-in/[[...sign-in]]
 * - /sign-up/[[...sign-up]]
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Runtime signal: disables prerendering for this route tree
  // cookies() is called only as a signal - we await it but don't use the result
  await cookies();

  return <>{children}</>;
}
