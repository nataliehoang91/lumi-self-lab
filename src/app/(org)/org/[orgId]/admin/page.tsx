import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, Users, Target, Building2 } from "lucide-react";

/**
 * Org admin hub. Route: /org/[orgId]/admin
 * Only org_admin (or super_admin) can access; enforced by admin/layout.tsx.
 */
export default async function OrgAdminPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/org/${orgId}`}>
            <Building2 className="mr-2 size-4" />
            Back to org
          </Link>
        </Button>
        <h1 className="text-foreground mb-2 text-2xl font-semibold">Org admin</h1>
        <p className="text-muted-foreground mb-8">
          Manage teams, experiments, and members for this organisation.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href={`/org/${orgId}/admin/teams`}>
            <Card className="hover:bg-muted/50 p-6 transition-colors">
              <Users className="text-muted-foreground mb-2 h-8 w-8" />
              <h2 className="text-foreground font-semibold">Teams</h2>
              <p className="text-muted-foreground text-sm">Manage teams</p>
            </Card>
          </Link>
          <Link href={`/org/${orgId}/admin/experiments`}>
            <Card className="hover:bg-muted/50 p-6 transition-colors">
              <Target className="text-muted-foreground mb-2 h-8 w-8" />
              <h2 className="text-foreground font-semibold">Experiments</h2>
              <p className="text-muted-foreground text-sm">Manage experiments</p>
            </Card>
          </Link>
          <Link href={`/org/${orgId}/admin/members`}>
            <Card className="hover:bg-muted/50 p-6 transition-colors">
              <Settings className="text-muted-foreground mb-2 h-8 w-8" />
              <h2 className="text-foreground font-semibold">Members</h2>
              <p className="text-muted-foreground text-sm">Manage members</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
