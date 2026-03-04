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
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div
              className="bg-violet/10 flex h-12 w-12 items-center justify-center
                rounded-xl"
            >
              <Building2 className="text-violet h-6 w-6" />
            </div>
            <div>
              <h1 className="text-foreground text-3xl font-semibold">{org.name}</h1>
              <p className="text-muted-foreground">{org.description ?? ""}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="p-6">
            <div className="mb-2 flex items-center gap-3">
              <Users className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-foreground text-2xl font-semibold">
                  {org.memberCount}
                </p>
                <p className="text-muted-foreground text-sm">Members</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-2 flex items-center gap-3">
              <FileText className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-foreground text-2xl font-semibold">
                  {org.activeExperiments}
                </p>
                <p className="text-muted-foreground text-sm">Active Experiments</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-2 flex items-center gap-3">
              <FileText className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-foreground text-2xl font-semibold">
                  {org.totalTemplates}
                </p>
                <p className="text-muted-foreground text-sm">Templates</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-2 flex items-center gap-3">
              <BarChart3 className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-foreground text-2xl font-semibold">
                  {org.avgCompletionRate != null ? `${org.avgCompletionRate}%` : "—"}
                </p>
                <p className="text-muted-foreground text-sm">Avg Completion</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Link href={`/org/${orgId}/templates`}>
            <Card className="hover:border-primary p-6 transition-all">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="bg-primary/10 flex h-10 w-10 items-center justify-center
                    rounded-xl"
                >
                  <FileText className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">Templates</h3>
                  <p className="text-muted-foreground text-sm">
                    Browse experiment templates
                  </p>
                </div>
              </div>
              <ArrowRight className="text-muted-foreground h-5 w-5" />
            </Card>
          </Link>

          <Link href={`/org/${orgId}/insights`}>
            <Card className="hover:border-primary p-6 transition-all">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="bg-violet/10 flex h-10 w-10 items-center justify-center
                    rounded-xl"
                >
                  <BarChart3 className="text-violet h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">Team Insights</h3>
                  <p className="text-muted-foreground text-sm">View aggregate insights</p>
                </div>
              </div>
              <ArrowRight className="text-muted-foreground h-5 w-5" />
            </Card>
          </Link>

          <Link href={`/org/${orgId}/teams`}>
            <Card className="hover:border-primary p-6 transition-all">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="bg-second/10 flex h-10 w-10 items-center justify-center
                    rounded-xl"
                >
                  <Users className="text-second h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">Members</h3>
                  <p className="text-muted-foreground text-sm">View team members</p>
                </div>
              </div>
              <ArrowRight className="text-muted-foreground h-5 w-5" />
            </Card>
          </Link>
        </div>

        {/* Privacy Notice */}
        <Card className="bg-violet/10 border-violet/20 p-6">
          <div className="flex items-start gap-3">
            <div
              className="bg-violet/20 flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl"
            >
              <BarChart3 className="text-violet h-5 w-5" />
            </div>
            <div>
              <h3 className="text-foreground mb-2 font-semibold">Privacy Protected</h3>
              <p className="text-muted-foreground text-sm">
                You&apos;re viewing aggregate insights only. Individual responses and
                personal reflections are never shared.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
