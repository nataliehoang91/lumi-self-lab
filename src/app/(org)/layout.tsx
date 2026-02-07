import { redirect } from "next/navigation";
import {
  getAuthenticatedUserId,
  canAccessOrgPortal,
} from "@/lib/permissions";
import { NavigationBar } from "@/components/Navigation/navigation-bar";
import { UserProvider } from "@/hooks/user-context";

/**
 * Org portal layout: guard (membership or super_admin) + Nav + UserProvider.
 */
export default async function OrgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getAuthenticatedUserId();
  if (!userId) redirect("/waitlist");
  const canAccess = await canAccessOrgPortal(userId);
  if (!canAccess) redirect("/dashboard");
  return (
    <UserProvider>
      <NavigationBar />
      {children}
    </UserProvider>
  );
}
