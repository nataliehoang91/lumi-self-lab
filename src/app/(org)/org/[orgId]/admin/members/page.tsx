import { OrgMembersClient } from "./OrgMembersClient";

/**
 * Org admin: manage members (Phase 4.2).
 * Route: /org/[orgId]/admin/members
 * Access: guarded by canActAsOrgAdmin in admin/layout.tsx.
 */
export default async function OrgAdminMembersPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <OrgMembersClient orgId={orgId} />;
}
