import { redirect } from "next/navigation";
import { getAuthenticatedUserId, canAccessOrg } from "@/lib/permissions";

/**
 * Org-scoped layout: user must belong to this org (any role) or be super_admin.
 * See docs/phase-2-permissions-2025-02-07.md and docs/phase-org-admin-routing-2025-02-07.md.
 */
export default async function OrgIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const userId = await getAuthenticatedUserId();
  if (!userId) redirect("/waitlist");
  const { orgId } = await params;
  const allowed = await canAccessOrg(userId, orgId);
  if (!allowed) redirect("/org");
  return <>{children}</>;
}
