"use client";

import { useUser } from "@/hooks/user-context";
import { Card } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Super-admin portal: global admin area. Access is enforced server-side in
 * (invisible-admin)/super-admin/layout.tsx (User.role === "super_admin"). This
 * page keeps a client-side guard for loading state and UX. Admin-only APIs
 * must use requireSuperAdmin() from @/lib/permissions.
 */
export default function SuperAdminPage() {
  const { userData, loading } = useUser();

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!userData?.isSuperAdmin) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            You don’t have access to this page.
          </p>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground inline-flex items-center
            gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-8 flex items-center gap-3">
        <div
          className="flex size-12 items-center justify-center rounded-2xl bg-violet-500/20
            text-violet-600 dark:text-violet-400"
        >
          <Shield className="size-6" />
        </div>
        <div>
          <h1 className="text-foreground text-2xl font-bold">Super Admin</h1>
          <p className="text-muted-foreground">Global admin area for the whole app</p>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">
          This page is only visible to users with the{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">super_admin</code>{" "}
          role. You can add global admin tools here (e.g. user management, feature flags,
          system settings).
        </p>
      </Card>
    </div>
  );
}
