import { Suspense } from "react";

/**
 * Auth Layout - Clerk sign-in / sign-up routes
 *
 * Wraps children in Suspense so request-time data (Clerk, useSearchParams)
 * is inside a boundary and prerender works with cacheComponents: true.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div
            className="border-primary h-8 w-8 animate-spin rounded-full border-2
              border-t-transparent"
          />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
