"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Users,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Shield,
  Sparkles,
  Calendar,
} from "lucide-react";
import { useUser } from "@/hooks/user-context";

// API response shape (GET /api/orgs) — real data from DB
type OrgListItem = {
  id: string;
  name: string;
  description: string | null;
  role: "member" | "team_manager" | "org_admin";
  joinedAt: string;
  memberCount: number;
  templatesCount: number;
  experimentsCount: number;
};

const LOGO_COLORS = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-red-500",
];
const getLogoColor = (index: number) => LOGO_COLORS[index % LOGO_COLORS.length];

function formatJoinedDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

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
        <Badge className="rounded-full bg-blue-100 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
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
  const [orgs, setOrgs] = useState<OrgListItem[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [orgsError, setOrgsError] = useState<string | null>(null);
  useSearchParams(); // for Suspense boundary
  const { userData } = useUser();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/orgs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load organizations");
        return res.json();
      })
      .then((data: { organisations: OrgListItem[] }) => {
        if (!cancelled) {
          setOrgs(data.organisations ?? []);
          setOrgsError(null);
        }
      })
      .catch((err) => {
        if (!cancelled)
          setOrgsError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setOrgsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredOrgs = orgs.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (org.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Page title and description based on user role
  const pageTitle = userData?.isOrgAdmin ? "Organizations" : "Joined Experiments";
  const pageDescription = userData?.isOrgAdmin
    ? "Organizations you manage"
    : "Experiments assigned to you from organizations";

  return (
    <Suspense fallback={<Loading />}>
      <div
        className="dark:from-background dark:via-background min-h-screen bg-gradient-to-br
          from-orange-50 via-white to-violet-50 dark:to-violet-950/20"
      >
        <div className="container mx-auto max-w-5xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <div
                className="from-primary/20 to-violet/20 flex h-10 w-10 items-center
                  justify-center rounded-2xl bg-gradient-to-br"
              >
                {userData?.isOrgAdmin ? (
                  <Building2 className="text-primary h-5 w-5" />
                ) : (
                  <Sparkles className="text-primary h-5 w-5" />
                )}
              </div>
              <h1 className="text-foreground text-3xl font-semibold">{pageTitle}</h1>
            </div>
            <p className="text-muted-foreground">{pageDescription}</p>
          </div>

          {/* Pending Assignments */}
          {mockPendingAssignments.length > 0 && (
            <div className="mb-8">
              <h2
                className="text-foreground mb-4 flex items-center gap-2 text-lg
                  font-semibold"
              >
                <Clock className="h-5 w-5 text-orange-500" />
                Pending Assignments
                <Badge
                  className="rounded-full bg-orange-100 text-orange-700
                    dark:bg-orange-900/30 dark:text-orange-400"
                >
                  {mockPendingAssignments.length}
                </Badge>
              </h2>
              <div className="space-y-3">
                {mockPendingAssignments.map((assignment) => (
                  <Card
                    key={assignment.id}
                    className="bg-card border-border/50 hover:shadow-primary/5 rounded-2xl
                      p-4 transition-all hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="text-foreground font-medium">
                            {assignment.experimentTitle}
                          </h3>
                          {getScopeBadge(assignment.scope)}
                        </div>
                        <p className="text-muted-foreground mb-2 text-sm">
                          From{" "}
                          <span className="text-foreground">{assignment.orgName}</span>
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
                        <div
                          className="text-muted-foreground flex flex-wrap gap-3 text-xs"
                        >
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {assignment.duration} days
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Assigned {assignment.assignedDate}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 rounded-xl bg-transparent"
                        >
                          <XCircle className="h-4 w-4" />
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 gap-1.5 rounded-xl"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Privacy notice */}
              <Card
                className="mt-4 rounded-xl border-emerald-200/50 bg-emerald-50/50 p-3
                  dark:border-emerald-800/50 dark:bg-emerald-900/10"
              >
                <div className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                  <p className="text-muted-foreground text-xs">
                    <span className="text-foreground font-medium">
                      Your privacy is protected.
                    </span>{" "}
                    Accepting an experiment only shares aggregate scores with the
                    organization. Your personal reflections and text entries remain
                    private.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search
                className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4
                  -translate-y-1/2"
              />
              <Input
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-2xl pl-10"
              />
            </div>
          </div>

          {/* Organizations List — real data from GET /api/orgs */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-foreground text-lg font-semibold">
                Your Organizations ({orgsLoading ? "…" : filteredOrgs.length})
              </h2>
              {userData?.accountType === "organisation" && (
                <Button asChild>
                  <Link href="/org/create">Create organisation</Link>
                </Button>
              )}
            </div>

            {orgsError && (
              <Card className="border-destructive/50 bg-destructive/5 rounded-2xl p-4">
                <p className="text-destructive text-sm">{orgsError}</p>
              </Card>
            )}

            {!orgsLoading &&
              !orgsError &&
              filteredOrgs.map((org, index) => {
                const orgDetailHref = `/org/${org.id}`;
                return (
                  <Link key={org.id} href={orgDetailHref}>
                    <Card
                      className="bg-card border-border/50 hover:shadow-primary/5 group
                        cursor-pointer rounded-3xl p-5 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={`h-14 w-14 rounded-2xl bg-gradient-to-br
                          ${getLogoColor(index)} flex shrink-0 items-center justify-center
                          text-xl font-bold text-white`}
                        >
                          {org.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h3
                              className="text-foreground group-hover:text-primary truncate
                                font-semibold transition-colors"
                            >
                              {org.name}
                            </h3>
                            {getRoleBadge(org.role)}
                          </div>
                          <p className="text-muted-foreground mb-2 line-clamp-1 text-sm">
                            {org.description ?? ""}
                          </p>
                          <div
                            className="text-muted-foreground flex flex-wrap gap-4 text-xs"
                          >
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {org.memberCount} members
                            </span>
                            <span className="flex items-center gap-1">
                              <Sparkles className="h-3.5 w-3.5" />
                              {org.experimentsCount} experiments
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Joined {formatJoinedDate(org.joinedAt)}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          className="text-muted-foreground group-hover:text-primary h-5
                            w-5 shrink-0 transition-all group-hover:translate-x-1"
                        />
                      </div>
                    </Card>
                  </Link>
                );
              })}

            {!orgsLoading && !orgsError && filteredOrgs.length === 0 && (
              <Card className="bg-card/50 border-border/50 rounded-3xl p-8 text-center">
                <Building2 className="text-muted-foreground/50 mx-auto mb-3 h-12 w-12" />
                <h3 className="text-foreground mb-1 font-medium">
                  {orgs.length === 0 ? "No organizations yet" : "No organizations found"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {orgs.length === 0
                    ? "When you join an organization, it will appear here."
                    : "Try a different search term"}
                </p>
              </Card>
            )}

            {orgsLoading && (
              <Card className="bg-card/50 border-border/50 rounded-3xl p-8 text-center">
                <p className="text-muted-foreground text-sm">Loading organizations…</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
