"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Home, FileText, Calendar, Clock } from "lucide-react";
import Link from "next/link";

// Mock template data - replace with API call
function getTemplate(templateId: string | null) {
  if (!templateId) return null;

  const templates: Record<string, any> = {
    t1: {
      id: "t1",
      title: "Focus & Deep Work",
      description: "Track focus patterns and optimize for deep work",
      category: "Productivity",
      duration: 14,
      frequency: "daily",
      fields: [
        { type: "emoji", label: "How focused did you feel today?" },
        { type: "number", label: "Hours of deep work" },
        {
          type: "select",
          label: "Main distraction",
          options: ["Meetings", "Slack", "Email"],
        },
        { type: "text", label: "What helped you focus?" },
      ],
    },
  };

  return templates[templateId] || null;
}

export default function FromTemplatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [assignedInviteId, setAssignedInviteId] = useState<string | null>(null);

  useEffect(() => {
    const template = searchParams.get("template");
    const org = searchParams.get("org");
    const assigned = searchParams.get("assigned");

    if (template) setTemplateId(template);
    if (org) setOrgId(org);
    if (assigned) setAssignedInviteId(assigned);
  }, [searchParams]);

  const template = getTemplate(templateId);
  const orgName =
    orgId === "org1" ? "Acme Corp" : orgId === "org2" ? "Design Team" : null;

  if (!template) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <Card className="p-12 text-center">
            <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Template not found
            </h3>
            <Button asChild>
              <Link href="/templates">Browse Templates</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleStart = () => {
    const params = new URLSearchParams();
    if (templateId) params.set("template", templateId);
    if (orgId) params.set("org", orgId);
    if (assignedInviteId) params.set("assigned", assignedInviteId);

    router.push(`/experiments/new/create?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/experiments/new">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        {/* Context Banner */}
        {orgId && (
          <Card className="bg-violet/10 border-violet/20 mb-6 p-4">
            <div className="flex items-center gap-3">
              <Building2 className="text-violet h-5 w-5" />
              <div>
                <p className="text-foreground text-sm font-medium">
                  Starting from {orgName} template
                </p>
                <p className="text-muted-foreground text-xs">
                  This experiment will be linked to {orgName} for aggregate insights. Your
                  personal data stays private.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams();
                  if (templateId) params.set("template", templateId);
                  router.push(`/experiments/new/from-template?${params.toString()}`);
                }}
                className="ml-auto"
              >
                <Home className="mr-2 h-4 w-4" />
                Make Personal
              </Button>
            </div>
          </Card>
        )}

        {/* Template Preview */}
        <Card className="p-8">
          <div className="mb-6">
            <Badge className="bg-violet/10 text-violet mb-4">{template.category}</Badge>
            <h1 className="text-foreground mb-2 text-3xl font-semibold">
              {template.title}
            </h1>
            <p className="text-muted-foreground">{template.description}</p>
          </div>

          <div className="mb-8 space-y-6">
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{template.duration} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="capitalize">{template.frequency}</span>
              </div>
            </div>

            <div>
              <h3 className="text-foreground mb-4 font-semibold">Tracking Fields</h3>
              <div className="space-y-3">
                {template.fields.map((field: any, index: number) => (
                  <div
                    key={index}
                    className="bg-muted/50 border-border rounded-xl border p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-foreground text-sm font-medium">
                        {field.label}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {field.type}
                      </Badge>
                    </div>
                    {field.options && (
                      <div className="text-muted-foreground text-xs">
                        Options: {field.options.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/experiments/new">Cancel</Link>
            </Button>
            <Button onClick={handleStart} className="flex-1">
              Start Experiment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
