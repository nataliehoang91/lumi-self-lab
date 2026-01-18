"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Home, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { OrgLinkToggle } from "@/components/ExperimentCreation/OrgLinkToggle";

// Mock data - replace with API calls
function getExperiment(experimentId: string) {
  return {
    id: experimentId,
    title: "Focus & Deep Work Tracking",
    orgId: null, // or "org1" if linked
    orgName: null, // or "Acme Corp" if linked
  };
}

function getUserOrganisations() {
  return [
    { id: "org1", name: "Acme Corp" },
    { id: "org2", name: "Design Team" },
  ];
}

export default function ExperimentOrgLinkingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const experiment = getExperiment(id);
  const organisations = getUserOrganisations();
  const [isLinked, setIsLinked] = useState(!!experiment.orgId);
  const [linkedOrgId, setLinkedOrgId] = useState<string | null>(experiment.orgId);

  const handleLink = async (orgId: string) => {
    // TODO: Call API to link experiment
    // await fetch(`/api/experiments/${id}/link`, { method: "PATCH", body: JSON.stringify({ orgId }) });
    setIsLinked(true);
    setLinkedOrgId(orgId);
    router.push(`/experiments/${id}`);
  };

  const handleUnlink = async () => {
    // TODO: Call API to unlink experiment
    // await fetch(`/api/experiments/${id}/unlink`, { method: "PATCH" });
    setIsLinked(false);
    setLinkedOrgId(null);
    router.push(`/experiments/${id}`);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/experiments/${id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Experiment
          </Link>
        </Button>

        <Card className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Organisation Linking
            </h1>
            <p className="text-muted-foreground">
              {experiment.title}
            </p>
          </div>

          {/* Current Status */}
          <div className="mb-8">
            <h2 className="font-semibold text-foreground mb-4">
              Current Status
            </h2>
            {isLinked && linkedOrgId ? (
              <Card className="p-4 bg-violet/10 border-violet/20">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-violet" />
                  <div>
                    <p className="font-medium text-foreground">
                      Linked to {organisations.find((o) => o.id === linkedOrgId)?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This experiment contributes to team insights
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-4 bg-muted/50 border-border">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      Personal Experiment
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This experiment is completely private
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Privacy Info */}
          <Card className="p-6 bg-violet/10 border-violet/20 mb-8">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-violet flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Privacy Protected
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    When linked to an organisation, your experiment contributes to aggregate insights. Your personal data stays private.
                  </p>
                  <div>
                    <p className="font-medium text-foreground mb-1">Organisation will see:</p>
                    <ul className="list-disc list-inside ml-2">
                      <li>Aggregate patterns (averages, trends)</li>
                      <li>Participation rates</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Organisation will NOT see:</p>
                    <ul className="list-disc list-inside ml-2">
                      <li>Your personal reflections</li>
                      <li>Your text responses</li>
                      <li>Your individual check-in data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Link/Unlink Component */}
          <OrgLinkToggle
            experimentId={id}
            isLinked={isLinked}
            linkedOrgId={linkedOrgId}
            organisations={organisations}
            onLink={handleLink}
            onUnlink={handleUnlink}
          />
        </Card>
      </div>
    </div>
  );
}
