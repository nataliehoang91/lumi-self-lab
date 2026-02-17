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
        <h1 className="text-2xl font-medium text-foreground mb-2">Welcome back, {displayName}</h1>
        <p className="text-muted-foreground text-sm">
          Managing {orgStats.totalOrgs} organizations · {orgStats.totalMembers} members
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-card border-border/50 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-second/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-second" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{orgStats.totalOrgs}</p>
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
              <p className="text-2xl font-bold text-foreground">{orgStats.totalMembers}</p>
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
              <p className="text-2xl font-bold text-foreground">{orgStats.totalExperiments}</p>
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
              <p className="text-2xl font-bold text-foreground">{orgStats.avgOrgCompletion}%</p>
              <p className="text-xs text-muted-foreground">Avg Completion</p>
            </div>
          </div>
        </Card>
      </div>

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
          {userData.orgs.map((org) => (
            <Card
              key={org.id}
              className="p-5 bg-background/50 border-border/50 rounded-2xl hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground mb-1">{org.name}</h3>
                  <Badge variant="secondary" className="text-xs rounded-full capitalize">
                    {org.role.replace("_", " ")}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="rounded-xl" asChild>
                  <Link href={org.role === "org_admin" ? `/org/${org.id}/admin` : `/org/${org.id}`}>
                    <ArrowRight className="w-4 h-4" />
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
