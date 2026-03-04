import { NextResponse } from "next/server";
import {
  getAuthenticatedUserId,
  canActAsOrgAdmin,
  requireSuperAdmin,
} from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const ROLES = ["member", "team_manager", "org_admin"] as const;

async function getMemberAndOrgAdminCount(orgId: string, memberId: string) {
  const [member, adminCount] = await Promise.all([
    prisma.organisationMember.findFirst({
      where: { id: memberId, organisationId: orgId },
      select: { id: true, role: true },
    }),
    prisma.organisationMember.count({
      where: { organisationId: orgId, role: "org_admin" },
    }),
  ]);
  return { member, adminCount };
}

/**
 * PATCH /api/orgs/[orgId]/members/[memberId] — Update member role (Phase 4.2).
 * Permission: canActAsOrgAdmin. Cannot demote the last org_admin (super_admin bypasses).
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orgId: string; memberId: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orgId, memberId } = await params;

  const allowed = await canActAsOrgAdmin(userId, orgId);
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const org = await prisma.organisation.findUnique({
    where: { id: orgId },
    select: { id: true },
  });
  if (!org) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: { role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const role =
    typeof body.role === "string" && ROLES.includes(body.role as (typeof ROLES)[number])
      ? (body.role as (typeof ROLES)[number])
      : null;
  if (!role) {
    return NextResponse.json(
      { error: "role must be one of: member, team_manager, org_admin" },
      { status: 400 }
    );
  }

  const { member, adminCount } = await getMemberAndOrgAdminCount(orgId, memberId);
  if (!member) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isSuperAdmin = await requireSuperAdmin(userId);
  if (member.role === "org_admin" && adminCount <= 1 && role !== "org_admin") {
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Cannot demote the last org admin" },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.organisationMember.update({
    where: { id: memberId },
    data: { role },
  });

  return NextResponse.json({
    id: updated.id,
    role: updated.role,
  });
}

/**
 * DELETE /api/orgs/[orgId]/members/[memberId] — Remove member (Phase 4.2).
 * Permission: canActAsOrgAdmin. Cannot remove the last org_admin (super_admin bypasses).
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ orgId: string; memberId: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orgId, memberId } = await params;

  const allowed = await canActAsOrgAdmin(userId, orgId);
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const org = await prisma.organisation.findUnique({
    where: { id: orgId },
    select: { id: true },
  });
  if (!org) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { member, adminCount } = await getMemberAndOrgAdminCount(orgId, memberId);
  if (!member) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isSuperAdmin = await requireSuperAdmin(userId);
  if (member.role === "org_admin" && adminCount <= 1) {
    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Cannot remove the last org admin" },
        { status: 400 }
      );
    }
  }

  await prisma.organisationMember.delete({
    where: { id: memberId },
  });

  return NextResponse.json({ success: true });
}
