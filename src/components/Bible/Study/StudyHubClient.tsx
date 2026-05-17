"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, Star, Archive, ArchiveRestore, Trash2, Tag, X, Pencil, Check, AlertTriangle,
  Flame, ListChecks, ArrowRight, ChevronDown, ChevronUp, TrendingUp, GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import type { BibleStudyListWithCount, StudyStreak, ContinueTodayItem } from "@/types/bible-study";
import {
  toggleFavorite, archiveStudyList, unarchiveStudyList, deleteStudyList, updateStudyList,
} from "@/app/actions/bible/study";
import { NewStudyListPlaceholderCard } from "./NewStudyListPlaceholderCard";
import { ChecklistPanel } from "./ChecklistPanel";
import { GoalWidget } from "./GoalWidget";

type Tab = "all" | "favorites" | "archived";

interface StudyHubClientProps {
  lists: BibleStudyListWithCount[];
  archived: BibleStudyListWithCount[];
  streak: StudyStreak | null;
  continueToday: ContinueTodayItem | null;
}

const INTL = {
  en: {
    personal: "Personal",
    title: "Study",
    subtitle: "Build study lists, select chapters, and read Scripture in any translation.",
    tabAll: "All", tabFavorites: "Favorites", tabArchived: "Archived",
    noArchived: "No archived lists",
    noFavorites: "No favorites yet — star a list to find it here",
    createTitle: "Create your first study list",
    createSub: "Select chapters from any book, switch translations, and read them all in one place.",
    newList: "New study list",
    chapters: (n: number) => n === 1 ? "chapter" : "chapters",
    restore: "Restore", delete: "Delete", confirmDelete: "Tap again to confirm",
    archived: "archived", tag: "tag", unfavorite: "Unfavorite", favorite: "Favorite",
    archive: "Archive", studied: "studied", filterByTag: "Filter by tag", allTags: "All",
    editTitle: "Edit title", saveEdit: "Save", cancelEdit: "Cancel",
    suggested: "Try reading John 3 — a great starting point",
    startStudy: "Start with John 3",
    checklist: "Checklist",
    continueToday: "Continue today",
    in: "in",
    chapter: "Chapter",
    streakDays: (n: number) => n === 1 ? "day streak" : "day streak",
    totalStudied: "chapters studied",
    activeLists: "active lists",
    totalLists: "total lists",
    bestStreak: "best",
  },
  vi: {
    personal: "Cá nhân",
    title: "Học Kinh Thánh",
    subtitle: "Tạo danh sách học, chọn chương và đọc Kinh Thánh theo bản dịch bạn thích.",
    tabAll: "Tất cả", tabFavorites: "Yêu thích", tabArchived: "Đã lưu trữ",
    noArchived: "Không có danh sách nào được lưu trữ",
    noFavorites: "Chưa có danh sách yêu thích — nhấn ngôi sao để lưu vào đây",
    createTitle: "Tạo danh sách học đầu tiên",
    createSub: "Chọn chương từ bất kỳ sách nào, chuyển đổi bản dịch và đọc tất cả ở một nơi.",
    newList: "Danh sách mới",
    chapters: (_n: number) => "chương",
    restore: "Khôi phục", delete: "Xóa", confirmDelete: "Nhấn lại để xác nhận",
    archived: "đã lưu trữ", tag: "nhãn", unfavorite: "Bỏ yêu thích", favorite: "Yêu thích",
    archive: "Lưu trữ", studied: "đã học", filterByTag: "Lọc theo nhãn", allTags: "Tất cả",
    editTitle: "Chỉnh sửa", saveEdit: "Lưu", cancelEdit: "Hủy",
    suggested: "Thử đọc Giăng 3 — điểm khởi đầu tuyệt vời",
    startStudy: "Bắt đầu với Giăng 3",
    checklist: "Danh sách học",
    continueToday: "Tiếp tục hôm nay",
    in: "trong",
    chapter: "Chương",
    streakDays: (_n: number) => "ngày liên tiếp",
    totalStudied: "chương đã học",
    activeLists: "danh sách đang học",
    totalLists: "tổng danh sách",
    bestStreak: "kỷ lục",
  },
} as const;

type TDict = typeof INTL.en;

// ── Stats Cards ───────────────────────────────────────────────────────────────

function StatsCards({
  totalStudied,
  activeLists,
  totalLists,
  streak,
  t,
}: {
  totalStudied: number;
  activeLists: number;
  totalLists: number;
  streak: StudyStreak | null;
  t: TDict;
}) {
  const stats = [
    {
      icon: <Flame className="h-4 w-4 text-orange-500" />,
      value: streak?.currentStreak ?? 0,
      label: t.streakDays(streak?.currentStreak ?? 0),
      sub: streak && streak.longestStreak > (streak.currentStreak ?? 0) ? `${streak.longestStreak} ${t.bestStreak}` : null,
      accent: "bg-background/90 border-orange-200 dark:border-orange-800/40",
    },
    {
      icon: <BookOpen className="h-4 w-4 text-primary" />,
      value: totalStudied,
      label: t.totalStudied,
      sub: null,
      accent: "bg-background/90 border-primary/20",
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />,
      value: activeLists,
      label: t.activeLists,
      sub: null,
      accent: "bg-background/90 border-green-200 dark:border-green-800/40",
    },
    {
      icon: <GraduationCap className="h-4 w-4 text-violet-500" />,
      value: totalLists,
      label: t.totalLists,
      sub: null,
      accent: "bg-background/90 border-violet-200 dark:border-violet-800/40",
    },
  ];

  return (
    <motion.div
      className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          className={cn("flex flex-col gap-1 rounded-2xl border px-4 py-3", s.accent)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 + i * 0.05 }}
        >
          <div className="flex items-center gap-1.5">
            {s.icon}
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{s.value}</p>
          {s.sub && <p className="text-[10px] text-muted-foreground">{s.sub}</p>}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Continue Today Banner ─────────────────────────────────────────────────────

function ContinueTodayBanner({
  item,
  lang,
  t,
}: {
  item: ContinueTodayItem;
  lang: string;
  t: TDict;
}) {
  const router = useRouter();
  const bookName = lang === "vi" ? item.bookNameVi : item.bookNameEn;
  const href = `/bible/${lang}/study/${item.listId}`;

  return (
    <motion.button
      type="button"
      onClick={() => router.push(href)}
      className="mb-5 flex w-full items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-background/90 px-4 py-3 text-left shadow-sm transition-colors hover:border-primary/50 hover:bg-background"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <BookOpen className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
            {t.continueToday}
          </p>
          <p className="text-sm font-medium text-foreground">
            {bookName} {item.chapter}
            <span className="ml-1.5 text-xs text-muted-foreground">
              {t.in} {item.listTitle}
            </span>
          </p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
    </motion.button>
  );
}

// ── Tag Pill ──────────────────────────────────────────────────────────────────

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

// ── Study List Card ───────────────────────────────────────────────────────────

function StudyListCard({
  list: initialList, lang, t,
  onFavorite, onArchive, onDelete, onTagsChange, onTitleChange,
}: {
  list: BibleStudyListWithCount;
  lang: string;
  t: TDict;
  onFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onTagsChange: (id: string, tags: string[]) => void;
  onTitleChange: (id: string, title: string, description: string | null) => void;
}) {
  const router = useRouter();
  const [list, setList] = useState(initialList);
  const [editingTags, setEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [localTags, setLocalTags] = useState(list.tags);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [editDesc, setEditDesc] = useState(list.description ?? "");
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [, startTagTransition] = useTransition();
  const [, startEditTransition] = useTransition();
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setList(initialList); }, [initialList]);
  useEffect(() => { if (editing) titleInputRef.current?.focus(); }, [editing]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (!tag || localTags.includes(tag)) { setTagInput(""); return; }
    const next = [...localTags, tag];
    setLocalTags(next);
    setTagInput("");
    startTagTransition(async () => { await updateStudyList({ listId: list.id, tags: next }); onTagsChange(list.id, next); });
  };

  const removeTag = (tag: string) => {
    const next = localTags.filter((t) => t !== tag);
    setLocalTags(next);
    startTagTransition(async () => { await updateStudyList({ listId: list.id, tags: next }); onTagsChange(list.id, next); });
  };

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      confirmTimer.current = setTimeout(() => setConfirmDelete(false), 3000);
    } else {
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      onDelete(list.id);
    }
  };

  const handleSaveEdit = () => {
    const title = editTitle.trim();
    if (!title) return;
    setEditing(false);
    startEditTransition(async () => {
      await updateStudyList({ listId: list.id, title, description: editDesc.trim() || undefined });
      onTitleChange(list.id, title, editDesc.trim() || null);
    });
  };

  const progressPct = list.passageCount > 0 ? Math.round((list.studiedCount / list.passageCount) * 100) : 0;

  return (
    <div className={cn(
      "border-border bg-background group flex flex-col rounded-2xl border transition-all",
      "hover:border-primary/30 hover:shadow-sm",
      list.isFavorite && "border-primary/30 bg-primary/3"
    )}>
      {/* Header */}
      <div className="bg-muted/60 flex items-start justify-between gap-2 rounded-t-2xl px-4 py-3">
        {editing ? (
          <div className="flex-1 space-y-1.5 pr-1" onClick={(e) => e.stopPropagation()}>
            <input
              ref={titleInputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") { setEditing(false); setEditTitle(list.title); setEditDesc(list.description ?? ""); }
              }}
              className="w-full rounded-lg border border-primary/30 bg-background px-2 py-1 text-sm font-semibold text-foreground outline-none"
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={2}
              placeholder="Description (optional)"
              className="w-full resize-none rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
            <div className="flex gap-2">
              <button type="button" onClick={handleSaveEdit}
                className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
                <Check className="h-3 w-3" />{t.saveEdit}
              </button>
              <button type="button"
                onClick={() => { setEditing(false); setEditTitle(list.title); setEditDesc(list.description ?? ""); }}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                {t.cancelEdit}
              </button>
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1 pr-1 cursor-pointer"
            onClick={() => router.push(`/bible/${lang}/study/${list.id}`)}>
            <p className="text-foreground line-clamp-1 text-sm font-semibold">{list.title}</p>
            {list.description && (
              <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">{list.description}</p>
            )}
          </div>
        )}
        {!editing && (
          <div className="flex shrink-0 items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setEditing(true)} title={t.editTitle}
              className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 transition-colors opacity-0 group-hover:opacity-100">
              <Pencil className="h-3 w-3" />
            </button>
            <button type="button" onClick={() => onFavorite(list.id)}
              title={list.isFavorite ? t.unfavorite : t.favorite}
              className={cn("rounded-lg p-1.5 transition-colors",
                list.isFavorite ? "text-yellow-500 hover:text-yellow-400" : "text-muted-foreground hover:text-yellow-500")}>
              <Star className={cn("h-3.5 w-3.5", list.isFavorite && "fill-current")} />
            </button>
            <button type="button" onClick={() => onArchive(list.id)} title={t.archive}
              className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 transition-colors">
              <Archive className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={handleDeleteClick}
              title={confirmDelete ? t.confirmDelete : t.delete}
              className={cn("rounded-lg p-1.5 transition-all",
                confirmDelete ? "bg-destructive/10 text-destructive" : "text-muted-foreground hover:text-destructive")}>
              {confirmDelete ? <AlertTriangle className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="bg-destructive/5 border-b border-destructive/10 px-4 py-1.5 text-[11px] text-destructive">
          {t.confirmDelete}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 pt-2" onClick={(e) => e.stopPropagation()}>
        {localTags.map((tag) => (
          <TagPill key={tag} tag={tag} onRemove={() => removeTag(tag)} />
        ))}
        {editingTags ? (
          <input autoFocus value={tagInput} onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } if (e.key === "Escape") setEditingTags(false); }}
            onBlur={() => { addTag(); setEditingTags(false); }}
            placeholder={t.tag} className="bg-muted h-5 w-20 rounded px-1.5 text-[10px] outline-none" />
        ) : (
          <button type="button" onClick={() => setEditingTags(true)}
            className="text-muted-foreground hover:text-foreground flex items-center gap-0.5 text-[10px] transition-colors">
            <Tag className="h-2.5 w-2.5" /><span>{t.tag}</span>
          </button>
        )}
      </div>

      {/* Goal widget */}
      <div className="mt-2" onClick={(e) => e.stopPropagation()}>
        <GoalWidget list={list} lang={lang} />
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 pb-0 pt-1 cursor-pointer"
        onClick={() => !editing && router.push(`/bible/${lang}/study/${list.id}`)}>
        <div className="border-border/60 border-t pt-2" />
        {list.passageCount > 0 && (
          <div className="mb-1.5 mt-2">
            <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}
        <div className="text-muted-foreground flex items-center justify-between pb-3 text-xs">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {list.passageCount} {t.chapters(list.passageCount)}
            {list.studiedCount > 0 && (
              <span className="text-green-600 dark:text-green-400">· {list.studiedCount} {t.studied}</span>
            )}
          </span>
          <span>{list.createdAt.toLocaleDateString()}</span>
        </div>
      </div>

      {/* Checklist toggle */}
      {list.passageCount > 0 && (
        <div onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setChecklistOpen((v) => !v)}
            className="flex w-full items-center justify-between border-t border-border/50 px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <ListChecks className="h-3.5 w-3.5" />
              {t.checklist}
            </span>
            {checklistOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          <AnimatePresence>
            {checklistOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border-t border-border/30 px-4 py-3">
                  <ChecklistPanel
                    listId={list.id}
                    lang={lang}
                    onStudiedChange={(delta) => setList((l) => ({ ...l, studiedCount: Math.max(0, l.studiedCount + delta) }))}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── Archived Card ─────────────────────────────────────────────────────────────

function ArchivedCard({ list, lang, t, onUnarchive, onDelete }: {
  list: BibleStudyListWithCount; lang: string; t: TDict;
  onUnarchive: (id: string) => void; onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      confirmTimer.current = setTimeout(() => setConfirmDelete(false), 3000);
    } else {
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      onDelete(list.id);
    }
  };

  return (
    <div className="border-border bg-background/60 flex min-h-[120px] flex-col rounded-2xl border opacity-70">
      <div className="flex flex-1 cursor-pointer items-start gap-2 px-4 py-3"
        onClick={() => router.push(`/bible/${lang}/study/${list.id}`)}>
        <div className="min-w-0 flex-1">
          <p className="text-foreground line-clamp-1 text-sm font-medium">{list.title}</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {list.passageCount} {t.chapters(list.passageCount)} · {t.archived}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 pb-3" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => onUnarchive(list.id)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors">
          <ArchiveRestore className="h-3.5 w-3.5" />{t.restore}
        </button>
        <button type="button" onClick={handleDeleteClick}
          className={cn("flex items-center gap-1 text-xs transition-colors",
            confirmDelete ? "text-destructive" : "text-muted-foreground hover:text-destructive")}>
          {confirmDelete ? <AlertTriangle className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
          {confirmDelete ? t.confirmDelete : t.delete}
        </button>
      </div>
    </div>
  );
}

// ── Hub ───────────────────────────────────────────────────────────────────────

export function StudyHubClient({
  lists: initialLists, archived: initialArchived, streak, continueToday,
}: StudyHubClientProps) {
  const pathname = usePathname();
  const lang = pathname?.match(/^\/bible\/(en|vi)/)?.[1] ?? "en";
  const t = (INTL[lang as "en" | "vi"] ?? INTL.en) as typeof INTL.en;
  const [tab, setTab] = useState<Tab>("all");
  const [lists, setLists] = useState(initialLists);
  const [archived, setArchived] = useState(initialArchived);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => { setLists(initialLists); }, [initialLists]);
  useEffect(() => { setArchived(initialArchived); }, [initialArchived]);

  const favorites = lists.filter((l) => l.isFavorite);
  const allTags = Array.from(new Set(lists.flatMap((l) => l.tags))).sort();
  const totalStudied = lists.reduce((sum, l) => sum + l.studiedCount, 0);
  const activeLists = lists.filter((l) => l.passageCount > 0 && l.studiedCount < l.passageCount).length;

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
  const handleTitleChange = (id: string, title: string, description: string | null) => {
    setLists((prev) => prev.map((l) => l.id === id ? { ...l, title, description } : l));
  };

  const baseList = tab === "all" ? lists : tab === "favorites" ? favorites : archived;
  const visibleLists = activeTag ? baseList.filter((l) => l.tags.includes(activeTag)) : baseList;

  const TAB_CONFIG: { key: Tab; label: string; count?: number }[] = [
    { key: "all", label: t.tabAll, count: lists.length },
    { key: "favorites", label: t.tabFavorites, count: favorites.length },
    { key: "archived", label: t.tabArchived, count: archived.length },
  ];

  return (
    <Container maxWidth="7xl" className="flex min-h-screen flex-col px-4 py-8 lg:px-0">
      {/* Header */}
      <motion.header className="mb-6 flex items-end justify-between gap-4" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.18em] uppercase">{t.personal}</p>
              <h1 className="text-foreground text-xl font-bold leading-tight">{t.title}</h1>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">{t.subtitle}</p>
        </div>
      </motion.header>

      {/* Stats cards */}
      <StatsCards totalStudied={totalStudied} activeLists={activeLists} totalLists={lists.length} streak={streak} t={t} />

      {/* Continue Today */}
      {continueToday && tab === "all" && (
        <ContinueTodayBanner item={continueToday} lang={lang} t={t} />
      )}

      {/* Tabs */}
      <div className="mb-5 flex items-center gap-1 border-b border-border pb-0">
        {TAB_CONFIG.map((tc) => (
          <button key={tc.key} type="button"
            onClick={() => { setTab(tc.key); setActiveTag(null); }}
            className={cn("flex items-center gap-1.5 border-b-2 px-3 pb-2.5 text-sm font-medium transition-colors",
              tab === tc.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
            {tc.label}
            {tc.count !== undefined && tc.count > 0 && (
              <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                tab === tc.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                {tc.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && tab !== "archived" && (
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={() => setActiveTag(null)}
            className={cn("rounded-full border px-3 py-1 text-[11px] font-medium transition-all",
              activeTag === null ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground")}>
            {t.allTags}
          </button>
          {allTags.map((tag) => (
            <button key={tag} type="button" onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={cn("inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition-all",
                activeTag === tag ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground")}>
              <Tag className="h-2.5 w-2.5" />{tag}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {tab === "archived" ? (
        archived.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <Archive className="text-muted-foreground h-10 w-10 opacity-40" />
            <p className="text-muted-foreground text-sm">{t.noArchived}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {archived.map((list, i) => (
                <motion.div key={list.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2, delay: i * 0.04 }}>
                  <ArchivedCard list={list} lang={lang} t={t} onUnarchive={handleUnarchive} onDelete={handleDelete} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
      ) : visibleLists.length === 0 && lists.length === 0 ? (
        <motion.div className="mt-16 flex flex-col items-center gap-4 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <BookOpen className="text-muted-foreground h-12 w-12 opacity-30" />
          <div>
            <p className="text-foreground font-semibold">{t.createTitle}</p>
            <p className="text-muted-foreground mt-1 text-sm">{t.createSub}</p>
          </div>
          <p className="text-muted-foreground mt-2 text-xs italic">{t.suggested}</p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {visibleLists.map((list, i) => (
              <motion.div key={list.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2, delay: i * 0.05 }}>
                <StudyListCard list={list} lang={lang} t={t}
                  onFavorite={handleFavorite} onArchive={handleArchive} onDelete={handleDelete}
                  onTagsChange={handleTagsChange} onTitleChange={handleTitleChange} />
              </motion.div>
            ))}
            {tab === "all" && (
              <motion.div key="new" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: visibleLists.length * 0.05 }}>
                <NewStudyListPlaceholderCard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Container>
  );
}
