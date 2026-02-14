import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { ExperimentDetailClient } from "./ExperimentDetailClient";
import { notFound } from "next/navigation";
import type { UIExperimentDetail } from "@/types";

/**
 * Experiment Detail Page - Server Component
 * Fetches experiment data from database
 */
export default async function ExperimentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const { id } = await params;

  // Fetch experiment with fields and check-ins
  const experiment = await prisma.experiment.findFirst({
    where: {
      id,
      clerkUserId: userId,
    },
    include: {
      fields: {
        orderBy: { order: "asc" },
      },
      checkIns: {
        orderBy: { checkInDate: "desc" },
        include: {
          responses: {
            include: {
              field: true,
            },
          },
        },
      },
    },
  });

  if (!experiment) {
    notFound();
  }

  // Transform database format to UI format
  const uiExperiment: UIExperimentDetail = {
    id: experiment.id,
    title: experiment.title,
    status: experiment.status as "draft" | "active" | "completed",
    duration: experiment.durationDays,
    frequency: experiment.frequency as "daily" | "every-2-days" | "weekly",
    daysCompleted: experiment.checkIns.length,
    startDate: experiment.startedAt
      ? new Date(experiment.startedAt).toISOString().split("T")[0]
      : null,
    hypothesis: experiment.hypothesis || "",
    whyMatters: experiment.whyMatters || "",
    faithEnabled: experiment.faithEnabled,
    scriptureNotes: experiment.scriptureNotes || undefined,
    fields: experiment.fields.map((field) => ({
      id: field.id,
      label: field.label,
      type: field.type as "text" | "number" | "select" | "emoji" | "yesno",
      required: field.required,
      order: field.order,
      textType: field.textType as "short" | "long" | undefined,
      minValue: field.minValue || undefined,
      maxValue: field.maxValue || undefined,
      emojiCount: (field.emojiCount as 3 | 5 | 7 | undefined) || undefined,
      options: field.selectOptions || undefined,
    })),
    checkIns: experiment.checkIns.map((checkIn) => ({
      id: checkIn.id,
      checkInDate: checkIn.checkInDate.toISOString().split("T")[0],
      notes: checkIn.notes || undefined,
      aiSummary: checkIn.aiSummary || undefined,
      responses: checkIn.responses.map((response) => ({
        id: response.id,
        fieldId: response.fieldId,
        field: {
          id: response.field.id,
          label: response.field.label,
          type: response.field.type as "text" | "number" | "select" | "emoji" | "yesno",
          required: response.field.required,
          order: response.field.order,
          textType: response.field.textType as "short" | "long" | undefined,
          minValue: response.field.minValue || undefined,
          maxValue: response.field.maxValue || undefined,
          emojiCount: (response.field.emojiCount as 3 | 5 | 7 | undefined) || undefined,
          options: response.field.selectOptions || undefined,
        },
        responseText: response.responseText || undefined,
        responseNumber: response.responseNumber || undefined,
        responseBool: response.responseBool ?? undefined,
        selectedOption: response.selectedOption || undefined,
      })),
    })),
  };
  console.log(uiExperiment);
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading experiment...</p>
          </div>
        </div>
      }
    >
      <ExperimentDetailClient experiment={uiExperiment} />
    </Suspense>
  );
}
