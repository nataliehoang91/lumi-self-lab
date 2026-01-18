"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, XCircle, Shield } from "lucide-react";
import Link from "next/link";
import { PrivacyReminderDialog } from "@/components/ExperimentCreation/PrivacyReminderDialog";
import { useState } from "react";

// Mock data - replace with real API call
function getInvitation(inviteId: string) {
  return {
    id: inviteId,
    orgName: "Acme Corp",
    experimentTitle: "Focus & Deep Work Tracking",
    description: "Track your focus patterns and identify optimal work hours",
    invitedBy: "John Doe",
    templateId: "t1",
  };
}

export default function InvitationDetailPage({
  params,
}: {
  params: Promise<{ inviteId: string }>;
}) {
  const { inviteId } = use(params);
  const router = useRouter();
  const invitation = getInvitation(inviteId);
  const [showPrivacyReminder, setShowPrivacyReminder] = useState(false);
  const [acceptanceType, setAcceptanceType] = useState<"link" | "personal" | null>(null);

  const handleAccept = (type: "link" | "personal") => {
    setAcceptanceType(type);
    if (type === "link") {
      setShowPrivacyReminder(true);
    } else {
      // Accept as personal - redirect to creation
      router.push(
        `/experiments/new?assigned=${inviteId}&template=${invitation.templateId}&personal=true`
      );
    }
  };

  const handlePrivacyConfirmed = () => {
    setShowPrivacyReminder(false);
    // Accept and link - redirect to creation
    router.push(
      `/experiments/new?assigned=${inviteId}&template=${invitation.templateId}&org=${invitation.orgName}`
    );
  };

  const handleDecline = () => {
    // TODO: Call API to decline invitation
    router.push("/organizations");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/organizations">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>

        <Card className="p-8">
          <div className="mb-6">
            <Badge className="mb-4 bg-violet/10 text-violet">
              Experiment Invitation
            </Badge>
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              {invitation.experimentTitle}
            </h1>
            <p className="text-muted-foreground">
              From: {invitation.orgName}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Invited by
              </h3>
              <p className="text-muted-foreground">{invitation.invitedBy}</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Description
              </h3>
              <p className="text-muted-foreground">{invitation.description}</p>
            </div>

            <Card className="p-4 bg-muted/50 border-border">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-violet flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    You&apos;re in control
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {invitation.orgName} suggested this experiment because they think it might be valuable for the team. But this is your experiment, and you&apos;re in complete control.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Accept and link it to the organization (share aggregate insights)</li>
                    <li>Accept it as personal (keep it completely private)</li>
                    <li>Decline the invitation (no hard feelings)</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleDecline}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Decline
            </Button>
            <Button
              onClick={() => handleAccept("personal")}
              variant="outline"
              className="flex-1"
            >
              Accept as Personal
            </Button>
            <Button
              onClick={() => handleAccept("link")}
              className="flex-1"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Accept & Link
            </Button>
          </div>
        </Card>
      </div>

      {/* Privacy Reminder */}
      <PrivacyReminderDialog
        open={showPrivacyReminder}
        onOpenChange={setShowPrivacyReminder}
        onConfirm={handlePrivacyConfirmed}
        organizations={[{ id: "org1", name: invitation.orgName }]}
        selectedOrgId="org1"
        onOrgSelect={() => {}}
      />
    </div>
  );
}
