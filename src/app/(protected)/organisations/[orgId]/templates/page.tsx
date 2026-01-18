"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, Plus } from "lucide-react";
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

export default function OrganisationTemplatesPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = use(params);
  const templates = getOrgTemplates(orgId);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Organisation Templates
            </h1>
            <p className="text-muted-foreground">
              Browse and start experiments from organisation templates
            </p>
          </div>
          <Button asChild>
            <Link href={`/organisations/${orgId}`}>
              <ArrowRight className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {templates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="p-6 hover:border-primary transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="mb-2 bg-violet/10 text-violet">
                      {template.category}
                    </Badge>
                    <h3 className="font-semibold text-foreground text-lg mb-2">
                      {template.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div>Duration: {template.duration} days</div>
                  <div>Frequency: {template.frequency}</div>
                  <div>{template.fields} tracking fields</div>
                  {template.activeUsers > 0 && (
                    <div>{template.activeUsers} active users</div>
                  )}
                </div>

                <Button
                  className="w-full"
                  asChild
                >
                  <Link href={`/experiments/new?template=${template.id}&org=${orgId}`}>
                    Start from Template
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Templates
            </h3>
            <p className="text-muted-foreground">
              This organisation doesn&apos;t have any templates yet.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
