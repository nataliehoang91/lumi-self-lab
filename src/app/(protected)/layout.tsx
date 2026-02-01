import { NavigationBar } from "@/components/Navigation/navigation-bar";
import { UserProvider } from "@/hooks/user-context";

/**
 * Protected Layout - Wraps protected routes with NavigationBar
 *
 * Routes protected by this layout:
 * - /create
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
  // User is authenticated (middleware ensures this), render navigation bar and children
  return (
    <UserProvider>
      <NavigationBar />
      {children}
    </UserProvider>
  );
}
