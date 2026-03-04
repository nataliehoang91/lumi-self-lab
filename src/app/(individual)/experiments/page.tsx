import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ExperimentsList } from "@/components/experiments-list";
import { SetSecondaryNavbar } from "@/components/SetSecondaryNavbar";
import { getExperimentsData } from "@/lib/experiments-data";

/**
 * Experiments Page - Server Component
 * Data fetched server-side via getExperimentsData (auth + Prisma)
 * Page header is set in the secondary navbar via SetSecondaryNavbar.
 */
export default async function ExperimentsPage() {
  const uiExperiments = await getExperimentsData();

  return (
    <div className="min-h-screen">
      <SetSecondaryNavbar>
        <div className="flex w-full items-center justify-between">
          <div>
            <h2 className="text-foreground text-2xl font-bold">Your Experiments</h2>
            <p className="text-muted-foreground text-sm">
              Track your journey of self-discovery and personal insights
            </p>
          </div>
          <Button asChild size="sm" variant="gradientSecond">
            <Link href="/experiments/create">
              <Plus className="mr-2 h-4 w-4" />
              Design an Experiment
            </Link>
          </Button>
        </div>
      </SetSecondaryNavbar>

      <ExperimentsList experiments={uiExperiments} />
    </div>
  );
}
