import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

// Mock data - replace with real API call
function getOrgTemplates(orgId: string) {
  return [
    {
      id: "t1",
      title: "Focus & Deep Work",
      description: "Track focus patterns and optimize for deep work",
      category: "Productivity",
      duration: 14,
      frequency: "daily",
      fields: 4,
      activeUsers: 12,
    },
    {
      id: "t2",
      title: "Energy Tracking",
      description: "Understand energy fluctuations throughout the day",
      category: "Wellness",
      duration: 21,
      frequency: "daily",
      fields: 3,
      activeUsers: 8,
    },
  ];
}

export default async function OrganisationTemplatesPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const templates = getOrgTemplates(orgId);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-foreground mb-2 text-3xl font-semibold">
              Organisation Templates
            </h1>
            <p className="text-muted-foreground">
              Browse and start experiments from organisation templates
            </p>
          </div>
          <Button asChild>
            <Link href={`/org/${orgId}`}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {templates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="hover:border-primary p-6 transition-all">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <Badge className="bg-violet/10 text-violet mb-2">
                      {template.category}
                    </Badge>
                    <h3 className="text-foreground mb-2 text-lg font-semibold">
                      {template.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {template.description}
                    </p>
                  </div>
                </div>

                <div className="text-muted-foreground mb-4 space-y-2 text-sm">
                  <div>Duration: {template.duration} days</div>
                  <div>Frequency: {template.frequency}</div>
                  <div>{template.fields} tracking fields</div>
                  {template.activeUsers > 0 && (
                    <div>{template.activeUsers} active users</div>
                  )}
                </div>

                <Button className="w-full" asChild>
                  <Link href={`/experiments/new?template=${template.id}&org=${orgId}`}>
                    Start from Template
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="text-foreground mb-2 text-lg font-semibold">No Templates</h3>
            <p className="text-muted-foreground">
              This organisation doesn&apos;t have any templates yet.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
