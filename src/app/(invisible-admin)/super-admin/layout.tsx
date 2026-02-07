import { redirect } from "next/navigation";
import { getAuthenticatedUserId, requireSuperAdmin } from "@/lib/permissions";

/**
 * Super-admin portal guard: access only for User.role === "super_admin" (DB).
 * Clerk authentication alone does NOT grant access; enforcement is server-side here.
 * Unauthenticated users are already redirected by middleware to /waitlist.
 */
export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    redirect("/waitlist");
  }
  const isSuperAdmin = await requireSuperAdmin(userId);
  if (!isSuperAdmin) {
    redirect("/dashboard");
  }
  return <>{children}</>;
}
