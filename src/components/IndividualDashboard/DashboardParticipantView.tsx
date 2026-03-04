import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  AlertCircle,
  CheckCircle2,
  Building2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import type {
  PersonalStats,
  PendingAssignment,
  DashboardUserData,
} from "@/lib/dashboard-data";

type Props = {
  displayName: string;
  personalStats: PersonalStats;
  userData: DashboardUserData;
  pendingAssignments: PendingAssignment[];
};

export function DashboardParticipantView({
  displayName,
  personalStats,
  userData,
  pendingAssignments,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-2xl font-medium">
          Welcome back, {displayName}
        </h1>
        <p className="text-muted-foreground text-sm">
          {personalStats.activeExperiments} personal experiments ·{" "}
          {userData.pendingAssignments} pending from organizations
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
              <p className="text-muted-foreground text-xs">Personal Active</p>
            </div>
          </div>
        </Card>
        <Card className="bg-card border-border/50 rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl
                bg-orange-500/10"
            >
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-foreground text-2xl font-bold">
                {userData.pendingAssignments}
              </p>
              <p className="text-muted-foreground text-xs">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="bg-card border-border/50 rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl
                bg-emerald-500/10"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-foreground text-2xl font-bold">
                {personalStats.totalCompleted}
              </p>
              <p className="text-muted-foreground text-xs">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="bg-card border-border/50 rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-3">
            <div
              className="bg-second/10 flex h-10 w-10 items-center justify-center
                rounded-xl"
            >
              <Building2 className="text-second h-5 w-5" />
            </div>
            <div>
              <p className="text-foreground text-2xl font-bold">{userData.orgs.length}</p>
              <p className="text-muted-foreground text-xs">Organizations</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-card border-border/50 rounded-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">Pending Assignments</h2>
          <Link href="/org">
            <Button variant="ghost" size="sm" className="gap-2 rounded-xl">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {pendingAssignments.length === 0 ? (
            <p className="text-muted-foreground py-4 text-sm">No pending assignments.</p>
          ) : (
            pendingAssignments.map((assignment) => (
              <Card
                key={assignment.id}
                className="bg-background/50 border-border/50 rounded-2xl p-4
                  transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-foreground mb-1 font-medium">
                      {assignment.title}
                    </h3>
                    <div className="text-muted-foreground flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {assignment.orgName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Due {assignment.dueDate}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" className="rounded-xl">
                    Accept
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
