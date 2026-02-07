import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Internal admin: system. Placeholder. Route: /super-admin/system
 */
export default function InvisibleAdminSystemPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/super-admin">
            <ArrowLeft className="size-4 mr-2" />
            Back to super admin
          </Link>
        </Button>
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            System
          </h2>
          <p className="text-muted-foreground">System settings. Placeholder.</p>
        </Card>
      </div>
    </div>
  );
}
