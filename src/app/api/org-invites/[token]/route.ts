import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/org-invites/[token] — Get invite details for display (Phase 5).
 * No auth required. Returns org name and role if invite is valid and not expired.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const invite = await prisma.organisationInvite.findUnique({
    where: { token },
    include: { organisation: { select: { id: true, name: true } } },
  });

  if (!invite) {
    return NextResponse.json({ error: "Invalid or expired invite" }, { status: 404 });
  }

  if (invite.acceptedAt) {
    return NextResponse.json({ error: "This invite has already been accepted" }, { status: 404 });
  }

  const now = new Date();
  if (invite.expiresAt < now) {
    return NextResponse.json({ error: "This invite has expired" }, { status: 404 });
  }

  return NextResponse.json({
    organisationId: invite.organisationId,
    organisationName: invite.organisation.name,
    email: invite.email,
    role: invite.role as "member" | "team_manager" | "org_admin",
    expiresAt: invite.expiresAt.toISOString(),
  });
}
