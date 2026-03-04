import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Platform admin: users. Placeholder. Route: /admin/users
 */
export default function AdminUsersPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/admin">
            <ArrowLeft className="mr-2 size-4" />
            Back to admin
          </Link>
        </Button>
        <Card className="p-8 text-center">
          <h2 className="text-foreground mb-2 text-xl font-semibold">Users</h2>
          <p className="text-muted-foreground">User management. Placeholder.</p>
        </Card>
      </div>
    </div>
  );
}
