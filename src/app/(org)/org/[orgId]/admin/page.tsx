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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/org/${orgId}`}>
            <Building2 className="size-4 mr-2" />
            Back to org
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Org admin
        </h1>
        <p className="text-muted-foreground mb-8">
          Manage teams, experiments, and members for this organisation.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href={`/org/${orgId}/admin/teams`}>
            <Card className="p-6 hover:bg-muted/50 transition-colors">
              <Users className="w-8 h-8 text-muted-foreground mb-2" />
              <h2 className="font-semibold text-foreground">Teams</h2>
              <p className="text-sm text-muted-foreground">Manage teams</p>
            </Card>
          </Link>
          <Link href={`/org/${orgId}/admin/experiments`}>
            <Card className="p-6 hover:bg-muted/50 transition-colors">
              <Target className="w-8 h-8 text-muted-foreground mb-2" />
              <h2 className="font-semibold text-foreground">Experiments</h2>
              <p className="text-sm text-muted-foreground">Manage experiments</p>
            </Card>
          </Link>
          <Link href={`/org/${orgId}/admin/members`}>
            <Card className="p-6 hover:bg-muted/50 transition-colors">
              <Settings className="w-8 h-8 text-muted-foreground mb-2" />
              <h2 className="font-semibold text-foreground">Members</h2>
              <p className="text-sm text-muted-foreground">Manage members</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
