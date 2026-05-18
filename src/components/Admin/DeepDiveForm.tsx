"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Eye, EyeOff, ArrowLeft, ImageIcon, X, Calendar } from "lucide-react";
import Link from "next/link";
import { DeepDiveTipTap } from "./DeepDiveTipTap";
import { upsertDeepDivePair } from "@/app/actions/admin/deep-dive";
import type { BibleDeepDive } from "@prisma/client";
import type { LangContent } from "@/app/actions/admin/deep-dive";

interface Props {
  slug?: string;
  en?: BibleDeepDive | null;
  vi?: BibleDeepDive | null;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function shortId() {
  return Math.random().toString(36).slice(2, 7);
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

const SECTION_LABELS = {
  en: { scripture: "Scripture", reflection: "Reflection", application: "Application", prayer: "Prayer" },
  vi: { scripture: "Kinh Thánh", reflection: "Suy gẫm", application: "Ứng dụng", prayer: "Cầu nguyện" },
};

function emptyContent(date: string): LangContent & { title: string } {
  return { title: "", scriptureText: "", reflection: "", application: "", prayer: "", isPublished: false, publishedAt: date };
}

function fromEntry(e: BibleDeepDive): LangContent & { title: string } {
  return {
    title: e.title,
    scriptureText: e.scriptureText,
    reflection: e.reflection,
    application: e.application ?? "",
    prayer: e.prayer ?? "",
    isPublished: e.isPublished,
    publishedAt: e.publishedAt ? new Date(e.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
}

function PreviewModal({ lang, title, scriptureRef, scriptureText, reflection, application, prayer, publishedAt, onClose }: {
  lang: "en" | "vi"; title: string; scriptureRef: string; scriptureText: string;
  reflection: string; application: string; prayer: string; publishedAt: string; onClose: () => void;
}) {
  const labels = SECTION_LABELS[lang];
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <p className="text-sm font-semibold text-foreground">Preview — {lang.toUpperCase()}</p>
          <button type="button" onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <article className="space-y-6 p-6 lg:p-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {publishedAt && new Date(publishedAt).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground leading-tight mb-1.5">{title || <span className="text-muted-foreground italic">Untitled</span>}</h1>
            {scriptureRef && <p className="text-sm font-medium text-primary">{scriptureRef}</p>}
          </div>
          {scriptureText && (
            <div className="rounded-2xl border border-border bg-primary/5 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-2.5">{labels.scripture}</p>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap italic">{scriptureText}</p>
            </div>
          )}
          {reflection && (
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">{labels.reflection}</h2>
              <div className="deep-dive-content text-sm leading-relaxed text-foreground" dangerouslySetInnerHTML={{ __html: reflection }} />
            </div>
          )}
          {application && (
            <div className="rounded-2xl border border-border bg-muted/30 px-5 py-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">{labels.application}</h2>
              <div className="deep-dive-content text-sm leading-relaxed text-foreground" dangerouslySetInnerHTML={{ __html: application }} />
            </div>
          )}
          {prayer && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-2.5">{labels.prayer}</h2>
              <p className="text-sm leading-relaxed text-foreground italic whitespace-pre-wrap">{prayer}</p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

function LangTab({ lang, content, onChange, scriptureRef }: {
  lang: "en" | "vi";
  content: LangContent & { title: string };
  onChange: (c: LangContent & { title: string }) => void;
  scriptureRef: string;
}) {
  const labels = SECTION_LABELS[lang];
  const set = <K extends keyof typeof content>(key: K, val: typeof content[K]) =>
    onChange({ ...content, [key]: val });

  return (
    <div className="space-y-5">
      <Field label={lang === "en" ? "Title" : "Tiêu đề"} required>
        <input value={content.title} onChange={(e) => set("title", e.target.value)} placeholder={lang === "en" ? "e.g. The Light of the Gospel" : "e.g. Ánh Sáng Của Tin Lành"} className={INPUT} />
      </Field>

      <Field label={lang === "en" ? "Scripture Text" : "Câu Kinh Thánh"} required>
        <textarea value={content.scriptureText} onChange={(e) => set("scriptureText", e.target.value)} placeholder={lang === "en" ? "Paste the Bible passage (NIV/KJV)..." : "Dán câu Kinh Thánh (bản VIE)..."} rows={5} className={TEXTAREA} />
      </Field>

      <Field label={`${lang === "en" ? "Reflection" : "Suy gẫm"}`} required>
        <DeepDiveTipTap content={content.reflection} onChange={(v) => set("reflection", v)} placeholder={lang === "en" ? "Write the main reflection..." : "Viết phần suy gẫm chính..."} minHeight="min-h-[260px]" />
      </Field>

      <Field label={lang === "en" ? "Application (optional)" : "Ứng dụng (tùy chọn)"}>
        <DeepDiveTipTap content={content.application ?? ""} onChange={(v) => set("application", v)} placeholder={lang === "en" ? "Practical application..." : "Ứng dụng thực tế..."} minHeight="min-h-[160px]" />
      </Field>

      <Field label={lang === "en" ? "Prayer (optional)" : "Cầu nguyện (tùy chọn)"}>
        <textarea value={content.prayer ?? ""} onChange={(e) => set("prayer", e.target.value)} placeholder={lang === "en" ? "Closing prayer..." : "Lời cầu nguyện..."} rows={4} className={TEXTAREA} />
      </Field>

      {/* Publish status */}
      <div className="rounded-2xl border border-border bg-background p-4 space-y-4">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">{lang === "en" ? "Publish (EN)" : "Đăng bài (VI)"}</p>
        <button type="button" onClick={() => set("isPublished", !content.isPublished)}
          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors border ${content.isPublished ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-muted/40 border-border text-muted-foreground"}`}>
          <span>{content.isPublished ? (lang === "en" ? "Published" : "Đã đăng") : "Draft"}</span>
          {content.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
        <Field label={lang === "en" ? "Publish date" : "Ngày đăng"}>
          <input type="date" value={content.publishedAt ?? ""} onChange={(e) => set("publishedAt", e.target.value)} className={INPUT} />
        </Field>
      </div>
    </div>
  );
}

export function DeepDiveForm({ slug: existingSlug, en: enEntry, vi: viEntry }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "vi">("en");

  const today = new Date().toISOString().slice(0, 10);
  const isEditing = !!existingSlug;

  const [slug, setSlug] = useState(existingSlug ?? "");
  const [slugManual, setSlugManual] = useState(!!existingSlug);
  const [scriptureRef, setScriptureRef] = useState(enEntry?.scriptureRef ?? viEntry?.scriptureRef ?? "");
  const [coverImage, setCoverImage] = useState(enEntry?.coverImage ?? viEntry?.coverImage ?? "");
  const [sourceUrl, setSourceUrl] = useState(enEntry?.sourceUrl ?? viEntry?.sourceUrl ?? "");
  const [sourceLabel, setSourceLabel] = useState(enEntry?.sourceLabel ?? viEntry?.sourceLabel ?? "");
  const [enContent, setEnContent] = useState<LangContent & { title: string }>(enEntry ? fromEntry(enEntry) : emptyContent(today));
  const [viContent, setViContent] = useState<LangContent & { title: string }>(viEntry ? fromEntry(viEntry) : emptyContent(today));

  const activeLangContent = activeTab === "en" ? enContent : viContent;

  const handleSlugFromTitle = (v: string) => {
    if (!slugManual) setSlug(`${slugify(v)}-${shortId()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !scriptureRef || !enContent.title || !enContent.scriptureText || !enContent.reflection) {
      setError("Please fill in all required fields (at minimum the English version).");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await upsertDeepDivePair({ slug, scriptureRef, coverImage, sourceUrl, sourceLabel, en: enContent, vi: viContent });
        router.push("/admin/deep-dive");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <>
      {showPreview && (
        <PreviewModal
          lang={activeTab}
          title={activeLangContent.title}
          scriptureRef={scriptureRef}
          scriptureText={activeLangContent.scriptureText}
          reflection={activeLangContent.reflection}
          application={activeLangContent.application ?? ""}
          prayer={activeLangContent.prayer ?? ""}
          publishedAt={activeLangContent.publishedAt ?? today}
          onClose={() => setShowPreview(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/deep-dive" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">Deep Dive</p>
              <h1 className="text-xl font-semibold text-foreground">{isEditing ? "Edit Article" : "New Article"}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowPreview(true)} className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
              <Eye className="h-4 w-4" />Preview
            </button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isEditing ? "Save changes" : "Create article"}
            </button>
          </div>
        </div>

        {error && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-5 lg:col-span-2">
            {/* Shared fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Scripture Reference" required>
                <input value={scriptureRef} onChange={(e) => setScriptureRef(e.target.value)} placeholder="e.g. John 17:6-10" className={INPUT} />
              </Field>
              <Field label="URL Slug" required>
                <input value={slug} onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }} placeholder="auto-generated" className={INPUT} />
              </Field>
            </div>

            {/* Language tabs */}
            <div>
              <div className="flex gap-1 mb-4 rounded-xl bg-muted/40 p-1 w-fit">
                {(["en", "vi"] as const).map((l) => (
                  <button key={l} type="button" onClick={() => setActiveTab(l)}
                    className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${activeTab === l ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                    {l === "en" ? "🇬🇧 English" : "🇻🇳 Tiếng Việt"}
                    {l === "en" && enContent.isPublished && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                    {l === "vi" && viContent.isPublished && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                  </button>
                ))}
              </div>
              {activeTab === "en" ? (
                <LangTab lang="en" content={enContent} onChange={(v) => { setEnContent(v); handleSlugFromTitle(v.title); }} scriptureRef={scriptureRef} />
              ) : (
                <LangTab lang="vi" content={viContent} onChange={setViContent} scriptureRef={scriptureRef} />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Cover image */}
            <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Cover image</p>
              <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." className={INPUT} />
              {coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImage} alt="Cover" className="w-full rounded-xl object-cover aspect-video" />
              ) : (
                <div className="flex items-center justify-center rounded-xl bg-muted/40 aspect-video">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Source reference */}
            <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Source reference</p>
              <p className="text-[10px] text-muted-foreground">For attribution only — we do not copy content.</p>
              <Field label="Source label">
                <input value={sourceLabel} onChange={(e) => setSourceLabel(e.target.value)} placeholder="e.g. Our Daily Bread, May 2025" className={INPUT} />
              </Field>
              <Field label="Source URL">
                <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://odb.org/..." className={INPUT} />
              </Field>
            </div>

            {/* URL preview */}
            <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">URL</p>
              <p className="text-[10px] text-muted-foreground break-all">/bible/en/learn/deep-dive/{slug || "…"}</p>
              <p className="text-[10px] text-muted-foreground break-all">/bible/vi/learn/deep-dive/{slug || "…"}</p>
            </div>

            {/* Status summary */}
            <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Status</p>
              {[
                { label: "Cover image", done: !!coverImage },
                { label: "Scripture ref", done: !!scriptureRef },
                { label: "EN — Title + content", done: !!enContent.title && enContent.reflection.length > 20 },
                { label: "EN — Published", done: enContent.isPublished },
                { label: "VI — Title + content", done: !!viContent.title && viContent.reflection.length > 20 },
                { label: "VI — Published", done: viContent.isPublished },
              ].map(({ label, done }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <div className={`h-1.5 w-1.5 rounded-full ${done ? "bg-emerald-500" : "bg-border"}`} />
                  <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
