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
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
