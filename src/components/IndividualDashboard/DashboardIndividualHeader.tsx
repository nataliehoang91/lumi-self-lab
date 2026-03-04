import { Target, CheckCircle2, Flame } from "lucide-react";
import type { PersonalStats } from "@/lib/dashboard-data";

type Props = {
  displayName: string;
  personalStats: PersonalStats;
};

export function DashboardIndividualHeader({ displayName, personalStats }: Props) {
  return (
    <div className="mb-8">
      <h1 className="text-foreground mb-4 text-3xl font-bold">
        Welcome back, {displayName}
      </h1>
      <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-2">
          <Target className="text-second h-4 w-4 shrink-0" />
          <span className="text-foreground font-bold">
            {personalStats.activeExperiments}
          </span>{" "}
          active
        </span>
        <span className="flex items-center gap-2">
          <CheckCircle2 className="text-success h-4 w-4 shrink-0" />
          <span className="text-foreground font-bold">
            {personalStats.totalCompleted}
          </span>{" "}
          completed
        </span>
        {personalStats.currentStreak > 0 && (
          <span className="flex items-center gap-2">
            <Flame className="text-coral h-4 w-4 shrink-0" />
            <span className="text-foreground font-bold">
              {personalStats.currentStreak}
            </span>{" "}
            day streak
          </span>
        )}
      </div>
    </div>
  );
}
