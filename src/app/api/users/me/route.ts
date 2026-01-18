import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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
          { error: "Database connection error", details: "Unable to connect to database" },
          { status: 500 }
        );
      }
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        organisationMemberships: {
          include: {
            organisation: true,
          },
        },
      },
    });

    if (!user) {
      // Create user if doesn't exist (default to individual)
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          accountType: "individual",
        },
        include: {
          organisationMemberships: {
            include: {
              organisation: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      id: user.id,
      clerkUserId: user.clerkUserId,
      accountType: user.accountType,
      upgradedAt: user.upgradedAt,
      organisations: user.organisationMemberships.map((membership) => ({
        id: membership.organisation.id,
        name: membership.organisation.name,
        description: membership.organisation.description,
        role: membership.role,
        joinedAt: membership.joinedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("Error details:", errorDetails);
    return NextResponse.json(
      { error: "Failed to fetch user", details: errorMessage },
      { status: 500 }
    );
  }
}
