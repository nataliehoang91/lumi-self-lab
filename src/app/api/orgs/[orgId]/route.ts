import { NextResponse } from "next/server";
import { getAuthenticatedUserId, canAccessOrg, getOrgMembership } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/orgs/[orgId] — Org basic info for a member (read-only).
 * Returns 404 if org does not exist or user is not a member.
 * See docs/phase-3-org-core-readonly-2025-02-07.md.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orgId } = await params;

  const allowed = await canAccessOrg(userId, orgId);
  if (!allowed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [org, membership] = await Promise.all([
    prisma.organisation.findUnique({
      where: { id: orgId },
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            members: true,
            templates: true,
            experiments: true,
          },
        },
      },
    }),
    getOrgMembership(userId, orgId),
  ]);

  if (!org) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: org.id,
    name: org.name,
    description: org.description ?? null,
    role: (membership?.role ?? "member") as "member" | "team_manager" | "org_admin",
    memberCount: org._count.members,
    totalTemplates: org._count.templates,
    activeExperiments: org._count.experiments,
    avgCompletionRate: null, // Placeholder; no aggregation in Phase 3
  });
}
