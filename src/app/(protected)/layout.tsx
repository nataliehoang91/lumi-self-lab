import { Navbar } from "@/components/navbar";
import { UserProvider } from "@/hooks/user-context";

/**
 * Protected Layout - Wraps protected routes with Navbar
 *
 * Routes protected by this layout:
 * - /dashboard
 * - /experiments
 * - /experiments/[id]
 *
 * Note: clerkMiddleware in proxy.ts already protects these routes,
 * so no auth check is needed here - middleware ensures users are authenticated.
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // User is authenticated (middleware ensures this), render navbar and children
  return (
    <UserProvider>
      <Navbar />
      {children}
    </UserProvider>
  );
}
