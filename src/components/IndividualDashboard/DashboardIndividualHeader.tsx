import { Target, CheckCircle2, Flame } from "lucide-react";
import type { PersonalStats } from "@/lib/dashboard-data";

type Props = {
  displayName: string;
  personalStats: PersonalStats;
};

export function DashboardIndividualHeader({ displayName, personalStats }: Props) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-4">
        Welcome back, {displayName}
      </h1>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          {personalStats.activeExperiments} active
        </span>
        <span className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {personalStats.totalCompleted} completed
        </span>
        {personalStats.currentStreak > 0 && (
          <span className="flex items-center gap-2">
            <Flame className="w-4 h-4" />
            {personalStats.currentStreak} day streak
          </span>
        )}
      </div>
    </div>
  );
}
