import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlaskConical, Plus } from "lucide-react";
import { ExperimentsList } from "@/components/experiments-list";

/**
 * Experiments Page - Server Component
 * Fetches experiments directly from database using Prisma
 */
export default async function ExperimentsPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Unauthorized</p>
      </div>
    );
  }

  // Fetch all experiments from database
  // Use _count to get check-ins count efficiently without loading all check-ins
  const experiments = await prisma.experiment.findMany({
    where: { clerkUserId: userId },
    include: {
      _count: {
        select: {
          checkIns: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Transform database format to UI format
  const uiExperiments = experiments.map((exp) => {
    // Calculate daysCompleted from total check-ins count
    const daysCompleted = exp._count.checkIns;

    // Format startDate
    const startDate = exp.startedAt
      ? new Date(exp.startedAt).toISOString().split("T")[0]
      : null;

    return {
      id: exp.id,
      title: exp.title,
      status: exp.status,
      duration: exp.durationDays,
      frequency: exp.frequency,
      daysCompleted,
      startDate,
      hypothesis: exp.hypothesis || "",
    };
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <FlaskConical className="w-8 h-8 text-secondary" />
              <h1 className="text-3xl font-bold text-foreground">Self-Lab</h1>
            </Link>
          </div>
          <Button asChild>
            <Link href="/dashboard">
              <Plus className="w-4 h-4 mr-2" />
              New Experiment
            </Link>
          </Button>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Your Experiments
          </h2>
          <p className="text-muted-foreground text-lg">
            Track your journey of self-discovery and personal insights
          </p>
        </div>

        {/* Experiments List with Filters (Client Component) */}
        <ExperimentsList experiments={uiExperiments} />
      </div>
    </div>
  );
}
