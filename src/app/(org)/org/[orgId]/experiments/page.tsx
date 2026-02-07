import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, ArrowLeft } from "lucide-react";

/**
 * Org portal: experiments under an org. Route: /org/[orgId]/experiments
 */
export default async function OrgExperimentsPage({
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
            <ArrowLeft className="size-4 mr-2" />
            Back to org
          </Link>
        </Button>
        <Card className="p-8 text-center">
          <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Org experiments
          </h2>
          <p className="text-muted-foreground">
            Experiments for this organisation.
          </p>
        </Card>
      </div>
    </div>
  );
}
