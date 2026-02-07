"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PrivacyReminderDialog } from "@/components/ExperimentCreation/PrivacyReminderDialog";
import { CreationMethodSelector } from "@/components/ExperimentCreation/CreationMethodSelector";

export default function NewExperimentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState<
    "personal" | "organisation" | null
  >(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [showPrivacyReminder, setShowPrivacyReminder] = useState(false);
  const [showMethodSelector, setShowMethodSelector] = useState(false);

  // Check if coming from template or assignment
  const templateId = searchParams.get("template");
  const assignedInviteId = searchParams.get("assigned");
  const orgIdFromParams = searchParams.get("org");

  // Mock: User's organisations (replace with real data)
  const userOrganisations = [
    { id: "org1", name: "Acme Corp" },
    { id: "org2", name: "Design Team" },
  ];

  const handleLocationSelect = (location: "personal" | "organisation") => {
    setSelectedLocation(location);

    if (location === "organisation") {
      if (userOrganisations.length === 0) {
        // No orgs - redirect to join
        router.push("/org");
        return;
      }

      if (userOrganisations.length === 1) {
        // Single org - auto-select
        setSelectedOrgId(userOrganisations[0].id);
        setShowPrivacyReminder(true);
      } else {
        // Multiple orgs - show selector (handled in next step)
        setShowPrivacyReminder(true);
      }
    } else {
      // Personal - go directly to method selection
      setShowMethodSelector(true);
    }
  };

  const handlePrivacyConfirmed = () => {
    setShowPrivacyReminder(false);
    setShowMethodSelector(true);
  };

  const handleMethodSelected = (
    method: "ai-guided" | "template" | "manual"
  ) => {
    const params = new URLSearchParams();

    if (selectedLocation === "organisation" && selectedOrgId) {
      params.set("org", selectedOrgId);
    }

    if (templateId) {
      params.set("template", templateId);
    }

    if (assignedInviteId) {
      params.set("assigned", assignedInviteId);
    }

    if (method === "ai-guided") {
      router.push(`/onboarding/guided?${params.toString()}`);
    } else if (method === "template") {
      // If template is already selected, go to template preview
      if (templateId) {
        router.push(`/experiments/new/from-template?${params.toString()}`);
      } else {
        router.push(`/templates?${params.toString()}`);
      }
    } else {
      // Manual creation - go to creation form
      router.push(`/experiments/new/create?${params.toString()}`);
    }
  };

  // If method selector is shown, render it
  if (showMethodSelector) {
    return (
      <CreationMethodSelector
        onSelect={handleMethodSelected}
        onBack={() => {
          setShowMethodSelector(false);
          setSelectedLocation(null);
        }}
        orgId={selectedOrgId}
        templateId={templateId}
        assignedInviteId={assignedInviteId}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Create New Experiment
          </h1>
          <p className="text-muted-foreground">
            Start your self-reflection journey
          </p>
        </div>

        <Card className="p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Where does this experiment live?
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Personal Option */}
            <button
              onClick={() => handleLocationSelect("personal")}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                selectedLocation === "personal"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Home className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Personal</h3>
                  <span className="text-xs text-primary">Recommended</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Just for me, completely private
              </p>
              <p className="text-xs text-muted-foreground">
                This experiment is yours alone. Your check-ins, reflections, and
                insights are completely private. You can always link it to an
                organisation later if you change your mind.
              </p>
            </button>

            {/* Organisation Option */}
            {userOrganisations.length > 0 ? (
              <button
                onClick={() => handleLocationSelect("organisation")}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  selectedLocation === "organisation"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-6 h-6 text-violet" />
                  <h3 className="font-semibold text-foreground">
                    With an organisation
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Share aggregate insights (Your reflections stay private)
                </p>
                <p className="text-xs text-muted-foreground">
                  Link this experiment to an organisation to contribute to team
                  insights. Your personal reflections and text responses remain
                  private. Only aggregate patterns (like average mood scores)
                  are shared.
                </p>
              </button>
            ) : (
              <div className="p-6 rounded-2xl border-2 border-border/50 bg-muted/30">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                  <h3 className="font-semibold text-muted-foreground">
                    With an organisation
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Join an organisation to enable team insights
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/org">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {selectedLocation && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedLocation(null)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  if (selectedLocation === "organisation") {
                    if (userOrganisations.length > 1) {
                      // Show org selector
                      setShowPrivacyReminder(true);
                    } else {
                      handleLocationSelect("organisation");
                    }
                  } else {
                    handleLocationSelect("personal");
                  }
                }}
                className="flex-1"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Privacy Reminder Dialog */}
      <PrivacyReminderDialog
        open={showPrivacyReminder}
        onOpenChange={setShowPrivacyReminder}
        onConfirm={handlePrivacyConfirmed}
        organisations={userOrganisations}
        selectedOrgId={selectedOrgId}
        onOrgSelect={setSelectedOrgId}
      />
    </div>
  );
}
