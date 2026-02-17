import { Card } from "@/components/ui/card";
import { Target, CheckCircle2, Flame } from "lucide-react";
import type { PersonalStats } from "@/lib/dashboard-data";

type Props = {
  personalStats: PersonalStats;
};

export function DashboardStatsGrid({ personalStats }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-6 bg-card/80 backdrop-blur border-border/50 text-center">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-foreground">{personalStats.activeExperiments}</p>
        <p className="text-sm text-muted-foreground mt-1">Active</p>
      </Card>
      <Card className="p-6 bg-card/80 backdrop-blur border-border/50 text-center">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="text-2xl font-bold text-foreground">{personalStats.totalCompleted}</p>
        <p className="text-sm text-muted-foreground mt-1">Completed</p>
      </Card>
      <Card className="p-6 bg-card/80 backdrop-blur border-border/50 text-center">
        <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center mx-auto mb-3">
          <Flame className="w-5 h-5 text-coral" />
        </div>
        <p className="text-2xl font-bold text-foreground">{personalStats.currentStreak}</p>
        <p className="text-sm text-muted-foreground mt-1">Day Streak</p>
      </Card>
    </div>
  );
}
