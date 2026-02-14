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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Unlock More Possibilities
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Unlock{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              team & organisation features
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take your self-reflection practice to the team level. Create organisation workspaces,
            design experiment templates, and gain aggregate insights while respecting
            everyone&apos;s privacy.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Current Plan */}
          <Card className="p-6 bg-card border-border/50 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Individual</h3>
                <p className="text-sm text-muted-foreground">Your current plan</p>
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
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </Card>

          {/* Manager Plan */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30 rounded-3xl relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-second text-second-foreground rounded-full">Recommended</Badge>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Organisation</h3>
                <p className="text-sm text-primary">Everything in Individual, plus:</p>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {[
                "Create & manage organisation workspaces",
                "Design experiment templates",
                "Add & manage members",
                "View aggregate team insights",
                "Assign experiments to teams",
                "Privacy-respecting analytics",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Unlocking…
                </>
              ) : (
                <>
                  Unlock team & organisation features
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-6 bg-destructive/10 border-destructive/20 rounded-2xl">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
        )}

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
            Organisation Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <Card key={i} className="p-5 bg-card border-border/50 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-second/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-second" />
                </div>
                <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy Assurance */}
        <Card className="p-6 bg-primary/5 border-primary/20 rounded-3xl text-center">
          <Shield className="w-12 h-12 mx-auto text-sky-500 dark:text-sky-400 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Privacy is Non-Negotiable</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Even with team & organisation features, you&apos;ll only see aggregate data. Individual
            responses, personal reflections, and text entries are never shared with organisation
            admins or other members. Trust is the foundation of Self-Lab.
          </p>
        </Card>
      </div>
    </IndividualContainer>
  );
}
