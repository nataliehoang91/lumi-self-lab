import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, ArrowLeft } from "lucide-react";

/**
 * Org admin: manage experiments. Route: /org/[orgId]/admin/experiments
 */
export default async function OrgAdminExperimentsPage({
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
          <Target className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h2 className="text-foreground mb-2 text-xl font-semibold">
            Manage experiments
          </h2>
          <p className="text-muted-foreground">
            Experiment management for this organisation (admin). Deferred to a later
            phase.
          </p>
        </Card>
      </div>
    </div>
  );
}
