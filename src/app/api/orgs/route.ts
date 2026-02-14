import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/orgs — Create an organisation (Phase 4.1).
 * Permission: authenticated; User.accountType MUST be "organisation" (else 403).
 * Creator becomes org_admin. See docs/phase-4-1-create-organisation-2025-02-07.md.
 */
export async function POST(req: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { accountType: true },
  });
  if (!user || user.accountType !== "organisation") {
    return NextResponse.json(
      { error: "Upgrade required to create an organisation" },
      { status: 403 }
    );
  }

  let body: { name?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  const description = typeof body.description === "string" ? body.description.trim() || null : null;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organisation.create({
        data: {
          name,
          description,
          createdBy: userId,
        },
      });
      await tx.organisationMember.create({
        data: {
          organisationId: org.id,
          clerkUserId: userId,
          role: "org_admin",
        },
      });
      return org;
    });

    return NextResponse.json(
      {
        id: result.id,
        name: result.name,
        description: result.description ?? null,
        role: "org_admin",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/orgs error:", err);
    return NextResponse.json({ error: "Failed to create organisation" }, { status: 500 });
  }
}

/**
 * GET /api/orgs — List organisations the current user belongs to (read-only).
 * Permission: authenticated user; returns only orgs where user has membership.
 * See docs/phase-3-org-core-readonly-2025-02-07.md.
 */
export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memberships = await prisma.organisationMember.findMany({
    where: { clerkUserId: userId },
    include: {
      organisation: {
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
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  const organisations = memberships.map((m) => ({
    id: m.organisation.id,
    name: m.organisation.name,
    description: m.organisation.description ?? null,
    role: m.role as "member" | "team_manager" | "org_admin",
    joinedAt: m.joinedAt.toISOString(),
    memberCount: m.organisation._count.members,
    templatesCount: m.organisation._count.templates,
    experimentsCount: m.organisation._count.experiments,
  }));

  return NextResponse.json({ organisations });
}
