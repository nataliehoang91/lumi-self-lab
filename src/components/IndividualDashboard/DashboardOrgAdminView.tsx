import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import type { OrgStats, DashboardUserData } from "@/lib/dashboard-data";

type Props = {
  displayName: string;
  orgStats: OrgStats;
  userData: DashboardUserData;
};

export function DashboardOrgAdminView({ displayName, orgStats, userData }: Props) {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-2xl font-medium">
          Welcome back, {displayName}
        </h1>
        <p className="text-muted-foreground text-sm">
          Managing {orgStats.totalOrgs} organizations · {orgStats.totalMembers} members
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="bg-card border-border/50 rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-3">
            <div
              className="bg-second/10 flex h-10 w-10 items-center justify-center
                rounded-xl"
            >
              <Building2 className="text-second h-5 w-5" />
            </div>
            <div>
              <p className="text-foreground text-2xl font-bold">{orgStats.totalOrgs}</p>
              <p className="text-muted-foreground text-xs">Organizations</p>
            </div>
          </div>
        </Card>
        <Card className="bg-card border-border/50 rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-3">
            <div
              className="bg-primary/10 flex h-10 w-10 items-center justify-center
                rounded-xl"
            >
              <Users className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-foreground text-2xl font-bold">
                {orgStats.totalMembers}
              </p>
              <p className="text-muted-foreground text-xs">Total Members</p>
            </div>
          </div>
        </Card>
        <Card className="bg-card border-border/50 rounded-2xl p-5">
          <div className="mb-2 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl
                bg-emerald-500/10"
            >
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-foreground text-2xl font-bold">
                {orgStats.totalExperiments}
              </p>
              <p className="text-muted-foreground text-xs">Active Experiments</p>
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
                {orgStats.avgOrgCompletion}%
              </p>
              <p className="text-muted-foreground text-xs">Avg Completion</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-card border-border/50 rounded-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">Your Organizations</h2>
          <Link href="/org">
            <Button variant="ghost" size="sm" className="gap-2 rounded-xl">
              Manage All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {userData.orgs.map((org) => (
            <Card
              key={org.id}
              className="bg-background/50 border-border/50 rounded-2xl p-5
                transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground mb-1 font-medium">{org.name}</h3>
                  <Badge variant="secondary" className="rounded-full text-xs capitalize">
                    {org.role.replace("_", " ")}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="rounded-xl" asChild>
                  <Link
                    href={
                      org.role === "org_admin" ? `/org/${org.id}/admin` : `/org/${org.id}`
                    }
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
