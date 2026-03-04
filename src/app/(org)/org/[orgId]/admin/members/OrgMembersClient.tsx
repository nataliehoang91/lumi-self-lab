"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, UserPlus, Loader2, Trash2, Mail } from "lucide-react";

type Role = "member" | "team_manager" | "org_admin";

type Member = {
  id: string;
  clerkUserId: string;
  email: string | null;
  role: Role;
  joinedAt: string;
};

type PendingInvite = {
  id: string;
  email: string;
  role: Role;
  expiresAt: string;
  createdAt: string;
};

const ROLES: Role[] = ["member", "team_manager", "org_admin"];

function formatJoined(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function friendlyAddError(apiError: string): string {
  if (apiError.includes("not found") || apiError.includes("Invitation flow")) {
    return "No user with this email exists yet.";
  }
  if (apiError.includes("already a member")) {
    return "This user is already a member of the organisation.";
  }
  return apiError;
}

function friendlyRoleOrRemoveError(apiError: string): string {
  if (
    apiError.includes("last org admin") ||
    apiError.includes("last org_admin") ||
    apiError.includes("one organisation admin")
  ) {
    return "You must keep at least one organisation admin.";
  }
  return apiError;
}

export function OrgMembersClient({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentClerkUserId, setCurrentClerkUserId] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/users/identity")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.clerkUserId) {
          setCurrentClerkUserId(data.clerkUserId);
          setIsSuperAdmin(data.role === "super_admin");
        }
      })
      .catch(() => {});
  }, []);

  const fetchMembers = useCallback(async () => {
    setError(null);
    const res = await fetch(`/api/orgs/${orgId}/members`);
    if (!res.ok) {
      setError("Failed to load members");
      setMembers([]);
      return;
    }
    const data = await res.json();
    setMembers(data.members ?? []);
  }, [orgId]);

  useEffect(() => {
    fetchMembers().finally(() => setLoading(false));
  }, [fetchMembers]);

  const orgAdminCount = members.filter((m) => m.role === "org_admin").length;

  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<Role>("member");
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [invitesLoading, setInvitesLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("member");
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [lastInviteLink, setLastInviteLink] = useState<string | null>(null);

  const fetchInvites = useCallback(async () => {
    const res = await fetch(`/api/orgs/${orgId}/invites`);
    if (!res.ok) {
      setInvites([]);
      return;
    }
    const data = await res.json();
    setInvites(data.invites ?? []);
  }, [orgId]);

  useEffect(() => {
    fetchInvites().finally(() => setInvitesLoading(false));
  }, [fetchInvites]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    const email = inviteEmail.trim().toLowerCase();
    if (!email) {
      setInviteError("Email is required");
      return;
    }
    setInviteSubmitting(true);
    try {
      const res = await fetch(`/api/orgs/${orgId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: inviteRole }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setInviteError(data.error ?? "Failed to send invite");
        return;
      }
      setInviteEmail("");
      setInviteRole("member");
      if (typeof window !== "undefined" && data.token) {
        setLastInviteLink(`${window.location.origin}/org/invites/${data.token}`);
      }
      setInviteError(null);
      await fetchInvites();
      router.refresh();
    } finally {
      setInviteSubmitting(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    const email = addEmail.trim().toLowerCase();
    if (!email) {
      setAddError("Email is required");
      return;
    }
    setAddSubmitting(true);
    try {
      const res = await fetch(`/api/orgs/${orgId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: addRole }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAddError(friendlyAddError(data.error ?? "Failed to add member"));
        return;
      }
      setAddEmail("");
      setAddRole("member");
      await fetchMembers();
      router.refresh();
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleRoleChange = async (memberId: string, role: Role) => {
    const res = await fetch(`/api/orgs/${orgId}/members/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(friendlyRoleOrRemoveError(data.error ?? "Failed to update role"));
      return;
    }
    await fetchMembers();
    router.refresh();
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm("Remove this member from the organisation?")) return;
    const res = await fetch(`/api/orgs/${orgId}/members/${memberId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(friendlyRoleOrRemoveError(data.error ?? "Failed to remove member"));
      return;
    }
    await fetchMembers();
    router.refresh();
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/org/${orgId}/admin`}>
            <ArrowLeft className="mr-2 size-4" />
            Back to org admin
          </Link>
        </Button>

        <h1 className="text-foreground mb-2 text-2xl font-semibold">Members</h1>
        <p className="text-muted-foreground mb-6">
          Manage who has access to this organisation workspace. Add existing users or
          invite a teammate by email.
        </p>

        {/* Invite a teammate */}
        <Card className="mb-6 p-6">
          <h2 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
            <Mail className="size-4" />
            Invite a teammate
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Send an invite by email. They can accept after signing in to join this
            organisation workspace.
          </p>
          <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-4">
            <div className="min-w-[200px] flex-1">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@example.com"
                className="mt-1"
              />
            </div>
            <div className="w-[180px]">
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as Role)}>
                <SelectTrigger id="invite-role" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r === "org_admin"
                        ? "Org admin"
                        : r === "team_manager"
                          ? "Team manager"
                          : "Member"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={inviteSubmitting}>
              {inviteSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send invite"
              )}
            </Button>
          </form>
          {inviteError && <p className="text-destructive mt-2 text-sm">{inviteError}</p>}
          {lastInviteLink && (
            <p className="text-muted-foreground mt-2 text-sm">
              Invite sent. Share this link with your teammate:{" "}
              <a
                href={lastInviteLink}
                className="text-primary break-all underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {lastInviteLink}
              </a>
            </p>
          )}

          {/* Pending invites */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-foreground mb-3 font-medium">Pending invites</h3>
            {invitesLoading ? (
              <p className="text-muted-foreground text-sm">Loading…</p>
            ) : invites.length === 0 ? (
              <p className="text-muted-foreground text-sm">No pending invites.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="p-2 text-left font-medium">Email</th>
                      <th className="p-2 text-left font-medium">Role</th>
                      <th className="p-2 text-left font-medium">Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites.map((i) => (
                      <tr key={i.id} className="border-b last:border-0">
                        <td className="p-2">{i.email}</td>
                        <td className="p-2">
                          {i.role === "org_admin"
                            ? "Org admin"
                            : i.role === "team_manager"
                              ? "Team manager"
                              : "Member"}
                        </td>
                        <td className="text-muted-foreground p-2">
                          {formatJoined(i.expiresAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        {/* Add member (existing user, no invite) */}
        <Card className="mb-8 p-6">
          <h2 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
            <UserPlus className="size-4" />
            Add member
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Add someone who already has an account. They must have signed up first.
          </p>
          {members.length === 1 && (
            <p className="text-muted-foreground mb-4 text-sm">
              You can add teammates by email once they&apos;ve signed up, or invite them
              above.
            </p>
          )}
          <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-4">
            <div className="min-w-[200px] flex-1">
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                placeholder="user@example.com"
                className="mt-1"
              />
            </div>
            <div className="w-[180px]">
              <Label htmlFor="add-role">Role</Label>
              <Select value={addRole} onValueChange={(v) => setAddRole(v as Role)}>
                <SelectTrigger id="add-role" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r === "org_admin"
                        ? "Org admin"
                        : r === "team_manager"
                          ? "Team manager"
                          : "Member"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={addSubmitting}>
              {addSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Adding…
                </>
              ) : (
                "Add"
              )}
            </Button>
          </form>
          {addError && <p className="text-destructive mt-2 text-sm">{addError}</p>}
        </Card>

        {/* Members table */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="text-muted-foreground p-8 text-center">
              <Loader2 className="mx-auto mb-2 size-6 animate-spin" />
              Loading members…
            </div>
          ) : error ? (
            <div className="text-destructive p-8 text-center">
              <p className="mb-1 font-medium">Couldn&apos;t load members</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-muted-foreground p-8 text-center">
              <p className="text-foreground mb-1 font-medium">No members yet</p>
              <p className="text-sm">Add a member using the form above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="p-3 text-left font-medium">Email</th>
                    <th className="p-3 text-left font-medium">Role</th>
                    <th className="p-3 text-left font-medium">Joined</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => {
                    const isCurrentUser =
                      currentClerkUserId != null && m.clerkUserId === currentClerkUserId;
                    const isLastOrgAdmin = m.role === "org_admin" && orgAdminCount === 1;
                    const canChangeRole = !isLastOrgAdmin || isSuperAdmin;
                    const canRemove = !isLastOrgAdmin || isSuperAdmin;
                    return (
                      <tr key={m.id} className="border-b last:border-0">
                        <td className="p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span>{m.email ?? "—"}</span>
                            <span className="flex flex-wrap gap-1">
                              {isCurrentUser && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs font-normal"
                                >
                                  You
                                </Badge>
                              )}
                              {m.role === "org_admin" && (
                                <Badge variant="outline" className="text-xs font-normal">
                                  Org admin
                                </Badge>
                              )}
                              {isCurrentUser && isSuperAdmin && (
                                <Badge
                                  variant="outline"
                                  className="border-violet-500/50 text-xs font-normal
                                    text-violet-600 dark:text-violet-400"
                                >
                                  Platform admin
                                </Badge>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          {canChangeRole ? (
                            <Select
                              value={m.role}
                              onValueChange={(v) => handleRoleChange(m.id, v as Role)}
                            >
                              <SelectTrigger className="h-8 w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLES.map((r) => (
                                  <SelectItem key={r} value={r}>
                                    {r === "org_admin"
                                      ? "Org admin"
                                      : r === "team_manager"
                                        ? "Team manager"
                                        : "Member"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-muted-foreground">Org admin</span>
                          )}
                          {isLastOrgAdmin && !isSuperAdmin && (
                            <p className="text-muted-foreground mt-1 text-xs">
                              At least one organisation admin is required.
                            </p>
                          )}
                        </td>
                        <td className="text-muted-foreground p-3">
                          {formatJoined(m.joinedAt)}
                        </td>
                        <td className="p-3 text-right">
                          {canRemove ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive
                                hover:bg-destructive/10"
                              onClick={() => handleRemove(m.id)}
                              title="Remove member"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          ) : (
                            <span
                              className="text-muted-foreground text-xs"
                              title="At least one organisation admin is required"
                            >
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
