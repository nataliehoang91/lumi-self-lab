import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff, BookOpen } from "lucide-react";
import { AdminShell } from "@/components/Admin/AdminShell";
import { listDeepDives } from "@/app/actions/admin/deep-dive";

export default async function AdminDeepDivePage() {
  const entries = await listDeepDives();

  const published = entries.filter((e) => e.isPublished).length;
  const drafts = entries.length - published;

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">Content</p>
          <h1 className="mt-0.5 text-2xl font-semibold text-foreground">Deep Dive</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {published} published · {drafts} draft{drafts !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/deep-dive/new"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New article
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-foreground">No articles yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Create your first deep dive article to get started.</p>
          <Link href="/admin/deep-dive/new" className="mt-4 flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" /> New article
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background px-5 py-4 hover:border-primary/20 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold ${
                    entry.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                  }`}>
                    {entry.isPublished ? "Published" : "Draft"}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase">{entry.lang}</span>
                </div>
                <p className="mt-1 font-medium text-foreground truncate">{entry.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {entry.scriptureRef}
                  {entry.publishedAt && (
                    <span className="ml-2">· {new Date(entry.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {entry.isPublished ? (
                  <Eye className="h-4 w-4 text-emerald-500" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
                <Link
                  href={`/admin/deep-dive/${entry.id}`}
                  className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
