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
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/org/${orgId}`}>
            <ArrowLeft className="mr-2 size-4" />
            Back to org
          </Link>
        </Button>
        <Card className="p-8 text-center">
          <Target className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h2 className="text-foreground mb-2 text-xl font-semibold">Org experiments</h2>
          <p className="text-muted-foreground">Experiments for this organisation.</p>
        </Card>
      </div>
    </div>
  );
}
