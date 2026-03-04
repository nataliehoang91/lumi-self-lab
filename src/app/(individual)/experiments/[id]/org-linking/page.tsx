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
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/experiments/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Experiment
          </Link>
        </Button>

        <Card className="p-8">
          <div className="mb-6">
            <h1 className="text-foreground mb-2 text-2xl font-semibold">
              Organisation Linking
            </h1>
            <p className="text-muted-foreground">{experiment.title}</p>
          </div>

          {/* Current Status */}
          <div className="mb-8">
            <h2 className="text-foreground mb-4 font-semibold">Current Status</h2>
            {isLinked && linkedOrgId ? (
              <Card className="bg-violet/10 border-violet/20 p-4">
                <div className="flex items-center gap-3">
                  <Building2 className="text-violet h-5 w-5" />
                  <div>
                    <p className="text-foreground font-medium">
                      Linked to {organisations.find((o) => o.id === linkedOrgId)?.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      This experiment contributes to team insights
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-muted/50 border-border p-4">
                <div className="flex items-center gap-3">
                  <Home className="text-muted-foreground h-5 w-5" />
                  <div>
                    <p className="text-foreground font-medium">Personal Experiment</p>
                    <p className="text-muted-foreground text-sm">
                      This experiment is completely private
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Privacy Info */}
          <Card className="bg-violet/10 border-violet/20 mb-8 p-6">
            <div className="flex items-start gap-3">
              <Shield className="text-violet mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="text-foreground mb-2 font-semibold">Privacy Protected</h3>
                <div className="text-muted-foreground space-y-2 text-sm">
                  <p>
                    When linked to an organisation, your experiment contributes to
                    aggregate insights. Your personal data stays private.
                  </p>
                  <div>
                    <p className="text-foreground mb-1 font-medium">
                      Organisation will see:
                    </p>
                    <ul className="ml-2 list-inside list-disc">
                      <li>Aggregate patterns (averages, trends)</li>
                      <li>Participation rates</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-foreground mb-1 font-medium">
                      Organisation will NOT see:
                    </p>
                    <ul className="ml-2 list-inside list-disc">
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
