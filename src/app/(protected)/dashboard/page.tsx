import { DashboardClient } from "@/components/dashboard-client";

/**
 * Dashboard Page - Protected route accessible only to authenticated users
 * 
 * This page is protected by:
 * 1. clerkMiddleware in proxy.ts - redirects unauthenticated users
 * 2. ProtectedLayout - double-checks authentication and provides Navbar
 * 
 * After successful sign-in/sign-up, users are redirected here automatically.
 * User information is displayed in the Navbar component (UserButton).
 */
export default function DashboardPage() {
  return <DashboardClient />;
}
