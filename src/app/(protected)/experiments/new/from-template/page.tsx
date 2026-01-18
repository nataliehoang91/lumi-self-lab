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
        { type: "select", label: "Main distraction", options: ["Meetings", "Slack", "Email"] },
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
  const orgName = orgId === "org1" ? "Acme Corp" : orgId === "org2" ? "Design Team" : null;

  if (!template) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/experiments/new">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>

        {/* Context Banner */}
        {orgId && (
          <Card className="p-4 mb-6 bg-violet/10 border-violet/20">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-violet" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Starting from {orgName} template
                </p>
                <p className="text-xs text-muted-foreground">
                  This experiment will be linked to {orgName} for aggregate insights. Your personal data stays private.
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
                <Home className="w-4 h-4 mr-2" />
                Make Personal
              </Button>
            </div>
          </Card>
        )}

        {/* Template Preview */}
        <Card className="p-8">
          <div className="mb-6">
            <Badge className="mb-4 bg-violet/10 text-violet">
              {template.category}
            </Badge>
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              {template.title}
            </h1>
            <p className="text-muted-foreground">{template.description}</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{template.duration} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="capitalize">{template.frequency}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Tracking Fields
              </h3>
              <div className="space-y-3">
                {template.fields.map((field: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-muted/50 border border-border"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {field.label}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {field.type}
                      </Badge>
                    </div>
                    {field.options && (
                      <div className="text-xs text-muted-foreground">
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
