"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ArrowLeft } from "lucide-react";

/**
 * Create an organisation (Phase 4.1). Organisation is a workspace for your team, not an identity.
 * POST /api/orgs → redirect to /org/[orgId] on success.
 */
export default function CreateOrganisationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orgs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          description: description.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to create organisation");
        return;
      }
      if (data.id) {
        router.push(`/org/${data.id}`);
        router.refresh();
      } else {
        setError("Invalid response");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/org">
            <ArrowLeft className="mr-2 size-4" />
            Back to organisations
          </Link>
        </Button>

        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div
              className="bg-violet/10 flex h-10 w-10 items-center justify-center
                rounded-xl"
            >
              <Building2 className="text-violet h-5 w-5" />
            </div>
            <div>
              <h1 className="text-foreground text-xl font-semibold">
                Create an organisation
              </h1>
              <p className="text-muted-foreground text-sm">
                An organisation is a workspace for your team. You will have the
                organisation admin role.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name (required)</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Team"
                className="mt-1"
                required
                maxLength={255}
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of the organisation"
                className="mt-1"
                maxLength={500}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating…" : "Create organisation"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/org">Cancel</Link>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
