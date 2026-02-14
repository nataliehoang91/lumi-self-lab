"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Building2, CheckCircle2 } from "lucide-react";

type InviteDetails = {
  organisationId: string;
  organisationName: string;
  email: string;
  role: "member" | "team_manager" | "org_admin";
  expiresAt: string;
};

function roleLabel(role: string): string {
  if (role === "org_admin") return "organisation admin";
  if (role === "team_manager") return "team manager";
  return "member";
}

export default function OrgInviteAcceptPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const [details, setDetails] = useState<InviteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/org-invites/${token}`)
      .then((res) => {
        if (!res.ok)
          return res.json().then((d) => {
            throw new Error(d.error ?? "Invalid invite");
          });
        return res.json();
      })
      .then((data) => {
        setDetails(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "This invite is invalid or has expired.");
        setDetails(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleAccept = async () => {
    if (!details) return;
    setAcceptError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/org-invites/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.error ?? "Could not accept";
        if (res.status === 404 && (msg.includes("expired") || msg.includes("Invalid"))) {
          setAcceptError("This invite has expired.");
        } else if (res.status === 403 && msg.includes("different email")) {
          setAcceptError(
            "This invite was sent to a different email address. Sign in with that account to accept."
          );
        } else if (res.status === 409 && msg.includes("already a member")) {
          setAcceptError("You are already a member of this organisation.");
        } else {
          setAcceptError(msg);
        }
        return;
      }
      router.push(`/org/${data.organisationId}`);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <Loader2 className="size-8 animate-spin mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading invitation…</p>
        </Card>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <p className="text-destructive font-medium mb-2">Invalid or expired invite</p>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <Button asChild variant="outline">
            <Link href="/org">Go to organisations</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Join an organisation workspace
            </h1>
            <p className="text-sm text-muted-foreground">
              You're joining {details.organisationName} as a {roleLabel(details.role)}.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          This adds you to the organisation workspace. You are not creating a new account—you're
          joining with your existing sign-in.
        </p>
        {acceptError && <p className="text-sm text-destructive mb-4">{acceptError}</p>}
        <div className="flex gap-3">
          <Button onClick={handleAccept} disabled={submitting} className="flex-1 gap-2">
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Accepting…
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" />
                Accept invitation
              </>
            )}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/org">Cancel</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
