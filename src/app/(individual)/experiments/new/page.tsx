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

  const handleMethodSelected = (method: "ai-guided" | "template" | "manual") => {
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
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-semibold">
            Create New Experiment
          </h1>
          <p className="text-muted-foreground">Start your self-reflection journey</p>
        </div>

        <Card className="p-8">
          <h2 className="text-foreground mb-6 text-xl font-semibold">
            Where does this experiment live?
          </h2>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {/* Personal Option */}
            <button
              onClick={() => handleLocationSelect("personal")}
              className={`rounded-2xl border-2 p-6 text-left transition-all ${
                selectedLocation === "personal"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
                }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <Home className="text-primary h-6 w-6" />
                <div>
                  <h3 className="text-foreground font-semibold">Personal</h3>
                  <span className="text-primary text-xs">Recommended</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-2 text-sm">
                Just for me, completely private
              </p>
              <p className="text-muted-foreground text-xs">
                This experiment is yours alone. Your check-ins, reflections, and insights
                are completely private. You can always link it to an organisation later if
                you change your mind.
              </p>
            </button>

            {/* Organisation Option */}
            {userOrganisations.length > 0 ? (
              <button
                onClick={() => handleLocationSelect("organisation")}
                className={`rounded-2xl border-2 p-6 text-left transition-all ${
                  selectedLocation === "organisation"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <Building2 className="text-violet h-6 w-6" />
                  <h3 className="text-foreground font-semibold">With an organisation</h3>
                </div>
                <p className="text-muted-foreground mb-2 text-sm">
                  Share aggregate insights (Your reflections stay private)
                </p>
                <p className="text-muted-foreground text-xs">
                  Link this experiment to an organisation to contribute to team insights.
                  Your personal reflections and text responses remain private. Only
                  aggregate patterns (like average mood scores) are shared.
                </p>
              </button>
            ) : (
              <div className="border-border/50 bg-muted/30 rounded-2xl border-2 p-6">
                <div className="mb-3 flex items-center gap-3">
                  <Building2 className="text-muted-foreground h-6 w-6" />
                  <h3 className="text-muted-foreground font-semibold">
                    With an organisation
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4 text-sm">
                  Join an organisation to enable team insights
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/org">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
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
                Continue <ArrowRight className="ml-2 h-4 w-4" />
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
