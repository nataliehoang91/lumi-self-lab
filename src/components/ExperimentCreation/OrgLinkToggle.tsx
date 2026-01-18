"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Home } from "lucide-react";
import { PrivacyReminderDialog } from "./PrivacyReminderDialog";

interface Organization {
  id: string;
  name: string;
}

interface OrgLinkToggleProps {
  experimentId: string;
  isLinked: boolean;
  linkedOrgId: string | null;
  organizations: Organization[];
  onLink: (orgId: string) => void;
  onUnlink: () => void;
}

export function OrgLinkToggle({
  experimentId,
  isLinked,
  linkedOrgId,
  organizations,
  onLink,
  onUnlink,
}: OrgLinkToggleProps) {
  const [showPrivacyReminder, setShowPrivacyReminder] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(linkedOrgId);

  const handleLinkClick = () => {
    if (organizations.length === 0) {
      // No orgs - redirect to join
      window.location.href = "/organizations?join=true";
      return;
    }

    if (organizations.length === 1) {
      // Single org - show privacy reminder
      setSelectedOrgId(organizations[0].id);
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
    if (confirm("Are you sure you want to unlink this experiment from the organization?")) {
      onUnlink();
    }
  };

  if (isLinked && linkedOrgId) {
    const linkedOrg = organizations.find((org) => org.id === linkedOrgId);
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-violet/10 border border-violet/20">
          <Building2 className="w-4 h-4 text-violet" />
          <span className="text-sm text-foreground">
            Linked to {linkedOrg?.name || "Organization"}
          </span>
        </div>
        <Button
          variant="outline"
          onClick={handleUnlink}
          className="w-full"
        >
          <Home className="w-4 h-4 mr-2" />
          Make Personal
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground mb-3">
          You can link this experiment to an organization later if you want to contribute to team insights. Your personal data will always stay private.
        </p>
        <Button
          variant="outline"
          onClick={handleLinkClick}
          className="w-full"
        >
          <Building2 className="w-4 h-4 mr-2" />
          Link to Organization
        </Button>
      </div>

      <PrivacyReminderDialog
        open={showPrivacyReminder}
        onOpenChange={setShowPrivacyReminder}
        onConfirm={handlePrivacyConfirmed}
        organizations={organizations}
        selectedOrgId={selectedOrgId}
        onOrgSelect={setSelectedOrgId}
      />
    </>
  );
}
