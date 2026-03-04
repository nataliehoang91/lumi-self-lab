"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Home } from "lucide-react";
import { PrivacyReminderDialog } from "./PrivacyReminderDialog";

interface Organisation {
  id: string;
  name: string;
}

interface OrgLinkToggleProps {
  experimentId: string;
  isLinked: boolean;
  linkedOrgId: string | null;
  organisations: Organisation[];
  onLink: (orgId: string) => void;
  onUnlink: () => void;
}

export function OrgLinkToggle({
  experimentId,
  isLinked,
  linkedOrgId,
  organisations,
  onLink,
  onUnlink,
}: OrgLinkToggleProps) {
  const [showPrivacyReminder, setShowPrivacyReminder] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(linkedOrgId);

  const handleLinkClick = () => {
    if (organisations.length === 0) {
      // No orgs - redirect to join
      window.location.href = "/org";
      return;
    }

    if (organisations.length === 1) {
      // Single org - show privacy reminder
      setSelectedOrgId(organisations[0].id);
      setShowPrivacyReminder(true);
    } else {
      // Multiple orgs - show privacy reminder with selector
      setShowPrivacyReminder(true);
    }
  };

  const handlePrivacyConfirmed = () => {
    if (selectedOrgId) {
      onLink(selectedOrgId);
      setShowPrivacyReminder(false);
    }
  };

  const handleUnlink = () => {
    if (
      confirm("Are you sure you want to unlink this experiment from the organisation?")
    ) {
      onUnlink();
    }
  };

  if (isLinked && linkedOrgId) {
    const linkedOrg = organisations.find((org) => org.id === linkedOrgId);
    return (
      <div className="space-y-3">
        <div
          className="bg-violet/10 border-violet/20 flex items-center gap-2 rounded-xl
            border p-3"
        >
          <Building2 className="text-violet h-4 w-4" />
          <span className="text-foreground text-sm">
            Linked to {linkedOrg?.name || "Organisation"}
          </span>
        </div>
        <Button variant="outline" onClick={handleUnlink} className="w-full">
          <Home className="mr-2 h-4 w-4" />
          Make Personal
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-muted/50 border-border rounded-xl border p-4">
        <p className="text-muted-foreground mb-3 text-sm">
          You can link this experiment to an organisation later if you want to contribute
          to team insights. Your personal data will always stay private.
        </p>
        <Button variant="outline" onClick={handleLinkClick} className="w-full">
          <Building2 className="mr-2 h-4 w-4" />
          Link to Organisation
        </Button>
      </div>

      <PrivacyReminderDialog
        open={showPrivacyReminder}
        onOpenChange={setShowPrivacyReminder}
        onConfirm={handlePrivacyConfirmed}
        organisations={organisations}
        selectedOrgId={selectedOrgId}
        onOrgSelect={setSelectedOrgId}
      />
    </>
  );
}
