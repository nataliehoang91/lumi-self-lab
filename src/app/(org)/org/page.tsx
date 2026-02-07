"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Users,
  Target,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Shield,
  Sparkles,
  Calendar,
  User,
} from "lucide-react";
import { useUser } from "@/hooks/user-context";

// Mock data for orgs user belongs to
const mockOrgs = [
  {
    id: "org-1",
    name: "Acme Corp",
    description: "Company-wide self-reflection initiatives",
    logoColor: "from-blue-500 to-cyan-500",
    role: "member" as const,
    teamsCount: 3,
    activeExperiments: 2,
    joinedDate: "Aug 2025",
  },
  {
    id: "org-2",
    name: "Product Team",
    description: "Product development team experiments",
    logoColor: "from-purple-500 to-pink-500",
    role: "team_manager" as const,
    teamsCount: 2,
    activeExperiments: 1,
    joinedDate: "Nov 2025",
  },
  {
    id: "org-3",
    name: "Engineering Guild",
    description: "Engineering best practices and growth",
    logoColor: "from-emerald-500 to-teal-500",
    role: "org_admin" as const,
    teamsCount: 5,
    activeExperiments: 3,
    joinedDate: "Jan 2026",
  },
];

// Mock pending experiment assignments
const mockPendingAssignments = [
  {
    id: "assign-1",
    experimentTitle: "Weekly Focus Tracking",
    orgName: "Acme Corp",
    orgId: "org-1",
    teamName: "Engineering",
    scope: "team" as const,
    duration: 21,
    assignedDate: "Jan 15, 2026",
  },
  {
    id: "assign-2",
    experimentTitle: "Meeting Impact Assessment",
    orgName: "Product Team",
    orgId: "org-2",
    teamName: null,
    scope: "org" as const,
    duration: 14,
    assignedDate: "Jan 14, 2026",
  },
  {
    id: "assign-3",
    experimentTitle: "Energy Patterns Discovery",
    orgName: "Acme Corp",
    orgId: "org-1",
    teamName: "Design",
    scope: "team" as const,
    duration: 7,
    assignedDate: "Jan 13, 2026",
  },
];

const getRoleBadge = (role: "member" | "team_manager" | "org_admin") => {
  switch (role) {
    case "org_admin":
      return (
        <Badge className="bg-violet/10 text-violet border-violet/20 rounded-full text-xs">
          Org Admin
        </Badge>
      );
    case "team_manager":
      return (
        <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full text-xs">
          Team Manager
        </Badge>
      );
    case "member":
      return (
        <Badge variant="outline" className="rounded-full text-xs">
          Member
        </Badge>
      );
  }
};

const getScopeBadge = (scope: "personal" | "team" | "org") => {
  switch (scope) {
    case "org":
      return (
        <Badge className="bg-violet/10 text-violet border-violet/20 rounded-full text-xs">
          Org-wide
        </Badge>
      );
    case "team":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs">
          Team
        </Badge>
      );
    case "personal":
      return (
        <Badge variant="outline" className="rounded-full text-xs">
          Personal
        </Badge>
      );
  }
};

const Loading = () => null;

export default function OrgsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const { userData } = useUser();

  const filteredOrgs = mockOrgs.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Page title and description based on user role
  const pageTitle = userData?.isOrgAdmin
    ? "Organizations"
    : "Joined Experiments";
  const pageDescription = userData?.isOrgAdmin
    ? "Organizations you manage"
    : "Experiments assigned to you from organizations";

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-violet-50 dark:from-background dark:via-background dark:to-violet-950/20">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-violet/20 flex items-center justify-center">
                {userData?.isOrgAdmin ? (
                  <Building2 className="w-5 h-5 text-primary" />
                ) : (
                  <Sparkles className="w-5 h-5 text-primary" />
                )}
              </div>
              <h1 className="text-3xl font-semibold text-foreground">
                {pageTitle}
              </h1>
            </div>
            <p className="text-muted-foreground">{pageDescription}</p>
          </div>

          {/* Pending Assignments */}
          {mockPendingAssignments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Pending Assignments
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
                  {mockPendingAssignments.length}
                </Badge>
              </h2>
              <div className="space-y-3">
                {mockPendingAssignments.map((assignment) => (
                  <Card
                    key={assignment.id}
                    className="p-4 bg-card border-border/50 rounded-2xl hover:shadow-lg hover:shadow-primary/5 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">
                            {assignment.experimentTitle}
                          </h3>
                          {getScopeBadge(assignment.scope)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          From{" "}
                          <span className="text-foreground">
                            {assignment.orgName}
                          </span>
                          {assignment.teamName && (
                            <>
                              {" "}
                              /{" "}
                              <span className="text-foreground">
                                {assignment.teamName}
                              </span>
                            </>
                          )}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {assignment.duration} days
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Assigned {assignment.assignedDate}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl bg-transparent gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl bg-primary hover:bg-primary/90 gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Privacy notice */}
              <Card className="mt-4 p-3 bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/50 rounded-xl">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Your privacy is protected.
                    </span>{" "}
                    Accepting an experiment only shares aggregate scores with
                    the organization. Your personal reflections and text entries
                    remain private.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-2xl"
              />
            </div>
          </div>

          {/* Organizations List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Your Organizations ({filteredOrgs.length})
            </h2>

            {filteredOrgs.map((org) => {
              // Check if user is manager in this org
              const userRoleInOrg =
                userData?.orgs?.find((o) => o.id === org.id)?.role || "member";
              const isManager =
                userRoleInOrg === "team_manager" ||
                userRoleInOrg === "org_admin";

              // Org portal: single org detail route
              const orgDetailHref = `/org/${org.id}`;

              return (
                <Link key={org.id} href={orgDetailHref}>
                  <Card className="p-5 bg-card border-border/50 rounded-3xl hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer">
                    <div className="flex items-center gap-5">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${org.logoColor} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}
                      >
                        {org.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {org.name}
                          </h3>
                          {getRoleBadge(org.role)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                          {org.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {org.teamsCount} teams
                          </span>
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            {org.activeExperiments} active experiments
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Joined {org.joinedDate}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              );
            })}

            {filteredOrgs.length === 0 && (
              <Card className="p-8 bg-card/50 border-border/50 rounded-3xl text-center">
                <Building2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <h3 className="font-medium text-foreground mb-1">
                  No organizations found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try a different search term
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
