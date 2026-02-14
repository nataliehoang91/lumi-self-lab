import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, FileText, BarChart3, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

// Real data from GET /api/orgs/[orgId] (Phase 3 read-only)
type OrgDetail = {
  id: string;
  name: string;
  description: string | null;
  role: string;
  memberCount: number;
  totalTemplates: number;
  activeExperiments: number;
  avgCompletionRate: number | null;
};

async function getOrgDetail(orgId: string): Promise<OrgDetail | null> {
  const cookieStore = await cookies();
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/orgs/${orgId}`, {
    cache: "no-store",
    headers: { Cookie: cookieStore.toString() },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function OrganisationDashboardPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const org = await getOrgDetail(orgId);
  if (!org) notFound();

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
              <h1 className="text-3xl font-semibold text-foreground">{org.name}</h1>
              <p className="text-muted-foreground">{org.description ?? ""}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-semibold text-foreground">{org.memberCount}</p>
                <p className="text-sm text-muted-foreground">Members</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-semibold text-foreground">{org.activeExperiments}</p>
                <p className="text-sm text-muted-foreground">Active Experiments</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-semibold text-foreground">{org.totalTemplates}</p>
                <p className="text-sm text-muted-foreground">Templates</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {org.avgCompletionRate != null ? `${org.avgCompletionRate}%` : "—"}
                </p>
                <p className="text-sm text-muted-foreground">Avg Completion</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href={`/org/${orgId}/templates`}>
            <Card className="p-6 hover:border-primary transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Templates</h3>
                  <p className="text-sm text-muted-foreground">Browse experiment templates</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </Card>
          </Link>

          <Link href={`/org/${orgId}/insights`}>
            <Card className="p-6 hover:border-primary transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-violet" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Team Insights</h3>
                  <p className="text-sm text-muted-foreground">View aggregate insights</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </Card>
          </Link>

          <Link href={`/org/${orgId}/teams`}>
            <Card className="p-6 hover:border-primary transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-second/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-second" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Members</h3>
                  <p className="text-sm text-muted-foreground">View team members</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </Card>
          </Link>
        </div>

        {/* Privacy Notice */}
        <Card className="p-6 bg-violet/10 border-violet/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet/20 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-violet" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Privacy Protected</h3>
              <p className="text-sm text-muted-foreground">
                You&apos;re viewing aggregate insights only. Individual responses and personal
                reflections are never shared.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
