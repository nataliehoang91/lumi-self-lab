/**
 * Phase T.1 — POST create experiment from system template.
 * Auth required. Creates a new Experiment (draft) for the current user;
 * copies template title, durationDays, frequency, and fields. Does NOT start the experiment.
 */

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { templateId } = await params;

    const template = await prisma.experimentTemplate.findUnique({
      where: { id: templateId },
      include: {
        fields: { orderBy: { order: "asc" } },
      },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    await prisma.user.upsert({
      where: { clerkUserId: userId },
      update: {},
      create: {
        clerkUserId: userId,
        accountType: "individual",
      },
    });

    const durationDays = template.durationDays ?? 14;
    const frequency = template.frequency ?? "daily";

    const experiment = await prisma.experiment.create({
      data: {
        clerkUserId: userId,
        title: template.title,
        whyMatters: null,
        hypothesis: null,
        durationDays,
        frequency,
        faithEnabled: false,
        scriptureNotes: null,
        status: "draft",
        startedAt: null,
        completedAt: null,
        fields: {
          create: template.fields.map((f) => ({
            label: f.label,
            type: f.type,
            required: f.required,
            order: f.order,
            textType: f.textType ?? null,
            minValue: f.minValue ?? null,
            maxValue: f.maxValue ?? null,
            emojiCount: f.emojiCount ?? null,
            selectOptions: f.selectOptions ?? [],
          })),
        },
      },
      include: {
        fields: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(experiment, { status: 201 });
  } catch (error) {
    console.error("Error creating experiment from template:", error);
    return NextResponse.json(
      { error: "Failed to create experiment from template" },
      { status: 500 }
    );
  }
}
