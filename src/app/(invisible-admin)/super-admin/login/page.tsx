import { Card } from "@/components/ui/card";

/**
 * Internal admin login (no Clerk). Placeholder. Route: /super-admin/login
 */
export default function InvisibleAdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <h2 className="text-foreground mb-2 text-xl font-semibold">
          Internal admin login
        </h2>
        <p className="text-muted-foreground">Placeholder. No Clerk.</p>
      </Card>
    </div>
  );
}
