"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Plus, ArrowRight, Users } from "lucide-react";
import Link from "next/link";

// Mock data - replace with real API call
const userOrganisations = [
  {
    id: "org1",
    name: "Acme Corp",
    description: "Productivity and wellness experiments",
    memberCount: 24,
    activeExperiments: 12,
  },
  {
    id: "org2",
    name: "Design Team",
    description: "Creative process and collaboration",
    memberCount: 8,
    activeExperiments: 5,
  },
];

const pendingInvitations = [
  {
    id: "inv1",
    orgName: "Engineering Team",
    experimentTitle: "Focus & Deep Work Tracking",
    invitedBy: "John Doe",
  },
];

export default function OrganisationsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Organisations
            </h1>
            <p className="text-muted-foreground">
              Manage your organisation memberships and team experiments
            </p>
          </div>
          <Button asChild>
            <Link href="/organisations/join">
              <Plus className="w-4 h-4 mr-2" />
                      Join Organisation
            </Link>
          </Button>
        </div>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Pending Invitations
            </h2>
            <div className="space-y-4">
              {pendingInvitations.map((invitation) => (
                <Card key={invitation.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {invitation.experimentTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Invited by {invitation.invitedBy} from{" "}
                        {invitation.orgName}
                      </p>
                    </div>
                    <Button asChild>
                      <Link href={`/organisations/invites/${invitation.id}`}>
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Organisations List */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Your Organisations
          </h2>
          {userOrganisations.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {userOrganisations.map((org) => (
                <Card
                  key={org.id}
                  className="p-6 hover:border-primary transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-violet/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-violet" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {org.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {org.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{org.memberCount} members</span>
                    </div>
                    <div>
                      <span>{org.activeExperiments} active experiments</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/organisations/${org.id}`}>
                        View Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/organisations/${org.id}/templates`}>
                        Templates
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Organisations
              </h3>
              <p className="text-muted-foreground mb-6">
                You&apos;re not part of any organisations yet. Join one to
                enable team insights and shared templates.
              </p>
              <Button asChild>
                <Link href="/organisations/join">Join Organisation</Link>
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
