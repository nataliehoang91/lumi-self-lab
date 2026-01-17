import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/experiments
 * Get all experiments for the current user
 * 
 * Query params:
 * - status: filter by status (draft | active | completed)
 * - tags: comma-separated tags to filter by (optional - if you add tags field later)
 * - search: search term for title/description (optional)
 */
export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const searchTerm = searchParams.get("search");

    const where: any = { clerkUserId: userId };

    // Filter by status if provided
    if (statusFilter) {
      where.status = statusFilter;
    }

    // Search in title/whyMatters/hypothesis if provided
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { whyMatters: { contains: searchTerm, mode: "insensitive" } },
        { hypothesis: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    const experiments = await prisma.experiment.findMany({
      where,
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
        checkIns: {
          orderBy: { checkInDate: "desc" },
          take: 1, // Get the most recent check-in
        },
      },
      orderBy: { updatedAt: "desc" },
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
 * 
 * Body:
 * {
 *   title: string
 *   whyMatters?: string
 *   hypothesis?: string
 *   durationDays: number
 *   frequency: string (daily | every-2-days | weekly)
 *   faithEnabled?: boolean
 *   scriptureNotes?: string
 *   status?: string (draft | active | completed)
 *   fields?: Array<{
 *     label: string
 *     type: string
 *     required?: boolean
 *     order: number
 *     textType?: string (short | long)
 *     minValue?: number
 *     maxValue?: number
 *     emojiCount?: number (3 | 5 | 7)
 *     selectOptions?: string[]
 *   }>
 * }
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
      status,
      fields,
    } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!durationDays || typeof durationDays !== "number") {
      return NextResponse.json(
        { error: "durationDays is required and must be a number" },
        { status: 400 }
      );
    }

    if (!frequency || typeof frequency !== "string") {
      return NextResponse.json(
        { error: "frequency is required" },
        { status: 400 }
      );
    }

    // Create experiment with fields
    const experiment = await prisma.experiment.create({
      data: {
        clerkUserId: userId,
        title,
        whyMatters: whyMatters || null,
        hypothesis: hypothesis || null,
        durationDays,
        frequency,
        faithEnabled: faithEnabled || false,
        scriptureNotes: scriptureNotes || null,
        status: status || "draft",
        fields: {
          create: fields?.map((field: any) => ({
            label: field.label,
            type: field.type,
            required: field.required || false,
            order: field.order,
            textType: field.textType || null,
            minValue: field.minValue || null,
            maxValue: field.maxValue || null,
            emojiCount: field.emojiCount || null,
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
