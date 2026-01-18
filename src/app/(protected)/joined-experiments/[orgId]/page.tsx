"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Building2,
  Users,
  Target,
  TrendingUp,
  Shield,
  EyeOff,
  Sparkles,
  Calendar,
  Clock,
  ChevronRight,
  BarChart3,
  Play,
} from "lucide-react"
import { useUser, type UserData } from "@/hooks/user-context"

// Mock org data
const mockOrg = {
  id: "org-1",
  name: "Acme Corp",
  description: "Company-wide self-reflection initiatives to help our team grow through personal experiments",
  logoColor: "from-blue-500 to-cyan-500",
  memberCount: 156,
  teamsCount: 8,
  joinedDate: "Aug 15, 2025",
}

// Helper to get user's role in org from userData
function getUserRoleInOrg(orgId: string, userData: UserData | null): "member" | "team_manager" | "org_admin" {
  const org = userData?.orgs?.find((o) => o.id === orgId)
  return org?.role || "member"
}

// Mock teams user is part of
const mockUserTeams = [
  { id: "team-1", name: "Engineering", memberCount: 24, activeExperiments: 2 },
  { id: "team-2", name: "Frontend", memberCount: 8, activeExperiments: 1 },
]

// Mock user's active experiments in this org
// Note: org experiments should include orgId in the data
const mockActiveExperiments = [
  {
    id: "exp-1",
    title: "Weekly Focus Tracking",
    scope: "team" as const,
    teamName: "Engineering",
    progress: 67,
    daysLeft: 7,
    lastCheckIn: "Today",
    orgId: "org-1", // Org experiment includes orgId
  },
  {
    id: "exp-2",
    title: "Meeting Impact Assessment",
    scope: "org" as const,
    teamName: null,
    progress: 45,
    daysLeft: 12,
    lastCheckIn: "Yesterday",
    orgId: "org-1", // Org experiment includes orgId
  },
]

// Mock available experiments (not yet started)
const mockAvailableExperiments = [
  {
    id: "avail-1",
    title: "Energy Patterns Discovery",
    scope: "team" as const,
    teamName: "Engineering",
    duration: 14,
    participants: 18,
  },
]

const getRoleBadge = (role: "member" | "team_manager" | "org_admin") => {
  switch (role) {
    case "org_admin":
      return <Badge className="bg-violet/10 text-violet border-violet/20 rounded-full">Org Admin</Badge>
    case "team_manager":
      return <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full">Team Manager</Badge>
    case "member":
      return <Badge variant="outline" className="rounded-full">Member</Badge>
  }
}

const getScopeBadge = (scope: "personal" | "team" | "org") => {
  switch (scope) {
    case "org":
      return <Badge className="bg-violet/10 text-violet border-violet/20 rounded-full text-xs">Org-wide</Badge>
    case "team":
      return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs">Team</Badge>
    case "personal":
      return <Badge variant="outline" className="rounded-full text-xs">Personal</Badge>
  }
}

export default function OrgDetailPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = use(params)
  const { userData } = useUser()
  const [activeTab, setActiveTab] = useState<"overview" | "teams" | "insights">("overview")
  
  // Get user's role in this org
  const userRoleInOrg = getUserRoleInOrg(orgId, userData)
  const isManager = userRoleInOrg === "team_manager" || userRoleInOrg === "org_admin"
  
  // Route to manager view if user is manager, otherwise participant view
  const getExperimentLink = (expId: string, expOrgId?: string) => {
    // If this is an org experiment (has orgId), include it in the URL
    if (expOrgId) {
      return `/experiments/${expId}?orgId=${expOrgId}`
    }
    return `/experiments/${expId}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-violet-50 dark:from-background dark:via-background dark:to-violet-950/20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back button */}
        <Link href="/joined-experiments" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Organizations
        </Link>

        {/* Org Header */}
        <Card className="p-6 bg-card border-border/50 rounded-3xl mb-6">
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mockOrg.logoColor} flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}
            >
              {mockOrg.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{mockOrg.name}</h1>
                {getRoleBadge(userRoleInOrg)}
              </div>
              <p className="text-muted-foreground mb-4">{mockOrg.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {mockOrg.memberCount} members
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {mockOrg.teamsCount} teams
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Joined {mockOrg.joinedDate}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-2xl w-fit overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Target },
            { id: "teams", label: "My Teams", icon: Users },
            { id: "insights", label: "Insights", icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Active Experiments */}
            {mockActiveExperiments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-emerald-500" />
                  Your Active Experiments
                </h2>
                <div className="grid gap-4">
                  {mockActiveExperiments.map((exp) => (
                    <Link key={exp.id} href={getExperimentLink(exp.id, exp.orgId)}>
                      <Card className="p-5 bg-card border-border/50 rounded-2xl hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{exp.title}</h3>
                              {getScopeBadge(exp.scope)}
                              {exp.teamName && (
                                <span className="text-xs text-muted-foreground">in {exp.teamName}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {exp.daysLeft} days left
                              </span>
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                Last check-in: {exp.lastCheckIn}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-semibold text-foreground">{exp.progress}%</p>
                              <p className="text-xs text-muted-foreground">progress</p>
                            </div>
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-violet transition-all rounded-full"
                                style={{ width: `${exp.progress}%` }}
                              />
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Available Experiments */}
            {mockAvailableExperiments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Available to Join
                </h2>
                <div className="grid gap-4">
                  {mockAvailableExperiments.map((exp) => (
                    <Card key={exp.id} className="p-5 bg-card border-border/50 rounded-2xl">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-medium text-foreground">{exp.title}</h3>
                            {getScopeBadge(exp.scope)}
                            {exp.teamName && (
                              <span className="text-xs text-muted-foreground">in {exp.teamName}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {exp.duration} days
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {exp.participants} participants
                            </span>
                          </div>
                        </div>
                        <Button className="rounded-xl bg-primary hover:bg-primary/90">
                          Start Experiment
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Notice */}
            <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/50 rounded-2xl">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Your privacy is protected</p>
                  <p className="text-sm text-muted-foreground">
                    Only aggregate scores are shared with the organization. Your personal reflections and text entries remain completely private.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === "teams" && (
          <div className="space-y-4">
            <p className="text-muted-foreground mb-4">Teams you are part of in this organization</p>
            
            {mockUserTeams.map((team) => (
              <Link key={team.id} href={`/orgs/${orgId}/teams/${team.id}`}>
                <Card className="p-5 bg-card border-border/50 rounded-2xl hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-violet/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{team.name}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{team.memberCount} members</span>
                        <span>{team.activeExperiments} active experiments</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            ))}

            {mockUserTeams.length === 0 && (
              <Card className="p-8 bg-card/50 border-border/50 rounded-3xl text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <h3 className="font-medium text-foreground mb-1">No teams yet</h3>
                <p className="text-sm text-muted-foreground">You haven't joined any teams in this organization</p>
              </Card>
            )}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            {/* Privacy Notice */}
            <Card className="p-4 bg-violet/5 border-violet/20 rounded-2xl">
              <div className="flex items-start gap-3">
                <EyeOff className="w-5 h-5 text-violet mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Aggregate insights only</p>
                  <p className="text-sm text-muted-foreground">
                    These are organization-wide trends. No individual data is shown.
                  </p>
                </div>
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-card border-border/50 rounded-2xl text-center">
                <p className="text-2xl font-bold text-primary">78%</p>
                <p className="text-xs text-muted-foreground">Avg Completion</p>
              </Card>
              <Card className="p-4 bg-card border-border/50 rounded-2xl text-center">
                <p className="text-2xl font-bold text-violet">89%</p>
                <p className="text-xs text-muted-foreground">Participation Rate</p>
              </Card>
              <Card className="p-4 bg-card border-border/50 rounded-2xl text-center">
                <p className="text-2xl font-bold text-emerald-600">156</p>
                <p className="text-xs text-muted-foreground">Weekly Check-ins</p>
              </Card>
              <Card className="p-4 bg-card border-border/50 rounded-2xl text-center">
                <p className="text-2xl font-bold text-orange-600">5.2</p>
                <p className="text-xs text-muted-foreground">Avg Streak (days)</p>
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="p-6 bg-card border-border/50 rounded-3xl">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Organization Trends
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Team focus scores improved 12% this month across all teams.</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-violet/10 border border-violet/20">
                  <div className="flex items-start gap-2">
                    <BarChart3 className="w-4 h-4 text-violet mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Morning check-ins (before 10am) correlate with 23% higher completion rates.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
