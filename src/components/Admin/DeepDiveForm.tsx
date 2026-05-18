"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DeepDiveTipTap } from "./DeepDiveTipTap";
import { createDeepDive, updateDeepDive } from "@/app/actions/admin/deep-dive";
import type { BibleDeepDive } from "@prisma/client";

interface Props {
  entry?: BibleDeepDive;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-foreground">
        {label}{required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT = "w-full rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors";
const TEXTAREA = INPUT + " resize-none";

export function DeepDiveForm({ entry }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [slug, setSlug] = useState(entry?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!entry?.slug);
  const [lang, setLang] = useState(entry?.lang ?? "en");
  const [title, setTitle] = useState(entry?.title ?? "");
  const [scriptureRef, setScriptureRef] = useState(entry?.scriptureRef ?? "");
  const [scriptureText, setScriptureText] = useState(entry?.scriptureText ?? "");
  const [reflection, setReflection] = useState(entry?.reflection ?? "");
  const [application, setApplication] = useState(entry?.application ?? "");
  const [prayer, setPrayer] = useState(entry?.prayer ?? "");
  const [isPublished, setIsPublished] = useState(entry?.isPublished ?? false);
  const [publishedAt, setPublishedAt] = useState(
    entry?.publishedAt ? new Date(entry.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  );

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugManual) setSlug(slugify(v));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !scriptureRef || !scriptureText || !reflection || !slug) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    const data = { slug, lang, title, scriptureRef, scriptureText, reflection, application, prayer, isPublished, publishedAt };
    startTransition(async () => {
      try {
        if (entry) {
          await updateDeepDive(entry.id, data);
        } else {
          await createDeepDive(data);
        }
        router.push("/admin/deep-dive");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/deep-dive" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">Deep Dive</p>
            <h1 className="text-xl font-semibold text-foreground">{entry ? "Edit Article" : "New Article"}</h1>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {entry ? "Save changes" : "Create article"}
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-5 lg:col-span-2">
          {/* Title */}
          <Field label="Title" required>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Being Chosen by God"
              className={INPUT}
            />
          </Field>

          {/* Scripture */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Scripture Reference" required>
              <input
                value={scriptureRef}
                onChange={(e) => setScriptureRef(e.target.value)}
                placeholder="e.g. John 17:6-10"
                className={INPUT}
              />
            </Field>
            <Field label="Language" required>
              <select value={lang} onChange={(e) => setLang(e.target.value)} className={INPUT}>
                <option value="en">English</option>
                <option value="vi">Vietnamese</option>
              </select>
            </Field>
          </div>

          <Field label="Scripture Text" required>
            <textarea
              value={scriptureText}
              onChange={(e) => setScriptureText(e.target.value)}
              placeholder="Paste the Bible passage here..."
              rows={5}
              className={TEXTAREA}
            />
          </Field>

          {/* Reflection */}
          <Field label="Reflection / Suy gẫm" required>
            <DeepDiveTipTap
              content={reflection}
              onChange={setReflection}
              placeholder="Write the main reflection..."
              minHeight="min-h-[260px]"
            />
          </Field>

          {/* Application */}
          <Field label="Application (optional)">
            <DeepDiveTipTap
              content={application}
              onChange={setApplication}
              placeholder="Practical application points..."
              minHeight="min-h-[160px]"
            />
          </Field>

          {/* Prayer */}
          <Field label="Prayer (optional)">
            <textarea
              value={prayer}
              onChange={(e) => setPrayer(e.target.value)}
              placeholder="Closing prayer..."
              rows={4}
              className={TEXTAREA}
            />
          </Field>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publish */}
          <div className="rounded-2xl border border-border bg-background p-4 space-y-4">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Publish</p>

            <button
              type="button"
              onClick={() => setIsPublished((v) => !v)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors border ${
                isPublished
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-muted/40 border-border text-muted-foreground"
              }`}
            >
              <span>{isPublished ? "Published" : "Draft"}</span>
              {isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>

            <Field label="Publish date">
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className={INPUT}
              />
            </Field>
          </div>

          {/* Slug */}
          <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide">URL slug</p>
            <input
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
              placeholder="auto-generated from title"
              className={INPUT}
            />
            <p className="text-[10px] text-muted-foreground">
              /bible/en/learn/deep-dive/{slug || "…"}
            </p>
          </div>

          {/* Preview info */}
          <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Article structure</p>
            <div className="space-y-1">
              {[
                { label: "Scripture", done: !!scriptureRef && !!scriptureText },
                { label: "Reflection", done: reflection.length > 20 },
                { label: "Application", done: application.length > 10 },
                { label: "Prayer", done: !!prayer },
              ].map(({ label, done }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <div className={`h-1.5 w-1.5 rounded-full ${done ? "bg-emerald-500" : "bg-border"}`} />
                  <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
