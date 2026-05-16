"use client";

import { useState, useTransition } from "react";
import { Search, UserCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { assignPackageToUser } from "@/app/actions/admin/packages";
import type { AccessPackage } from "@prisma/client";

type UserRow = {
  clerkUserId: string;
  email: string | null;
  role: string;
  accountType: string;
  createdAt: Date;
  packageAssignment: { packageId: string; package: { name: string; key: string } } | null;
};

const PACKAGE_COLORS: Record<string, string> = {
  testing: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300",
  free: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300",
  premium: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300",
};

function packageBadge(key: string) {
  return PACKAGE_COLORS[key] ?? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300";
}

function AssignDropdown({
  userId,
  currentPackageId,
  packages,
}: {
  userId: string;
  currentPackageId: string | null;
  packages: AccessPackage[];
}) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const assign = (packageId: string | null) => {
    setOpen(false);
    startTransition(async () => {
      await assignPackageToUser(userId, packageId);
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
      >
        Assign
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 min-w-[160px] rounded-xl border border-border bg-background shadow-lg">
            <div className="p-1">
              <button
                type="button"
                onClick={() => assign(null)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-left transition-colors hover:bg-muted",
                  currentPackageId === null && "text-muted-foreground"
                )}
              >
                <X className="h-3 w-3" />
                Remove assignment
              </button>
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => assign(pkg.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs text-left transition-colors hover:bg-muted",
                    currentPackageId === pkg.id && "font-semibold text-primary"
                  )}
                >
                  <span>{pkg.name}</span>
                  {currentPackageId === pkg.id && <UserCheck className="h-3 w-3" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function UsersClient({
  users,
  packages,
}: {
  users: UserRow[];
  packages: AccessPackage[];
}) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? users.filter(
        (u) =>
          u.email?.toLowerCase().includes(search.toLowerCase()) ||
          u.clerkUserId.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage user package assignments.</p>
        </div>
        <span className="text-sm text-muted-foreground">{users.length} total</span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or ID…"
          className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary/50"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-background overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 border-b border-border/50 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          <span>User</span>
          <span className="text-right">Role</span>
          <span className="text-right">Package</span>
          <span className="text-right">Assign</span>
        </div>
        <div className="divide-y divide-border/50">
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">No users found.</div>
          ) : (
            filtered.map((user) => {
              const assignment = user.packageAssignment;
              return (
                <div
                  key={user.clerkUserId}
                  className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.email ?? "No email"}
                    </p>
                    <p className="truncate text-[10px] font-mono text-muted-foreground">{user.clerkUserId}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground capitalize">{user.role}</span>
                  <div className="shrink-0">
                    {assignment ? (
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                          packageBadge(assignment.package.key)
                        )}
                      >
                        {assignment.package.name}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Default</span>
                    )}
                  </div>
                  <div className="shrink-0">
                    <AssignDropdown
                      userId={user.clerkUserId}
                      currentPackageId={assignment?.packageId ?? null}
                      packages={packages}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
