import { Card } from "@/components/ui/card";

/**
 * Platform admin dashboard (Clerk). Placeholder. Route: /admin
 */
export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Platform Admin</h1>
        <p className="text-muted-foreground mb-8">Admin dashboard (Clerk). Placeholder.</p>
        <Card className="p-6">Admin content</Card>
      </div>
    </div>
  );
}
