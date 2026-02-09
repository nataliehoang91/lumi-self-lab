/**
 * Phase T.1 + T.2 — GET system experiment templates (read-only).
 * Authenticated users only. Order: featured first, then by createdAt desc.
 */

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const templates = await prisma.experimentTemplate.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching experiment templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
