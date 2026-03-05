"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IndividualContainer } from "@/components/GeneralComponents/individual-container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Check,
  Building2,
  Users,
  LayoutGrid,
  BarChart3,
  Shield,
  Sparkles,
  ArrowRight,
  Zap,
  Loader2,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Create organisation workspaces",
    description: "Build teams and departments for collaborative self-experiments",
  },
  {
    icon: LayoutGrid,
    title: "Design Templates",
    description: "Create reusable experiment templates for your team members",
  },
  {
    icon: Users,
    title: "Add & manage members",
    description: "Add team members by email and manage organisation admin role",
  },
  {
    icon: BarChart3,
    title: "Aggregate Insights",
    description: "View team-wide trends and patterns while respecting privacy",
  },
  {
    icon: Shield,
    title: "Privacy Controls",
    description: "Fine-grained control over what data is shared and aggregated",
  },
  {
    icon: Sparkles,
    title: "AI Team Insights",
    description: "Get AI-powered recommendations for your team's growth",
  },
];

export default function UpgradePage() {
  const router = useRouter();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upgrade");
      }

      // Success - redirect to manager dashboard
      router.push("/org");
      router.refresh(); // Refresh to show Manager tab
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upgrade account");
      setIsUpgrading(false);
    }
  };

  return (
    <IndividualContainer>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4
              py-2 text-sm font-medium text-yellow-700 dark:bg-yellow-900/30
              dark:text-yellow-400"
          >
            <Zap className="h-4 w-4" />
            Unlock More Possibilities
          </div>
          <h1 className="text-foreground mb-4 text-4xl font-bold">
            Unlock{" "}
            <span
              className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text
                text-transparent"
            >
              team & organisation features
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Take your self-reflection practice to the team level. Create organisation
            workspaces, design experiment templates, and gain aggregate insights while
            respecting everyone&apos;s privacy.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          {/* Current Plan */}
          <Card className="bg-card border-border/50 rounded-3xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <div
                className="bg-muted flex h-10 w-10 items-center justify-center
                  rounded-2xl"
              >
                <Users className="text-muted-foreground h-5 w-5" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Individual</h3>
                <p className="text-muted-foreground text-sm">Your current plan</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Personal experiments",
                "Unlimited check-ins",
                "Personal insights & analytics",
                "Join organizations as member",
                "Accept experiment invitations",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="text-muted-foreground flex items-center gap-3 text-sm"
                >
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </Card>

          {/* Manager Plan */}
          <Card
            className="from-primary/5 to-primary/10 border-primary/30 relative
              overflow-hidden rounded-3xl bg-gradient-to-br p-6"
          >
            <div className="absolute top-4 right-4">
              <Badge className="bg-second text-second-foreground rounded-full">
                Recommended
              </Badge>
            </div>
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl
                  bg-gradient-to-br from-amber-500 to-amber-400"
              >
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Organisation</h3>
                <p className="text-primary text-sm">Everything in Individual, plus:</p>
              </div>
            </div>
            <ul className="mb-6 space-y-3">
              {[
                "Create & manage organisation workspaces",
                "Design experiment templates",
                "Add & manage members",
                "View aggregate team insights",
                "Assign experiments to teams",
                "Privacy-respecting analytics",
              ].map((feature, i) => (
                <li key={i} className="text-foreground flex items-center gap-3 text-sm">
                  <Check className="text-primary h-4 w-4 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full
                gap-2 rounded-2xl"
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Unlocking…
                </>
              ) : (
                <>
                  Unlock team & organisation features
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="bg-destructive/10 border-destructive/20 mb-6 rounded-2xl p-4">
            <p className="text-destructive text-sm">{error}</p>
          </Card>
        )}

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-foreground mb-8 text-center text-2xl font-semibold">
            Organisation Features
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Card key={i} className="bg-card border-border/50 rounded-2xl p-5">
                <div
                  className="bg-second/10 mb-3 flex h-10 w-10 items-center justify-center
                    rounded-xl"
                >
                  <feature.icon className="text-second h-5 w-5" />
                </div>
                <h3 className="text-foreground mb-1 font-medium">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy Assurance */}
        <Card className="bg-primary/5 border-primary/20 rounded-3xl p-6 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-sky-500 dark:text-sky-400" />
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            Privacy is Non-Negotiable
          </h3>
          <p className="text-muted-foreground mx-auto max-w-xl">
            Even with team & organisation features, you&apos;ll only see aggregate data.
            Individual responses, personal reflections, and text entries are never shared
            with organisation admins or other members. Trust is the foundation of
            SelfWithin.
          </p>
        </Card>
      </div>
    </IndividualContainer>
  );
}
