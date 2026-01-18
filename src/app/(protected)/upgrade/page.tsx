"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Check, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

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
      router.push("/manager");
      router.refresh(); // Refresh to show Manager tab
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upgrade account");
      setIsUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Upgrade to Organisation Account
          </h1>
          <p className="text-muted-foreground">
            Unlock organisation management features
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Current Plan */}
          <Card className="p-6 border-2 border-border">
            <div className="mb-4">
              <Badge className="mb-2 bg-muted text-muted-foreground">
                Current Plan
              </Badge>
              <h2 className="text-2xl font-semibold text-foreground">
                Individual
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Personal experiments
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Join organisation experiments
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Link experiments to organisations
              </li>
            </ul>
          </Card>

          {/* Organisation Plan */}
          <Card className="p-6 border-2 border-primary bg-primary/5">
            <div className="mb-4">
              <Badge className="mb-2 bg-primary text-primary-foreground">
                Upgrade
              </Badge>
              <h2 className="text-2xl font-semibold text-foreground">
                Organisation
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Everything in Individual
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Create organisation templates
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Manage organisation experiments
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                View organisation insights
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Invite members to experiments
              </li>
            </ul>
            <Button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full"
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Upgrading...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade Now
                </>
              )}
            </Button>
          </Card>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-destructive/10 border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
        )}

        {/* Info Card */}
        <Card className="p-6 bg-muted/50 border-border">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-violet flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                What happens when you upgrade?
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your account is immediately upgraded to Organisation</li>
                <li>• Manager tab appears in navigation</li>
                <li>• You can create organisation templates</li>
                <li>• You can manage organisation experiments</li>
                <li>• Your personal experiments remain unchanged</li>
                <li>• You can still create personal experiments anytime</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4">
                Note: Payment gateway integration will be added later. For now, upgrade is free.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
