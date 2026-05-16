"use client";

import { useState, useTransition } from "react";
import { Search, Building2, UserCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { assignPackageToOrg } from "@/app/actions/admin/packages";
import type { AccessPackage } from "@prisma/client";

type OrgRow = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  memberCount: number;
  package: { id: string; name: string; key: string } | null;
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
  orgId,
  currentPackageId,
  packages,
}: {
  orgId: string;
  currentPackageId: string | null;
  packages: AccessPackage[];
}) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const assign = (packageId: string | null) => {
    setOpen(false);
    startTransition(async () => {
      await assignPackageToOrg(orgId, packageId);
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
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-left transition-colors hover:bg-muted"
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

export function OrgsClient({
  orgs,
  packages,
}: {
  orgs: OrgRow[];
  packages: AccessPackage[];
}) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? orgs.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))
    : orgs;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">Organisations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Assign packages to organisations. Members inherit the org package.
          </p>
        </div>
        <span className="text-sm text-muted-foreground">{orgs.length} total</span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name…"
          className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary/50"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background px-5 py-12 text-center">
          <Building2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No organisations found.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-background overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 border-b border-border/50 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            <span>Organisation</span>
            <span className="text-right">Members</span>
            <span className="text-right">Package</span>
            <span className="text-right">Assign</span>
          </div>
          <div className="divide-y divide-border/50">
            {filtered.map((org) => (
              <div
                key={org.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{org.name}</p>
                  {org.description && (
                    <p className="truncate text-xs text-muted-foreground">{org.description}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {org.memberCount} {org.memberCount === 1 ? "member" : "members"}
                </span>
                <div className="shrink-0">
                  {org.package ? (
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        packageBadge(org.package.key)
                      )}
                    >
                      {org.package.name}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Default</span>
                  )}
                </div>
                <div className="shrink-0">
                  <AssignDropdown
                    orgId={org.id}
                    currentPackageId={org.package?.id ?? null}
                    packages={packages}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
