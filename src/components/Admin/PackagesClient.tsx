"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Trash2, Package, Settings2, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createAccessPackage, deleteAccessPackage } from "@/app/actions/admin/packages";
import { FEATURE_CATALOG } from "@/lib/feature-catalog";
import type { AccessPackage } from "@prisma/client";

type PackageWithCount = AccessPackage & { _count: { userAssignments: number; organisations: number } };

const PACKAGE_COLORS: Record<string, { dot: string; badge: string }> = {
  testing: { dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300" },
  free:    { dot: "bg-blue-400",  badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300" },
  premium: { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300" },
};

function getColor(key: string) {
  return PACKAGE_COLORS[key] ?? { dot: "bg-violet-400", badge: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300" };
}

function enabledFeatureCount(features: Record<string, boolean>) {
  return Object.values(features).filter(Boolean).length;
}

export function PackagesClient({ packages }: { packages: PackageWithCount[] }) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [, startCreate] = useTransition();
  const [, startDelete] = useTransition();

  const totalFeatures = FEATURE_CATALOG.flatMap((g) => g.features).length;

  const handleCreate = () => {
    if (!name.trim()) return;
    setCreateError(null);
    startCreate(async () => {
      const res = await createAccessPackage({ name, description });
      if ("error" in res) { setCreateError(res.error); return; }
      setShowCreate(false);
      setName("");
      setDescription("");
    });
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId !== id) { setConfirmDeleteId(id); return; }
    startDelete(async () => {
      await deleteAccessPackage(id);
      setConfirmDeleteId(null);
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">Admin</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">Access Packages</h1>
          <p className="mt-1 text-sm text-muted-foreground">Define feature bundles. Assign them to users or organisations.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New package
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="mb-6 rounded-2xl border border-border bg-background p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">New Package</h2>
            <button type="button" onClick={() => { setShowCreate(false); setCreateError(null); }} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. Pro, Enterprise"
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional"
                className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
              />
            </div>
          </div>
          {createError && <p className="mt-2 text-xs text-destructive">{createError}</p>}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              disabled={!name.trim()}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40"
            >
              Create package
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">All features will be disabled by default. Edit features after creating.</p>
        </div>
      )}

      {/* Package cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => {
          const colors = getColor(pkg.key);
          const features = pkg.features as Record<string, boolean>;
          const enabledCount = enabledFeatureCount(features);
          const isConfirmDelete = confirmDeleteId === pkg.id;

          return (
            <div
              key={pkg.id}
              className="flex flex-col rounded-2xl border border-border bg-background overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 px-5 py-4 border-b border-border/50">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`h-3 w-3 shrink-0 rounded-full ${colors.dot}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{pkg.name}</p>
                    {pkg.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{pkg.description}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {pkg.isSystem && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">System</span>}
                  {pkg.isDefault && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Default</span>}
                </div>
              </div>

              {/* Feature count */}
              <div className="px-5 py-3 flex-1">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{enabledCount}/{totalFeatures} features enabled</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${totalFeatures ? (enabledCount / totalFeatures) * 100 : 0}%` }}
                  />
                </div>
                {/* Feature pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {FEATURE_CATALOG.flatMap((g) => g.features).map((f) => (
                    <span
                      key={f.key}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        features[f.key]
                          ? colors.badge
                          : "border-border bg-muted/30 text-muted-foreground line-through"
                      )}
                    >
                      {f.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border/50 px-5 py-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {pkg._count.userAssignments} users · {pkg._count.organisations} orgs
                </span>
                <div className="flex items-center gap-2">
                  {!pkg.isSystem && (
                    <button
                      type="button"
                      onClick={() => handleDelete(pkg.id)}
                      title={isConfirmDelete ? "Click again to confirm" : "Delete"}
                      className={cn(
                        "rounded-lg p-1.5 transition-colors",
                        isConfirmDelete ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                      )}
                    >
                      {isConfirmDelete ? <AlertTriangle className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                  )}
                  <Link
                    href={`/admin/packages/${pkg.id}`}
                    className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <Settings2 className="h-3 w-3" />
                    Edit features
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
