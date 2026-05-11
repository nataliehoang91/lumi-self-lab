import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { ExperimentsList } from "@/components/experiments-list";
import { SetSecondaryNavbar } from "@/components/SetSecondaryNavbar";
import { getExperimentsData } from "@/lib/experiments-data";
import { getActiveExperimentCount, FREE_ACTIVE_EXPERIMENT_LIMIT } from "@/lib/experiment-limits";
import { auth } from "@clerk/nextjs/server";

function LimitBanner() {
  return (
    <div
      className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-500/30
        bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200"
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>
        You&apos;ve reached the limit of {FREE_ACTIVE_EXPERIMENT_LIMIT} active experiments.
        Complete or archive an existing experiment to start a new one.
      </span>
    </div>
  );
}

/**
 * Experiments Page - Server Component
 * Data fetched server-side via getExperimentsData (auth + Prisma)
 * Page header is set in the secondary navbar via SetSecondaryNavbar.
 */
export default async function ExperimentsPage() {
  const { userId } = await auth();
  const [uiExperiments, activeCount] = await Promise.all([
    getExperimentsData(),
    userId ? getActiveExperimentCount(userId) : Promise.resolve(0),
  ]);

  return (
    <div className="min-h-screen">
      <SetSecondaryNavbar>
        <div className="flex w-full items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-foreground truncate text-lg font-bold sm:text-2xl">Your Experiments</h2>
            <p className="text-muted-foreground hidden text-sm sm:block">
              Track your journey of self-discovery and personal insights
            </p>
          </div>
          <Button asChild size="sm" variant="gradientSecond" className="shrink-0">
            <Link href="/experiments/create">
              <Plus className="mr-1 h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Design an Experiment</span>
              <span className="sm:hidden">New</span>
            </Link>
          </Button>
        </div>
      </SetSecondaryNavbar>

      <div className="container mx-auto max-w-4xl px-4 py-6">
        {activeCount >= FREE_ACTIVE_EXPERIMENT_LIMIT && <LimitBanner />}
      </div>

      <ExperimentsList experiments={uiExperiments} />
    </div>
  );
}
