"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Shield, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURE_CATALOG } from "@/lib/feature-catalog";
import { updatePackageFeatures, updatePackageMeta } from "@/app/actions/admin/packages";
import type { AccessPackage } from "@prisma/client";

type PackageWithCount = AccessPackage & { _count: { userAssignments: number; organisations: number } };

export function PackageEditorClient({
  pkg,
  allPackages,
}: {
  pkg: AccessPackage;
  allPackages: PackageWithCount[];
}) {
  const features = pkg.features as Record<string, boolean>;
  const [localFeatures, setLocalFeatures] = useState<Record<string, boolean>>(features);
  const [name, setName] = useState(pkg.name);
  const [description, setDescription] = useState(pkg.description ?? "");
  const [saved, setSaved] = useState(false);
  const [metaSaved, setMetaSaved] = useState(false);
  const [, startSave] = useTransition();
  const [, startMeta] = useTransition();

  const pkgWithCount = allPackages.find((p) => p.id === pkg.id);

  const toggleFeature = (key: string) => {
    setLocalFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSaveFeatures = () => {
    startSave(async () => {
      await updatePackageFeatures(pkg.id, localFeatures);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const handleSaveMeta = () => {
    if (!name.trim()) return;
    startMeta(async () => {
      await updatePackageMeta(pkg.id, { name, description });
      setMetaSaved(true);
      setTimeout(() => setMetaSaved(false), 2000);
    });
  };

  const enabledCount = Object.values(localFeatures).filter(Boolean).length;
  const totalCount = FEATURE_CATALOG.flatMap((g) => g.features).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/packages"
          className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All packages
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">Admin · Packages</p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground flex items-center gap-2">
              {pkg.name}
              {pkg.isSystem && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  <Shield className="h-2.5 w-2.5" />
                  System
                </span>
              )}
              {pkg.isDefault && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  <Star className="h-2.5 w-2.5" />
                  Default
                </span>
              )}
            </h1>
            {pkg.description && <p className="mt-1 text-sm text-muted-foreground">{pkg.description}</p>}
          </div>
          {pkgWithCount && (
            <div className="shrink-0 text-right text-xs text-muted-foreground">
              <p>{pkgWithCount._count.userAssignments} users assigned</p>
              <p>{pkgWithCount._count.organisations} orgs assigned</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Features panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Progress */}
          <div className="rounded-2xl border border-border bg-background p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Features enabled</span>
              <span className="text-muted-foreground">{enabledCount} / {totalCount}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${totalCount ? (enabledCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Feature groups */}
          {FEATURE_CATALOG.map((group) => (
            <div key={group.key} className="rounded-2xl border border-border bg-background overflow-hidden">
              <div className="border-b border-border/50 px-5 py-3">
                <h2 className="text-sm font-semibold text-foreground">{group.label}</h2>
              </div>
              <div className="divide-y divide-border/50">
                {group.features.map((feature) => {
                  const enabled = localFeatures[feature.key] ?? false;
                  return (
                    <div
                      key={feature.key}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{feature.label}</p>
                        {feature.description && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{feature.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        onClick={() => toggleFeature(feature.key)}
                        className={cn(
                          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none",
                          enabled ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                            enabled ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveFeatures}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {saved ? <Check className="h-4 w-4" /> : null}
              {saved ? "Saved!" : "Save features"}
            </button>
            <button
              type="button"
              onClick={() => {
                const all = !FEATURE_CATALOG.flatMap((g) => g.features).every((f) => localFeatures[f.key]);
                setLocalFeatures(Object.fromEntries(FEATURE_CATALOG.flatMap((g) => g.features).map((f) => [f.key, all])));
                setSaved(false);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {FEATURE_CATALOG.flatMap((g) => g.features).every((f) => localFeatures[f.key])
                ? "Disable all"
                : "Enable all"}
            </button>
          </div>
        </div>

        {/* Meta panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-background p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Package info</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">Name</label>
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setMetaSaved(false); }}
                  className="w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setMetaSaved(false); }}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">Key (auto)</label>
                <p className="rounded-xl border border-border/50 bg-muted/20 px-3 py-2 text-sm font-mono text-muted-foreground">{pkg.key}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveMeta}
              disabled={!name.trim()}
              className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
            >
              {metaSaved ? <Check className="h-3.5 w-3.5" /> : null}
              {metaSaved ? "Saved!" : "Update info"}
            </button>
          </div>

          {/* Feature key reference */}
          <div className="rounded-2xl border border-border bg-background p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Feature keys</h2>
            <div className="space-y-1">
              {FEATURE_CATALOG.flatMap((g) => g.features).map((f) => (
                <div key={f.key} className="flex items-center justify-between gap-2">
                  <code className="text-[10px] text-muted-foreground">{f.key}</code>
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    localFeatures[f.key] ? "bg-primary" : "bg-muted"
                  )} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
