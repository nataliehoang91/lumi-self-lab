import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
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
          { status: 500 }
        );
      }
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (user) {
      // User exists - check if already upgraded
      if (user.accountType === "organisation") {
        return NextResponse.json(
          { error: "User is already an organisation account" },
          { status: 400 }
        );
      }

      // Upgrade to organisation account
      user = await prisma.user.update({
        where: { clerkUserId: userId },
        data: {
          accountType: "organisation",
          upgradedAt: new Date(),
        },
      });
    } else {
      // User doesn't exist - create with organisation account type
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          accountType: "organisation",
          upgradedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        accountType: user.accountType,
        upgradedAt: user.upgradedAt,
      },
    });
  } catch (error) {
    console.error("Error upgrading user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error("Error details:", errorDetails);
    return NextResponse.json(
      { error: "Failed to upgrade account", details: errorMessage },
      { status: 500 }
    );
  }
}
