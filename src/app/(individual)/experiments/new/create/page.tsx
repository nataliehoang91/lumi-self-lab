"use client";

import { useSearchParams } from "next/navigation";
import { ExperimentFormPanel } from "@/components/MainExperimentCreation/ExperimentCreationDetails";
import { Card } from "@/components/ui/card";
import { Building2, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock: Get organisation name
function getOrgName(orgId: string | null) {
  if (!orgId) return null;
  const orgs: Record<string, string> = {
    org1: "Acme Corp",
    org2: "Design Team",
  };
  return orgs[orgId] || null;
}

export default function CreateExperimentPage() {
  const searchParams = useSearchParams();

  // Derive from URL during render instead of syncing in an effect
  const orgId = searchParams.get("org");
  const templateId = searchParams.get("template");

  const orgName = getOrgName(orgId);
  const isOrgLinked = !!orgId;

  const makePersonalHref =
    "/experiments/new/create" + (templateId ? `?template=${encodeURIComponent(templateId)}` : "");

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/experiments/new">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>

        {/* Context Banner */}
        {isOrgLinked && (
          <Card className="p-4 mb-6 bg-violet/10 border-violet/20">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-violet" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Creating experiment linked to {orgName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Your personal reflections will stay private. Only aggregate insights will be
                  shared.
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild className="ml-auto">
                <Link href={makePersonalHref}>
                  <Home className="w-4 h-4 mr-2" />
                  Make Personal
                </Link>
              </Button>
            </div>
          </Card>
        )}

        {!isOrgLinked && (
          <Card className="p-4 mb-6 bg-muted/50 border-border">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Creating personal experiment</p>
                <p className="text-xs text-muted-foreground">
                  This experiment is completely private. You can link it to an organisation later if
                  you want.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Experiment Creation Form */}
        <ExperimentFormPanel />
      </div>
    </div>
  );
}
