"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, BarChart3, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

// Mock data - replace with real API call
function getOrgData(orgId: string) {
  return {
    id: orgId,
    name: "Acme Corp",
    description: "Productivity and wellness experiments",
    memberCount: 24,
    activeExperiments: 12,
    totalTemplates: 8,
    avgCompletionRate: 78,
  };
}

export default function OrganizationDashboardPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = use(params);
  const org = getOrgData(orgId);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-violet/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-violet" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                {org.name}
              </h1>
              <p className="text-muted-foreground">{org.description}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {org.memberCount}
                </p>
                <p className="text-sm text-muted-foreground">Members</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {org.activeExperiments}
                </p>
                <p className="text-sm text-muted-foreground">Active Experiments</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {org.totalTemplates}
                </p>
                <p className="text-sm text-muted-foreground">Templates</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {org.avgCompletionRate}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Completion</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 hover:border-primary transition-all" asChild>
            <Link href={`/organizations/${orgId}/templates`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse experiment templates
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </Card>

          <Card className="p-6 hover:border-primary transition-all" asChild>
            <Link href={`/organizations/${orgId}/insights`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-violet" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Team Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    View aggregate insights
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </Card>

          <Card className="p-6 hover:border-primary transition-all" asChild>
            <Link href={`/organizations/${orgId}/members`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Members</h3>
                  <p className="text-sm text-muted-foreground">
                    View team members
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </Card>
        </div>

        {/* Privacy Notice */}
        <Card className="p-6 bg-violet/10 border-violet/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet/20 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-violet" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Privacy Protected
              </h3>
              <p className="text-sm text-muted-foreground">
                You&apos;re viewing aggregate insights only. Individual responses and personal reflections are never shared.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
