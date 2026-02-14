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
import type {
  PersonalStats,
  TeamStats,
  DashboardUserData,
} from "@/lib/dashboard-data";

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
        <h1 className="text-2xl font-medium text-foreground mb-2">
          Welcome back, {displayName}
        </h1>
        <p className="text-muted-foreground text-sm">
          Managing {teamStats.teamName} · {teamStats.memberCount} members
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-card border-border/50 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {personalStats.activeExperiments}
              </p>
              <p className="text-xs text-muted-foreground">Personal</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 bg-card border-border/50 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{teamStats.memberCount}</p>
              <p className="text-xs text-muted-foreground">Team Members</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 bg-card border-border/50 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-second/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-second" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {teamStats.activeExperiments}
              </p>
              <p className="text-xs text-muted-foreground">Team Experiments</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 bg-card border-border/50 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{teamStats.avgCompletion}%</p>
              <p className="text-xs text-muted-foreground">Team Avg</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border/50 rounded-3xl">
          <h2 className="text-lg font-semibold text-foreground mb-4">Team Performance</h2>
          <div className="space-y-4">
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">Top Performer</p>
              <p className="text-lg font-semibold text-foreground">
                {teamStats.topPerformer}
              </p>
            </div>
            <Button variant="outline" className="w-full rounded-2xl gap-2 bg-transparent" asChild>
              <Link href={orgHref}>
                <BarChart3 className="w-4 h-4" />
                View Full Team Dashboard
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border/50 rounded-3xl">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full rounded-2xl justify-start gap-3 h-auto py-3 bg-transparent"
              asChild
            >
              <Link href="/org">
                <AlertCircle className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Pending Assignments</div>
                  <div className="text-xs text-muted-foreground">
                    {userData.pendingAssignments} experiments waiting
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-2xl justify-start gap-3 h-auto py-3 bg-transparent"
              asChild
            >
              <Link href={orgHref}>
                <Users className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Manage Team</div>
                  <div className="text-xs text-muted-foreground">
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
