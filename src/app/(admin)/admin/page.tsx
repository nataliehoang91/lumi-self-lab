import { Card } from "@/components/ui/card";

/**
 * Platform admin dashboard (Clerk). Placeholder. Route: /admin
 */
export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-foreground mb-2 text-3xl font-semibold">Platform Admin</h1>
        <p className="text-muted-foreground mb-8">
          Admin dashboard (Clerk). Placeholder.
        </p>
        <Card className="p-6">Admin content</Card>
      </div>
    </div>
  );
}
