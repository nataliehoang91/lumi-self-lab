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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/org/${orgId}/admin`}>
            <ArrowLeft className="size-4 mr-2" />
            Back to org admin
          </Link>
        </Button>
        <Card className="p-8 text-center">
          <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Manage experiments
          </h2>
          <p className="text-muted-foreground">
            Experiment management for this organisation (admin). Deferred to a later phase.
          </p>
        </Card>
      </div>
    </div>
  );
}
