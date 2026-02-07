import { NextResponse } from "next/server";
import { getAuthenticatedUserId, canActAsOrgAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

const ROLES = ["member", "team_manager", "org_admin"] as const;
const INVITE_EXPIRY_DAYS = 7;

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * POST /api/orgs/[orgId]/invites — Create invite (Phase 5).
 * Permission: canActAsOrgAdmin.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ orgId: string }> }
) {
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

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email) {
    return NextResponse.json(
      { error: "email is required" },
      { status: 400 }
    );
  }

  const roleInput =
    typeof body.role === "string" && ROLES.includes(body.role as (typeof ROLES)[number])
      ? (body.role as (typeof ROLES)[number])
      : "member";

  const userWithEmail = await prisma.user.findFirst({
    where: { email },
    select: { clerkUserId: true },
  });
  if (userWithEmail) {
    const existingMember = await prisma.organisationMember.findUnique({
      where: {
        organisationId_clerkUserId: {
          organisationId: orgId,
          clerkUserId: userWithEmail.clerkUserId,
        },
      },
    });
    if (existingMember) {
      return NextResponse.json(
        { error: "This user is already a member of this organisation" },
        { status: 409 }
      );
    }
  }

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + INVITE_EXPIRY_DAYS);

  const activeInvite = await prisma.organisationInvite.findFirst({
    where: {
      organisationId: orgId,
      email,
      acceptedAt: null,
      expiresAt: { gt: now },
    },
  });
  if (activeInvite) {
    return NextResponse.json(
      { error: "An active invite already exists for this email" },
      { status: 409 }
    );
  }

  const token = generateToken();
  const invite = await prisma.organisationInvite.create({
    data: {
      organisationId: orgId,
      email,
      role: roleInput,
      token,
      invitedBy: userId,
      expiresAt,
    },
  });

  return NextResponse.json(
    {
      id: invite.id,
      email: invite.email,
      role: invite.role,
      expiresAt: invite.expiresAt.toISOString(),
      token: invite.token,
    },
    { status: 201 }
  );
}

/**
 * GET /api/orgs/[orgId]/invites — List pending invites (Phase 5).
 * Permission: canActAsOrgAdmin.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orgId: string }> }
) {
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

  const now = new Date();
  const invites = await prisma.organisationInvite.findMany({
    where: {
      organisationId: orgId,
      acceptedAt: null,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    invites: invites.map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role as "member" | "team_manager" | "org_admin",
      expiresAt: i.expiresAt.toISOString(),
      createdAt: i.createdAt.toISOString(),
    })),
  });
}
