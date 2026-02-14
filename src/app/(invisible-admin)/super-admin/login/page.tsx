import { Card } from "@/components/ui/card";

/**
 * Internal admin login (no Clerk). Placeholder. Route: /super-admin/login
 */
export default function InvisibleAdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Internal admin login</h2>
        <p className="text-muted-foreground">Placeholder. No Clerk.</p>
      </Card>
    </div>
  );
}
