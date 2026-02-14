import { NextResponse } from "next/server";
import { getAuthenticatedUserId, canAccessOrg, canActAsOrgAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const ROLES = ["member", "team_manager", "org_admin"] as const;

/**
 * GET /api/orgs/[orgId]/members — List organisation members (Phase 4.2).
 * Permission: canAccessOrg.
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

  const org = await prisma.organisation.findUnique({
    where: { id: orgId },
    select: { id: true },
  });
  if (!org) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const rows = await prisma.organisationMember.findMany({
    where: { organisationId: orgId },
    include: {
      user: { select: { email: true } },
    },
    orderBy: { joinedAt: "asc" },
  });

  const members = rows.map((m) => ({
    id: m.id,
    clerkUserId: m.clerkUserId,
    email: m.user.email ?? null,
    role: m.role as "member" | "team_manager" | "org_admin",
    joinedAt: m.joinedAt.toISOString(),
  }));

  return NextResponse.json({ members });
}

/**
 * POST /api/orgs/[orgId]/members — Add member by email (Phase 4.2).
 * Permission: canActAsOrgAdmin.
 */
export async function POST(req: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orgId } = await params;

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

  let body: { email?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const roleInput =
    typeof body.role === "string" && ROLES.includes(body.role as (typeof ROLES)[number])
      ? (body.role as (typeof ROLES)[number])
      : "member";

  const existingUser = await prisma.user.findFirst({
    where: { email },
    select: { clerkUserId: true },
  });

  if (!existingUser) {
    return NextResponse.json(
      { error: "User not found. Invitation flow not implemented yet." },
      { status: 400 }
    );
  }

  const existingMember = await prisma.organisationMember.findUnique({
    where: {
      organisationId_clerkUserId: {
        organisationId: orgId,
        clerkUserId: existingUser.clerkUserId,
      },
    },
  });

  if (existingMember) {
    return NextResponse.json(
      { error: "User is already a member of this organisation" },
      { status: 409 }
    );
  }

  const member = await prisma.organisationMember.create({
    data: {
      organisationId: orgId,
      clerkUserId: existingUser.clerkUserId,
      role: roleInput,
    },
  });

  return NextResponse.json(
    {
      id: member.id,
      email,
      role: member.role,
    },
    { status: 201 }
  );
}
