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
        <h1 className="text-2xl font-medium text-foreground mb-2">
          Welcome back, {displayName}
        </h1>
        <p className="text-muted-foreground text-sm">
          {personalStats.activeExperiments} personal experiments ·{" "}
          {userData.pendingAssignments} pending from organizations
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
              <p className="text-xs text-muted-foreground">Personal Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 bg-card border-border/50 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {userData.pendingAssignments}
              </p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 bg-card border-border/50 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {personalStats.totalCompleted}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 bg-card border-border/50 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-second/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-second" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{userData.orgs.length}</p>
              <p className="text-xs text-muted-foreground">Organizations</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card border-border/50 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Pending Assignments</h2>
          <Link href="/org">
            <Button variant="ghost" size="sm" className="gap-2 rounded-xl">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {pendingAssignments.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">No pending assignments.</p>
          ) : (
            pendingAssignments.map((assignment) => (
              <Card
                key={assignment.id}
                className="p-4 bg-background/50 border-border/50 rounded-2xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{assignment.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {assignment.orgName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
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
