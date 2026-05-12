import { Card } from "@/components/ui/card";
import { Target, CheckCircle2, Flame } from "lucide-react";
import type { PersonalStats } from "@/lib/dashboard-data";

type Props = {
  personalStats: PersonalStats;
};

export function DashboardStatsGrid({ personalStats }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-1 lg:gap-3">
      <Card className="bg-card/80 border-border/50 p-3 text-center backdrop-blur sm:p-4 lg:flex lg:items-center lg:gap-4 lg:text-left">
        <div className="bg-primary/10 mx-auto mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl lg:mx-0 lg:mb-0">
          <Target className="text-primary h-5 w-5" />
        </div>
        <div>
          <p className="text-foreground text-xl font-bold lg:text-2xl">
            {personalStats.activeExperiments}
          </p>
          <p className="text-muted-foreground text-xs lg:text-sm">Active Experiments</p>
        </div>
      </Card>
      <Card className="bg-card/80 border-border/50 p-3 text-center backdrop-blur sm:p-4 lg:flex lg:items-center lg:gap-4 lg:text-left">
        <div className="mx-auto mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 lg:mx-0 lg:mb-0">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-foreground text-xl font-bold lg:text-2xl">
            {personalStats.totalCompleted}
          </p>
          <p className="text-muted-foreground text-xs lg:text-sm">Completed</p>
        </div>
      </Card>
      <Card className="bg-card/80 border-border/50 p-3 text-center backdrop-blur sm:p-4 lg:flex lg:items-center lg:gap-4 lg:text-left">
        <div className="bg-coral/10 mx-auto mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl lg:mx-0 lg:mb-0">
          <Flame className="text-coral h-5 w-5" />
        </div>
        <div>
          <p className="text-foreground text-xl font-bold lg:text-2xl">
            {personalStats.currentStreak}
          </p>
          <p className="text-muted-foreground text-xs lg:text-sm">Day Streak</p>
        </div>
      </Card>
    </div>
  );
}
