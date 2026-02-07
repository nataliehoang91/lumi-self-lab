import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/org-invites/[token]/accept — Accept invite (Phase 5).
 * Auth required. Invite email must match signed-in user email.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await params;

  const invite = await prisma.organisationInvite.findUnique({
    where: { token },
    include: { organisation: { select: { id: true, name: true } } },
  });

  if (!invite) {
    return NextResponse.json(
      { error: "Invalid or expired invite" },
      { status: 404 }
    );
  }

  if (invite.acceptedAt) {
    return NextResponse.json(
      { error: "This invite has already been accepted" },
      { status: 404 }
    );
  }

  const now = new Date();
  if (invite.expiresAt < now) {
    return NextResponse.json(
      { error: "This invite has expired" },
      { status: 404 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { email: true },
  });

  if (!user?.email) {
    return NextResponse.json(
      { error: "Your account has no email; cannot match invite" },
      { status: 403 }
    );
  }

  const inviteEmailLower = invite.email.toLowerCase();
  const userEmailLower = user.email.trim().toLowerCase();
  if (inviteEmailLower !== userEmailLower) {
    return NextResponse.json(
      { error: "This invite was sent to a different email address" },
      { status: 403 }
    );
  }

  const existingMember = await prisma.organisationMember.findUnique({
    where: {
      organisationId_clerkUserId: {
        organisationId: invite.organisationId,
        clerkUserId: userId,
      },
    },
  });

  if (existingMember) {
    return NextResponse.json(
      { error: "You are already a member of this organisation" },
      { status: 409 }
    );
  }

  await prisma.$transaction([
    prisma.organisationMember.create({
      data: {
        organisationId: invite.organisationId,
        clerkUserId: userId,
        role: invite.role,
      },
    }),
    prisma.organisationInvite.update({
      where: { id: invite.id },
      data: { acceptedAt: now },
    }),
  ]);

  return NextResponse.json({
    success: true,
    organisationId: invite.organisationId,
    organisationName: invite.organisation.name,
    role: invite.role,
  });
}
