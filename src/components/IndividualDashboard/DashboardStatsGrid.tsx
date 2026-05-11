import { Card } from "@/components/ui/card";
import { Target, CheckCircle2, Flame } from "lucide-react";
import type { PersonalStats } from "@/lib/dashboard-data";

type Props = {
  personalStats: PersonalStats;
};

export function DashboardStatsGrid({ personalStats }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      <Card className="bg-card/80 border-border/50 p-3 text-center backdrop-blur sm:p-6">
        <div className="bg-primary/10 mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl sm:mb-3 sm:h-10 sm:w-10">
          <Target className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <p className="text-foreground text-xl font-bold sm:text-2xl">
          {personalStats.activeExperiments}
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs sm:mt-1 sm:text-sm">Active</p>
      </Card>
      <Card className="bg-card/80 border-border/50 p-3 text-center backdrop-blur sm:p-6">
        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 sm:mb-3 sm:h-10 sm:w-10">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 sm:h-5 sm:w-5" />
        </div>
        <p className="text-foreground text-xl font-bold sm:text-2xl">
          {personalStats.totalCompleted}
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs sm:mt-1 sm:text-sm">Completed</p>
      </Card>
      <Card className="bg-card/80 border-border/50 p-3 text-center backdrop-blur sm:p-6">
        <div className="bg-coral/10 mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl sm:mb-3 sm:h-10 sm:w-10">
          <Flame className="text-coral h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <p className="text-foreground text-xl font-bold sm:text-2xl">
          {personalStats.currentStreak}
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs sm:mt-1 sm:text-sm">Day Streak</p>
      </Card>
    </div>
  );
}
