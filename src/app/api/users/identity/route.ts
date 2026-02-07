import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Personal only: returns the current user and their org memberships.
 * Permission: canAccessPersonalData (caller must be authenticated; no role check).
 * No admin override to fetch another user's data; that would require super_admin and a separate endpoint.
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure database connection is active
    try {
      await prisma.$connect();
    } catch (connectError) {
      console.error("Database connection error:", connectError);
      // Try to reconnect
      try {
        await prisma.$disconnect();
        await prisma.$connect();
      } catch (retryError) {
        console.error("Failed to reconnect:", retryError);
        return NextResponse.json(
          {
            error: "Database connection error",
            details: "Unable to connect to database",
          },
          { status: 500 },
        );
      }
    }

    // Get email from Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email =
      clerkUser.emailAddresses.find(
        (e: { id: string }) => e.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress ?? null;

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        organisationMemberships: {
          include: {
            organisation: true,
          },
        },
        experiments: {
          where: {
            organisationId: { not: null },
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      // Create user if doesn't exist (default to individual)
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: email,
          accountType: "individual",
        },
        include: {
          organisationMemberships: {
            include: {
              organisation: true,
            },
          },
          experiments: {
            where: { organisationId: { not: null } },
            select: { id: true },
          },
        },
      });
    } else if (user.email !== email) {
      // Update email if it changed in Clerk
      user = await prisma.user.update({
        where: { clerkUserId: userId },
        data: { email: email },
        include: {
          organisationMemberships: {
            include: {
              organisation: true,
            },
          },
          experiments: {
            where: {
              organisationId: { not: null },
            },
            select: {
              id: true,
            },
          },
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found after create" },
        { status: 500 },
      );
    }

    // Check if user is a participant (has org memberships OR has experiments linked to orgs)
    const hasOrgMemberships = user.organisationMemberships.length > 0;
    const hasOrgLinkedExperiments =
      "experiments" in user && Array.isArray(user.experiments)
        ? user.experiments.length > 0
        : false;
    const isParticipant = hasOrgMemberships || hasOrgLinkedExperiments;

    // Role may be undefined if Prisma client was generated before role column existed - run: npx prisma generate
    const role = (user as { role?: string }).role ?? "user";
    // Super admin: treat as upgraded for API (full access)
    const upgradedAt =
      role === "super_admin"
        ? user.upgradedAt ?? user.createdAt
        : user.upgradedAt;

    return NextResponse.json({
      id: user.id,
      clerkUserId: user.clerkUserId,
      email: user.email,
      accountType: user.accountType,
      role, // user | super_admin (global admin)
      upgradedAt,
      organisations: user.organisationMemberships.map((membership) => ({
        id: membership.organisation.id,
        name: membership.organisation.name,
        description: membership.organisation.description,
        role: membership.role, // member | team_manager | org_admin
        ...(membership.teamId && { teamId: membership.teamId }), // Only if exists
        ...(membership.teamName && { teamName: membership.teamName }), // Only if exists
        joinedAt: membership.joinedAt.toISOString(),
      })),
      isParticipant, // True if has org memberships or org-linked experiments
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("Error details:", errorDetails);
    return NextResponse.json(
      { error: "Failed to fetch user", details: errorMessage },
      { status: 500 },
    );
  }
}
