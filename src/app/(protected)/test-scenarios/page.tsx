"use client";

import React from "react";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Crown,
  Users,
  Briefcase,
  ArrowRight,
  Shield,
  Building2,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { useUser, type UserScenario } from "@/hooks/user-context";

export default function TestScenariosPage() {
  const router = useRouter();
  const { scenario, setScenario } = useUser();
  const [selectedScenario, setSelectedScenario] =
    React.useState<UserScenario | null>(null);

  const handleScenarioSwitch = (scenarioId: UserScenario | null) => {
    if (scenarioId) {
      setScenario(scenarioId);
      setSelectedScenario(scenarioId);
      // Redirect to dashboard to see the changes
      router.push("/dashboard");
    }
  };

  const scenarios = [
    {
      id: "individual",
      title: "Individual Account",
      description: "Personal experiments only, can join assigned experiments",
      badge: "Individual",
      icon: User,
      color: "from-primary to-primary/80",
      userDetails: {
        name: "Alex",
        email: "alex@personal.com",
        accountType: "individual",
        orgs: [],
        personalExperiments: 3,
      },
      navItems: ["Dashboard", "Experiments", "Upgrade"],
      permissions: {
        personalExperiment: true,
        joinAssigned: true,
        createTeamExperiment: false,
        assignParticipants: false,
        viewAggregateResult: false,
        createOrg: false,
        assignTeamManagers: false,
      },
      features: [
        "✓ Personal experiments",
        "✓ Join assigned experiments",
        "✗ Cannot create team experiments",
        "✗ Cannot assign participants",
        "✗ Cannot view aggregate results",
        "✗ Cannot create org",
        "✗ Cannot assign team managers",
      ],
    },
    {
      id: "team-manager",
      title: "Team Manager",
      description:
        "Individual account with team management rights (assigned by org admin)",
      badge: "Team Manager",
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
      userDetails: {
        name: "Mike",
        email: "mike@personal.com",
        accountType: "team_manager",
        orgs: [
          {
            name: "Acme Corp",
            role: "team_manager",
            team: "Engineering",
            teamMembers: 12,
          },
        ],
        personalExperiments: 4,
      },
      navItems: ["Dashboard", "Experiments", "Joined Experiments", "Manager"],
      permissions: {
        personalExperiment: true,
        joinAssigned: true,
        createTeamExperiment: true,
        assignParticipants: "team only",
        viewAggregateResult: "team",
        createOrg: false,
        assignTeamManagers: false,
      },
      features: [
        "✓ Personal experiments",
        "✓ Join assigned experiments",
        "✓ Create team experiments",
        "✓ Assign participants (team only)",
        "✓ View aggregate results (team)",
        "✗ Cannot create org",
        "✗ Cannot assign team managers",
      ],
    },
    {
      id: "org-admin",
      title: "Org Admin",
      description: "Can create orgs, authorize team managers, full access",
      badge: "Organization Admin",
      icon: Crown,
      color: "from-violet to-violet/80",
      userDetails: {
        name: "Sarah",
        email: "sarah@acmecorp.com",
        accountType: "org_admin",
        orgs: [
          {
            name: "Acme Corp",
            role: "org_admin",
            teams: 4,
            members: 47,
          },
        ],
        personalExperiments: 2,
      },
      navItems: ["Dashboard", "Experiments", "Organisations", "Manager"],
      permissions: {
        personalExperiment: true,
        joinAssigned: true,
        createTeamExperiment: true,
        assignParticipants: "any team",
        viewAggregateResult: "org-wide",
        createOrg: true,
        assignTeamManagers: true,
      },
      features: [
        "✓ Personal experiments",
        "✓ Join assigned experiments",
        "✓ Create team experiments",
        "✓ Assign participants (any team)",
        "✓ View aggregate results (org-wide)",
        "✓ Create org",
        "✓ Assign team managers",
      ],
    },
  ];

  const currentScenario = scenarios.find((s) => s.id === selectedScenario);
  const IconComponent = currentScenario?.icon || User;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Test User Scenarios
          </h1>
          <p className="text-lg text-muted-foreground">
            Switch between different user roles to test the app experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Scenario Selector */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Select Scenario
            </h2>
            {scenarios.map((scenario) => {
              const ScenarioIcon = scenario.icon;
              return (
                <button
                  key={scenario.id}
                  onClick={() =>
                    handleScenarioSwitch(scenario.id as UserScenario | null)
                  }
                  className={`w-full text-left transition-all rounded-2xl p-5 border-2 ${
                    selectedScenario === scenario.id
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border/50 bg-card hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center text-white flex-shrink-0`}
                    >
                      <ScenarioIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {scenario.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {scenario.description}
                      </p>
                      <div className="mt-3">
                        <Badge className="rounded-full text-xs">
                          {scenario.badge}
                        </Badge>
                      </div>
                    </div>
                    {selectedScenario === scenario.id && (
                      <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scenario Details */}
          {currentScenario && (
            <div className="space-y-6">
              {/* User Card */}
              <Card className="p-6 bg-card border-border/50 rounded-3xl">
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentScenario.color} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}
                  >
                    {currentScenario.userDetails.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">
                      {currentScenario.userDetails.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentScenario.userDetails.email}
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-2 rounded-full capitalize text-xs border-primary/30"
                    >
                      {currentScenario.userDetails.accountType === "org_admin"
                        ? "Organization Admin"
                        : currentScenario.userDetails.accountType ===
                          "team_manager"
                        ? "Team Manager"
                        : "Individual"}
                    </Badge>
                  </div>
                </div>

                {/* Organizations */}
                {currentScenario.userDetails.orgs.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-border/30">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Organizations
                    </h4>
                    {currentScenario.userDetails.orgs.map((org, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-muted/50 mb-2 last:mb-0"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-sm">
                            {org.name}
                          </span>
                          <Badge
                            variant="secondary"
                            className="rounded-full text-xs capitalize ml-auto"
                          >
                            {org.role}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {"teams" in org && typeof org.teams === "number" && (
                            <div>• {org.teams} teams</div>
                          )}
                          {"members" in org &&
                            typeof org.members === "number" && (
                              <div>• {org.members} members</div>
                            )}
                          {"team" in org && typeof org.team === "string" && (
                            <div>• Team: {org.team}</div>
                          )}
                          {"teamMembers" in org &&
                            typeof org.teamMembers === "number" && (
                              <div>• {org.teamMembers} team members</div>
                            )}
                          {"assignedExperiments" in org &&
                            typeof org.assignedExperiments === "number" && (
                              <div>
                                • {org.assignedExperiments} assigned experiments
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Personal Experiments */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Personal
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {currentScenario.userDetails.personalExperiments} personal
                    experiments
                  </p>
                </div>
              </Card>

              {/* Navigation & Features */}
              <Card className="p-6 bg-card border-border/50 rounded-3xl">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Navbar Links
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentScenario.navItems.map((item, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="rounded-lg text-xs px-3 py-1.5 border-primary/30"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Features Available
                </h3>
                <ul className="space-y-2">
                  {currentScenario.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">
                      {feature.startsWith("✓") ? (
                        <span className="text-emerald-600 font-medium">
                          {feature}
                        </span>
                      ) : (
                        <span className="text-red-500/70">{feature}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  className="w-full rounded-2xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() =>
                    handleScenarioSwitch(
                      (currentScenario.id as UserScenario) || null
                    )
                  }
                >
                  Switch to {currentScenario.userDetails.name}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                {scenario === currentScenario.id && (
                  <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Currently Active
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {!selectedScenario && (
          <div className="mt-12 text-center">
            <Shield className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-lg text-muted-foreground">
              Select a scenario to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
