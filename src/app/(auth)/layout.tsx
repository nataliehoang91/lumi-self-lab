/**
 * Auth Layout - Clerk sign-in / sign-up routes
 *
 * Force dynamic so these routes are not prerendered (request-time data;
 * avoids "Uncached data outside Suspense" when cacheComponents is enabled).
 */
export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
