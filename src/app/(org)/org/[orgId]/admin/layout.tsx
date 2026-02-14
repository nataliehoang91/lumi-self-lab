import { redirect } from "next/navigation";
import { getAuthenticatedUserId, canActAsOrgAdmin } from "@/lib/permissions";

/**
 * Org-admin layout: only org_admin (or super_admin) may access /org/[orgId]/admin/*.
 * See docs/phase-2-permissions-2025-02-07.md and docs/phase-org-admin-routing-2025-02-07.md.
 */
export default async function OrgAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const userId = await getAuthenticatedUserId();
  if (!userId) redirect("/waitlist");
  const { orgId } = await params;
  const allowed = await canActAsOrgAdmin(userId, orgId);
  if (!allowed) redirect(`/org/${orgId}`);
  return <>{children}</>;
}
