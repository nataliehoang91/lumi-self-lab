import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/experiments
 * Get all experiments for the current user
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const experiments = await prisma.experiment.findMany({
      where: { userId },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
        checkins: {
          orderBy: { checkinDate: "desc" },
          take: 1, // Get the most recent check-in
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(experiments);
  } catch (error) {
    console.error("Error fetching experiments:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/experiments
 * Create a new experiment
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      whyMatters,
      hypothesis,
      durationDays,
      frequency,
      faithEnabled,
      scriptureNotes,
      fields,
    } = body;

    // Create experiment with fields
    const experiment = await prisma.experiment.create({
      data: {
        userId,
        title,
        whyMatters,
        hypothesis,
        durationDays: parseInt(durationDays),
        frequency,
        faithEnabled: faithEnabled || false,
        scriptureNotes,
        status: "draft",
        fields: {
          create: fields?.map((field: any, index: number) => ({
            label: field.label,
            type: field.type,
            required: field.required || false,
            order: index,
            textType: field.textType,
            emojiCount: field.emojiCount,
            minValue: field.minValue,
            maxValue: field.maxValue,
            selectOptions: field.selectOptions || [],
          })) || [],
        },
      },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(experiment, { status: 201 });
  } catch (error) {
    console.error("Error creating experiment:", error);
    return NextResponse.json(
      { error: "Failed to create experiment" },
      { status: 500 }
    );
  }
}
