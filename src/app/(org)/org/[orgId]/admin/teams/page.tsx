import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, ArrowLeft } from "lucide-react";

/**
 * Org admin: manage teams. Route: /org/[orgId]/admin/teams
 */
export default async function OrgAdminTeamsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/org/${orgId}/admin`}>
            <ArrowLeft className="mr-2 size-4" />
            Back to org admin
          </Link>
        </Button>
        <Card className="p-8 text-center">
          <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h2 className="text-foreground mb-2 text-xl font-semibold">Manage teams</h2>
          <p className="text-muted-foreground">
            Team management for this organisation (admin). Deferred to a later phase.
          </p>
        </Card>
      </div>
    </div>
  );
}
