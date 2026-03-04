import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  Users,
  Sparkles,
  TrendingUp,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import type { PersonalStats, TeamStats, DashboardUserData } from "@/lib/dashboard-data";

type Props = {
  displayName: string;
  personalStats: PersonalStats;
  teamStats: TeamStats;
  userData: DashboardUserData;
  orgHref: string;
};

export function DashboardTeamManagerView({
  displayName,
  personalStats,
  teamStats,
  userData,
  orgHref,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-2xl font-medium">
          Welcome back, {displayName}
        </h1>
        <p className="text-muted-foreground text-sm">
          Managing {teamStats.teamName} · {teamStats.memberCount} members
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="bg-card border-border/50 rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-3">
            <div
              className="bg-primary/10 flex h-10 w-10 items-center justify-center
                rounded-xl"
            >
              <Target className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-foreground text-2xl font-bold">
                {personalStats.activeExperiments}
              </p>
              <p className="text-muted-foreground text-xs">Personal</p>
            </div>
          </div>
        </Card>
        <Card className="bg-card border-border/50 rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl
                bg-emerald-500/10"
            >
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-foreground text-2xl font-bold">
                {teamStats.memberCount}
              </p>
              <p className="text-muted-foreground text-xs">Team Members</p>
            </div>
          </div>
        </Card>
        <Card className="bg-card border-border/50 rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-3">
            <div
              className="bg-second/10 flex h-10 w-10 items-center justify-center
                rounded-xl"
            >
              <Sparkles className="text-second h-5 w-5" />
            </div>
            <div>
              <p className="text-foreground text-2xl font-bold">
                {teamStats.activeExperiments}
              </p>
              <p className="text-muted-foreground text-xs">Team Experiments</p>
            </div>
          </div>
        </Card>
        <Card className="bg-card border-border/50 rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl
                bg-orange-500/10"
            >
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-foreground text-2xl font-bold">
                {teamStats.avgCompletion}%
              </p>
              <p className="text-muted-foreground text-xs">Team Avg</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border/50 rounded-3xl p-6">
          <h2 className="text-foreground mb-4 text-lg font-semibold">Team Performance</h2>
          <div className="space-y-4">
            <div className="pt-4">
              <p className="text-muted-foreground mb-2 text-sm">Top Performer</p>
              <p className="text-foreground text-lg font-semibold">
                {teamStats.topPerformer}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full gap-2 rounded-2xl bg-transparent"
              asChild
            >
              <Link href={orgHref}>
                <BarChart3 className="h-4 w-4" />
                View Full Team Dashboard
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="bg-card border-border/50 rounded-3xl p-6">
          <h2 className="text-foreground mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-3 rounded-2xl bg-transparent
                py-3"
              asChild
            >
              <Link href="/org">
                <AlertCircle className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Pending Assignments</div>
                  <div className="text-muted-foreground text-xs">
                    {userData.pendingAssignments} experiments waiting
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-3 rounded-2xl bg-transparent
                py-3"
              asChild
            >
              <Link href={orgHref}>
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Manage Team</div>
                  <div className="text-muted-foreground text-xs">
                    View members and assign experiments
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
