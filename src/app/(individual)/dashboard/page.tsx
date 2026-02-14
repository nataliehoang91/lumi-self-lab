"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Building2,
  Plus,
  ArrowRight,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/user-context";

export default function DashboardPage() {
  const { userData } = useUser();

  // Determine user type based on accountType and roles from database
  const isIndividual = userData?.accountType === "individual" && !userData?.hasManagerRole;
  const isParticipant =
    userData?.accountType === "individual" &&
    (userData?.orgs.length > 0 || userData?.isParticipant);
  const isTeamManager = userData?.hasManagerRole && !userData?.isOrgAdmin;
  const isOrgAdmin = userData?.isOrgAdmin;

  // Mock data - would come from API
  const mockPersonalStats = {
    activeExperiments: 3,
    totalCompleted: 12,
    currentStreak: 7,
    completionRate: 78,
  };

  const mockPendingAssignments = [
    {
      id: "1",
      title: "Daily Reflection Practice",
      orgName: "Acme Corp",
      dueDate: "2025-01-20",
      status: "pending" as const,
    },
    {
      id: "2",
      title: "Team Communication Check-in",
      orgName: "TechHub",
      dueDate: "2025-01-22",
      status: "pending" as const,
    },
  ];

  const mockTeamStats = {
    teamName: "Engineering",
    memberCount: 15,
    activeExperiments: 4,
    avgCompletion: 82,
    topPerformer: "Sarah K.",
  };

  const mockOrgStats = {
    totalOrgs: 2,
    totalMembers: 59,
    totalExperiments: 15,
    avgOrgCompletion: 76,
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Welcome back, {userData?.name || "there"}
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your experiments
          </p>
        </div>

        {/* Individual User Dashboard */}
        {isIndividual && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-5 bg-card border-border/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockPersonalStats.activeExperiments}
                    </p>
                    <p className="text-xs text-muted-foreground">Active</p>
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
                      {mockPersonalStats.totalCompleted}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5 bg-card border-border/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockPersonalStats.currentStreak}
                    </p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5 bg-card border-border/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-second/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-second" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockPersonalStats.completionRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">Completion</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-card border-border/50 rounded-3xl">
              <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <Link href="/create">
                  <Button className="w-full rounded-2xl h-auto py-4 justify-start gap-3 bg-primary hover:bg-primary/90">
                    <Plus className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Create New Experiment</div>
                      <div className="text-xs opacity-80">
                        Start tracking a new habit or behavior
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl h-auto py-4 justify-start gap-3 bg-transparent"
                  >
                    <Sparkles className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Browse Templates</div>
                      <div className="text-xs text-muted-foreground">
                        Get inspired by proven experiments
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* Participant Dashboard */}
        {isParticipant && (
          <div className="space-y-6">
            {/* Personal Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-5 bg-card border-border/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockPersonalStats.activeExperiments}
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
                      {userData?.pendingAssignments || 0}
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
                      {mockPersonalStats.totalCompleted}
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
                    <p className="text-2xl font-bold text-foreground">
                      {userData?.orgs.length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Organizations</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Pending Assignments */}
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
                {mockPendingAssignments.map((assignment) => (
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
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Team Manager Dashboard */}
        {isTeamManager && (
          <div className="space-y-6">
            {/* Combined Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-5 bg-card border-border/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockPersonalStats.activeExperiments}
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
                    <p className="text-2xl font-bold text-foreground">
                      {mockTeamStats.memberCount}
                    </p>
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
                      {mockTeamStats.activeExperiments}
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
                    <p className="text-2xl font-bold text-foreground">
                      {mockTeamStats.avgCompletion}%
                    </p>
                    <p className="text-xs text-muted-foreground">Team Avg</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Team Overview */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card border-border/50 rounded-3xl">
                <h2 className="text-lg font-semibold text-foreground mb-4">Team Performance</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Overall Completion</span>
                      <span className="text-sm font-medium text-foreground">
                        {mockTeamStats.avgCompletion}%
                      </span>
                    </div>
                    <Progress value={mockTeamStats.avgCompletion} className="h-2" />
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">Top Performer</p>
                    <p className="text-lg font-semibold text-foreground">
                      {mockTeamStats.topPerformer}
                    </p>
                  </div>
                  <Link href="/org">
                    <Button variant="outline" className="w-full rounded-2xl gap-2 bg-transparent">
                      <BarChart3 className="w-4 h-4" />
                      View Full Team Dashboard
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="p-6 bg-card border-border/50 rounded-3xl">
                <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/org">
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl justify-start gap-3 h-auto py-3 bg-transparent"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium">Pending Assignments</div>
                        <div className="text-xs text-muted-foreground">
                          {userData?.pendingAssignments || 0} experiments waiting
                        </div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/org">
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl justify-start gap-3 h-auto py-3 bg-transparent"
                    >
                      <Users className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium">Manage Team</div>
                        <div className="text-xs text-muted-foreground">
                          View members and assign experiments
                        </div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Org Admin Dashboard */}
        {isOrgAdmin && (
          <div className="space-y-6">
            {/* Org Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-5 bg-card border-border/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-second/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-second" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{mockOrgStats.totalOrgs}</p>
                    <p className="text-xs text-muted-foreground">Organizations</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5 bg-card border-border/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockOrgStats.totalMembers}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Members</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5 bg-card border-border/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockOrgStats.totalExperiments}
                    </p>
                    <p className="text-xs text-muted-foreground">Active Experiments</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5 bg-card border-border/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockOrgStats.avgOrgCompletion}%
                    </p>
                    <p className="text-xs text-muted-foreground">Avg Completion</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Organizations Overview */}
            <Card className="p-6 bg-card border-border/50 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Your Organizations</h2>
                <Link href="/org">
                  <Button variant="ghost" size="sm" className="gap-2 rounded-xl">
                    Manage All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {userData?.orgs.map((org) => (
                  <Card
                    key={org.id}
                    className="p-5 bg-background/50 border-border/50 rounded-2xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-second to-primary flex items-center justify-center text-white font-bold text-lg">
                        {org.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{org.name}</h3>
                        <Badge className="bg-second/10 text-second border-second/20 rounded-full text-xs mt-1">
                          {org.role === "org_admin" ? "Org Admin" : org.role}
                        </Badge>
                      </div>
                    </div>
                    <Link href={`/org/${org.id}`}>
                      <Button variant="outline" className="w-full rounded-xl gap-2 bg-transparent">
                        <BarChart3 className="w-4 h-4" />
                        View Dashboard
                      </Button>
                    </Link>
                  </Card>
                )) || <p className="text-muted-foreground">No organizations yet</p>}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/org">
                <Card className="p-5 bg-card border-border/50 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Create Template</p>
                      <p className="text-xs text-muted-foreground">Design new experiments</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link href="/org">
                <Card className="p-5 bg-card border-border/50 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Manage Members</p>
                      <p className="text-xs text-muted-foreground">Invite and organize teams</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link href="/insights">
                <Card className="p-5 bg-card border-border/50 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-second/10 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-second" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">View Insights</p>
                      <p className="text-xs text-muted-foreground">Analyze org performance</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        )}

        {/* Default view - show individual dashboard if no specific role */}
        {userData && !isIndividual && !isParticipant && !isTeamManager && !isOrgAdmin && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-5 bg-card border-border/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockPersonalStats.activeExperiments}
                    </p>
                    <p className="text-xs text-muted-foreground">Active</p>
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
                      {mockPersonalStats.totalCompleted}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5 bg-card border-border/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockPersonalStats.currentStreak}
                    </p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5 bg-card border-border/50 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-second/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-second" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockPersonalStats.completionRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">Completion</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-card border-border/50 rounded-3xl">
              <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <Link href="/create">
                  <Button className="w-full rounded-2xl h-auto py-4 justify-start gap-3 bg-primary hover:bg-primary/90">
                    <Plus className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Create New Experiment</div>
                      <div className="text-xs opacity-80">
                        Start tracking a new habit or behavior
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl h-auto py-4 justify-start gap-3 bg-transparent"
                  >
                    <Sparkles className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Browse Templates</div>
                      <div className="text-xs text-muted-foreground">
                        Get inspired by proven experiments
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
