"use client";

import { useState, useOptimistic, useTransition, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, Star, Archive, Plus, ArchiveRestore, Trash2, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import type { BibleStudyListWithCount } from "@/types/bible-study";
import {
  toggleFavorite,
  archiveStudyList,
  unarchiveStudyList,
  deleteStudyList,
  reorderStudyLists,
  updateStudyList,
} from "@/app/actions/bible/study";
import { NewStudyListPlaceholderCard } from "./NewStudyListPlaceholderCard";

type Tab = "all" | "favorites" | "archived";

interface StudyHubClientProps {
  lists: BibleStudyListWithCount[];
  archived: BibleStudyListWithCount[];
}

const HIGHLIGHT_COLORS = ["#fef08a", "#bfdbfe", "#fbcfe8", "#bbf7d0"] as const;

function TagPill({ tag, onRemove }: { tag: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
      {tag}
      {onRemove && (
        <button type="button" onClick={onRemove} className="hover:text-primary/60">
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </span>
  );
}

function StudyListCard({
  list,
  lang,
  onFavorite,
  onArchive,
  onDelete,
  onTagsChange,
}: {
  list: BibleStudyListWithCount;
  lang: string;
  onFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onTagsChange: (id: string, tags: string[]) => void;
}) {
  const router = useRouter();
  const [editingTags, setEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [localTags, setLocalTags] = useState(list.tags);
  const [, startTagTransition] = useTransition();

  const studiedCount = 0; // will be populated from passage data in future

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t || localTags.includes(t)) { setTagInput(""); return; }
    const next = [...localTags, t];
    setLocalTags(next);
    setTagInput("");
    startTagTransition(async () => {
      await updateStudyList({ listId: list.id, tags: next });
      onTagsChange(list.id, next);
    });
  };

  const removeTag = (tag: string) => {
    const next = localTags.filter((t) => t !== tag);
    setLocalTags(next);
    startTagTransition(async () => {
      await updateStudyList({ listId: list.id, tags: next });
      onTagsChange(list.id, next);
    });
  };

  return (
    <div
      className={cn(
        "border-border bg-background group flex min-h-[200px] flex-col rounded-2xl border transition-all",
        "hover:border-primary/30 hover:shadow-sm",
        list.isFavorite && "border-primary/30 bg-primary/3"
      )}
    >
      {/* Header */}
      <div
        className="bg-muted/60 flex items-start justify-between gap-2 rounded-t-2xl px-4 py-3 cursor-pointer"
        onClick={() => router.push(`/bible/${lang}/study/${list.id}`)}
      >
        <div className="min-w-0 flex-1 pr-1">
          <p className="text-foreground line-clamp-1 text-sm font-semibold">{list.title}</p>
          {list.description && (
            <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">{list.description}</p>
          )}
        </div>
        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onFavorite(list.id)}
            title={list.isFavorite ? "Unfavorite" : "Favorite"}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              list.isFavorite
                ? "text-yellow-500 hover:text-yellow-400"
                : "text-muted-foreground hover:text-yellow-500"
            )}
          >
            <Star className={cn("h-3.5 w-3.5", list.isFavorite && "fill-current")} />
          </button>
          <button
            type="button"
            onClick={() => onArchive(list.id)}
            title="Archive"
            className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 transition-colors"
          >
            <Archive className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(list.id)}
            title="Delete"
            className="text-muted-foreground hover:text-destructive rounded-lg p-1.5 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div
        className="flex flex-wrap items-center gap-1.5 px-4 pt-2"
        onClick={(e) => e.stopPropagation()}
      >
        {localTags.map((tag) => (
          <TagPill key={tag} tag={tag} onRemove={() => removeTag(tag)} />
        ))}
        {editingTags ? (
          <input
            autoFocus
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addTag(); }
              if (e.key === "Escape") setEditingTags(false);
            }}
            onBlur={() => { addTag(); setEditingTags(false); }}
            placeholder="tag name"
            className="bg-muted h-5 w-20 rounded px-1.5 text-[10px] outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingTags(true)}
            className="text-muted-foreground hover:text-foreground flex items-center gap-0.5 text-[10px] transition-colors"
          >
            <Tag className="h-2.5 w-2.5" />
            <span>tag</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div
        className="mt-auto px-4 pb-3 pt-2 cursor-pointer"
        onClick={() => router.push(`/bible/${lang}/study/${list.id}`)}
      >
        <div className="border-border/60 border-t pt-2" />
        {/* Progress bar */}
        {list.passageCount > 0 && (
          <div className="mb-1.5 mt-2">
            <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${Math.round((studiedCount / list.passageCount) * 100)}%` }}
              />
            </div>
          </div>
        )}
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {list.passageCount} {list.passageCount === 1 ? "chapter" : "chapters"}
          </span>
          <span>{list.createdAt.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

function ArchivedCard({
  list,
  lang,
  onUnarchive,
  onDelete,
}: {
  list: BibleStudyListWithCount;
  lang: string;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  return (
    <div className="border-border bg-background/60 flex min-h-[120px] flex-col rounded-2xl border opacity-70">
      <div
        className="flex flex-1 cursor-pointer items-start gap-2 px-4 py-3"
        onClick={() => router.push(`/bible/${lang}/study/${list.id}`)}
      >
        <div className="min-w-0 flex-1">
          <p className="text-foreground line-clamp-1 text-sm font-medium">{list.title}</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {list.passageCount} chapters · archived
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 pb-3" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => onUnarchive(list.id)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
        >
          <ArchiveRestore className="h-3.5 w-3.5" />
          Restore
        </button>
        <button
          type="button"
          onClick={() => onDelete(list.id)}
          className="text-muted-foreground hover:text-destructive flex items-center gap-1 text-xs transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

export function StudyHubClient({ lists: initialLists, archived: initialArchived }: StudyHubClientProps) {
  const pathname = usePathname();
  const lang = pathname?.match(/^\/bible\/(en|vi)/)?.[1] ?? "en";
  const [tab, setTab] = useState<Tab>("all");
  const [lists, setLists] = useState(initialLists);
  const [archived, setArchived] = useState(initialArchived);
  const [, startTransition] = useTransition();

  // Sync when server re-renders after router.refresh()
  useEffect(() => { setLists(initialLists); }, [initialLists]);
  useEffect(() => { setArchived(initialArchived); }, [initialArchived]);

  const favorites = lists.filter((l) => l.isFavorite);

  const handleFavorite = (id: string) => {
    setLists((prev) => prev.map((l) => l.id === id ? { ...l, isFavorite: !l.isFavorite } : l));
    startTransition(async () => { await toggleFavorite(id); });
  };

  const handleArchive = (id: string) => {
    const target = lists.find((l) => l.id === id);
    if (!target) return;
    setLists((prev) => prev.filter((l) => l.id !== id));
    setArchived((prev) => [{ ...target, isArchived: true, isFavorite: false }, ...prev]);
    startTransition(async () => { await archiveStudyList(id); });
  };

  const handleUnarchive = (id: string) => {
    const target = archived.find((l) => l.id === id);
    if (!target) return;
    setArchived((prev) => prev.filter((l) => l.id !== id));
    setLists((prev) => [{ ...target, isArchived: false }, ...prev]);
    startTransition(async () => { await unarchiveStudyList(id); });
  };

  const handleDelete = (id: string) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
    setArchived((prev) => prev.filter((l) => l.id !== id));
    startTransition(async () => { await deleteStudyList(id); });
  };

  const handleTagsChange = (id: string, tags: string[]) => {
    setLists((prev) => prev.map((l) => l.id === id ? { ...l, tags } : l));
  };

  const visibleLists = tab === "all" ? lists : tab === "favorites" ? favorites : archived;

  const TAB_CONFIG: { key: Tab; label: string; count?: number }[] = [
    { key: "all", label: "All", count: lists.length },
    { key: "favorites", label: "Favorites", count: favorites.length },
    { key: "archived", label: "Archived", count: archived.length },
  ];

  return (
    <Container maxWidth="7xl" className="flex min-h-screen flex-col px-4 py-8 lg:px-0">
      {/* Header */}
      <header className="mb-6">
        <p className="text-muted-foreground mb-1 text-xs tracking-[0.18em] uppercase">Personal</p>
        <h1 className="text-foreground text-2xl font-semibold">Study</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Build study lists, select chapters, and read Scripture in any translation.
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-5 flex items-center gap-1 border-b border-border pb-0">
        {TAB_CONFIG.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 pb-2.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  tab === t.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {tab === "archived" ? (
        archived.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <Archive className="text-muted-foreground h-10 w-10 opacity-40" />
            <p className="text-muted-foreground text-sm">No archived lists</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archived.map((list) => (
              <ArchivedCard
                key={list.id}
                list={list}
                lang={lang}
                onUnarchive={handleUnarchive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )
      ) : visibleLists.length === 0 && tab === "favorites" ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <Star className="text-muted-foreground h-10 w-10 opacity-40" />
          <p className="text-muted-foreground text-sm">No favorites yet — star a list to find it here</p>
        </div>
      ) : lists.length === 0 && tab === "all" ? (
        <div className="mt-12 flex flex-col items-center gap-5 text-center">
          <div className="bg-primary/8 flex h-16 w-16 items-center justify-center rounded-2xl">
            <BookOpen className="text-primary h-7 w-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-foreground text-lg font-semibold">Create your first study list</h2>
            <p className="text-muted-foreground max-w-sm text-sm">
              Select chapters from any book, switch translations, and read them all in one place.
            </p>
          </div>
          <NewStudyListPlaceholderCard label="New study list" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(tab === "all" ? lists : favorites).map((list) => (
            <StudyListCard
              key={list.id}
              list={list}
              lang={lang}
              onFavorite={handleFavorite}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onTagsChange={handleTagsChange}
            />
          ))}
          {tab === "all" && <NewStudyListPlaceholderCard />}
        </div>
      )}
    </Container>
  );
}
