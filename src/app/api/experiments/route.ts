import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/permissions";
import { NextResponse } from "next/server";

/**
 * GET /api/experiments
 * Personal only: list experiments owned by the current user (clerkUserId).
 * No org or manager role grants access; experiments are always user-owned.
 *
 * Query params:
 * - status: filter by status (draft | active | completed)
 * - tags: comma-separated tags to filter by (optional - if you add tags field later)
 * - search: search term for title/description (optional)
 */
export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const searchTerm = searchParams.get("search");

    const where: {
      clerkUserId: string;
      status?: string;
      OR?: Array<{
        title?: { contains: string; mode: "insensitive" };
        whyMatters?: { contains: string; mode: "insensitive" };
        hypothesis?: { contains: string; mode: "insensitive" };
      }>;
    } = { clerkUserId: userId };

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

    // Sort experiments: active status first, then by updatedAt desc
    const sortedExperiments = [...experiments].sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (a.status !== "active" && b.status === "active") return 1;
      // If both have same status priority, keep original order (updatedAt desc)
      return 0;
    });

    return NextResponse.json(sortedExperiments);
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
 * Personal only: create an experiment owned by the current user. Ownership is
 * fixed to clerkUserId; organisationId is not set here (future link API).
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
 *   fields?: Array<{...}>
 * }
 */
export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
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
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
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

    // Ensure User record exists (auto-create if doesn't exist)
    await prisma.user.upsert({
      where: { clerkUserId: userId },
      update: {},
      create: {
        clerkUserId: userId,
        accountType: "individual",
      },
    });

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
          create:
            fields?.map(
              (field: {
                label: string;
                type: string;
                required?: boolean;
                order: number;
                textType?: string;
                minValue?: number;
                maxValue?: number;
                emojiCount?: number;
                selectOptions?: string[];
              }) => ({
                label: field.label,
                type: field.type,
                required: field.required || false,
                order: field.order,
                textType: field.textType || null,
                minValue: field.minValue || null,
                maxValue: field.maxValue || null,
                emojiCount: field.emojiCount || null,
                selectOptions: field.selectOptions || [],
              })
            ) || [],
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
