import { Card } from "@/components/ui/card";
import { Target, CheckCircle2, Flame } from "lucide-react";
import type { PersonalStats } from "@/lib/dashboard-data";

type Props = {
  personalStats: PersonalStats;
};

export function DashboardStatsGrid({ personalStats }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-card/80 border-border/50 p-6 text-center backdrop-blur">
        <div
          className="bg-primary/10 mx-auto mb-3 flex h-10 w-10 items-center justify-center
            rounded-xl"
        >
          <Target className="text-primary h-5 w-5" />
        </div>
        <p className="text-foreground text-2xl font-bold">
          {personalStats.activeExperiments}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">Active</p>
      </Card>
      <Card className="bg-card/80 border-border/50 p-6 text-center backdrop-blur">
        <div
          className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl
            bg-emerald-500/10"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="text-foreground text-2xl font-bold">
          {personalStats.totalCompleted}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">Completed</p>
      </Card>
      <Card className="bg-card/80 border-border/50 p-6 text-center backdrop-blur">
        <div
          className="bg-coral/10 mx-auto mb-3 flex h-10 w-10 items-center justify-center
            rounded-xl"
        >
          <Flame className="text-coral h-5 w-5" />
        </div>
        <p className="text-foreground text-2xl font-bold">
          {personalStats.currentStreak}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">Day Streak</p>
      </Card>
    </div>
  );
}
