import { Target, CheckCircle2, Flame } from "lucide-react";
import type { PersonalStats } from "@/lib/dashboard-data";

type Props = {
  displayName: string;
  personalStats: PersonalStats;
};

export function DashboardIndividualHeader({ displayName, personalStats }: Props) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-4">Welcome back, {displayName}</h1>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Target className="w-4 h-4 text-second shrink-0" />
          <span className="font-bold text-foreground">{personalStats.activeExperiments}</span> active
        </span>
        <span className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          <span className="font-bold text-foreground">{personalStats.totalCompleted}</span>{" "}
          completed
        </span>
        {personalStats.currentStreak > 0 && (
          <span className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-coral shrink-0" />
            <span className="font-bold text-foreground">{personalStats.currentStreak}</span> day
            streak
          </span>
        )}
      </div>
    </div>
  );
}
