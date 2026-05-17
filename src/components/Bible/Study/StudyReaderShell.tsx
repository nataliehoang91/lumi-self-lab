"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import type { BibleStudyList, BibleStudyPassage, BibleStudyNote, BibleStudyHighlight, HighlightColor } from "@/types/bible-study";
import type { BibleBook, ChapterContent } from "@/components/Bible/Read/types";
import type { ReadVersionId } from "@/app/(bible)/bible/[lang]/read/params";
import { getChapterContent } from "@/app/actions/bible/read";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { BookCircleIcon } from "@/components/Bible/GeneralComponents/book-circle-icon";
import {
  saveStudyPassages,
  toggleStudyPassage,
  markChapterStudied,
  saveNote,
  deleteNote,
  toggleHighlight,
  togglePublicShare,
} from "@/app/actions/bible/study";
import type { ChapterInsightData } from "@/app/actions/bible/insights";
import { getInsightsForChapter } from "@/app/actions/bible/insights";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  Copy,
  Eye,
  EyeOff,
  Expand,
  Lightbulb,
  Link2,
  Maximize2,
  Minimize2,
  Pencil,
  Printer,
  Share2,
  Sparkles,
  Star,
  Tag,
  Trash2,
  X,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VerseChatPanel } from "./VerseChatPanel";
import type { VerseRef } from "@/app/api/bible/verse-chat/route";

// ── i18n ──────────────────────────────────────────────────────────────────────

const INTL = {
  en: {
    studyList: "Study list",
    old: "Old",
    new: "New",
    version: "Version",
    testament: "Testament",
    book: "Book",
    saveList: "Save list",
    saving: "Saving…",
    clearAll: "Clear all",
    clearBook: "Clear book",
    noChaptersSelected: "No chapters selected",
    chaptersSelected: (n: number) => `${n} chapter${n !== 1 ? "s" : ""} selected`,
    tapToAdd: "Tap chapters to add them to this study",
    selectChapters: "Select chapters to start studying",
    selectHint: "Choose a version and tap chapters from any book. They'll appear here side by side.",
    savedVerses: "Saved Verses",
    chapterInsights: "Chapter Insights",
    aiGenerated: "AI generated",
    context: "Context",
    explanation: "Explanation",
    reflection: "Reflection",
    noteOnVerse: (n: number) => `Note on verse ${n}…`,
    chapterNote: "Chapter note…",
    save: "Save",
    cancel: "Cancel",
    deleteNote: "Delete note",
    books: (n: number) => `${n} ${n === 1 ? "book" : "books"}`,
    chapters: (n: number) => `${n} chapter${n !== 1 ? "s" : ""}`,
    studied: (done: number, total: number) => `${done}/${total} studied`,
    otLabel: "OT",
    ntLabel: "NT",
    chapter: (n: number) => `Chapter ${n}`,
    markStudied: "Mark studied",
    markUnread: "Mark unread",
    chapterNote2: "Chapter note",
    focusMode: "Focus mode",
    exitFocus: "Exit focus",
    copyAll: "Copy all text",
    print: "Print / Export PDF",
    share: "Share",
    disableShare: "Disable sharing",
    linkCopied: "Link copied!",
    sharingDisabled: "Sharing disabled",
    toggleInsights: "Toggle insights",
    highlightedOnly: "Highlighted only",
    showAll: "Show all verses",
    versionLabels: {
      vi: "Vietnamese 1925",
      niv: "New International Version",
      kjv: "King James Version",
    },
  },
  vi: {
    studyList: "Danh sách học",
    old: "Cựu",
    new: "Tân",
    version: "Bản dịch",
    testament: "Giao ước",
    book: "Sách",
    saveList: "Lưu danh sách",
    saving: "Đang lưu…",
    clearAll: "Xóa tất cả",
    clearBook: "Xóa sách",
    noChaptersSelected: "Chưa chọn chương nào",
    chaptersSelected: (n: number) => `${n} chương đã chọn`,
    tapToAdd: "Nhấn vào chương để thêm vào bài học này",
    selectChapters: "Chọn chương để bắt đầu học",
    selectHint: "Chọn bản dịch và nhấn vào chương từ bất kỳ sách nào. Chúng sẽ hiển thị ở đây.",
    savedVerses: "Câu đã lưu",
    chapterInsights: "Nhận xét chương",
    aiGenerated: "AI tạo ra",
    context: "Bối cảnh",
    explanation: "Giải thích",
    reflection: "Suy ngẫm",
    noteOnVerse: (n: number) => `Ghi chú câu ${n}…`,
    chapterNote: "Ghi chú chương…",
    save: "Lưu",
    cancel: "Hủy",
    deleteNote: "Xóa ghi chú",
    books: (n: number) => `${n} ${n === 1 ? "sách" : "sách"}`,
    chapters: (n: number) => `${n} chương`,
    studied: (done: number, total: number) => `${done}/${total} đã học`,
    otLabel: "CT",
    ntLabel: "TT",
    chapter: (n: number) => `Chương ${n}`,
    markStudied: "Đánh dấu đã học",
    markUnread: "Đánh dấu chưa đọc",
    chapterNote2: "Ghi chú chương",
    focusMode: "Chế độ tập trung",
    exitFocus: "Thoát tập trung",
    copyAll: "Sao chép toàn bộ",
    print: "In / Xuất PDF",
    share: "Chia sẻ",
    disableShare: "Tắt chia sẻ",
    linkCopied: "Đã sao chép liên kết!",
    sharingDisabled: "Đã tắt chia sẻ",
    toggleInsights: "Nhận xét AI",
    highlightedOnly: "Chỉ câu nổi bật",
    showAll: "Hiện tất cả câu",
    versionLabels: {
      vi: "Bản Truyền Thống 1930",
      niv: "New International Version",
      kjv: "King James Version",
    },
  },
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────

interface StudyReaderShellProps {
  list: BibleStudyList;
  books: BibleBook[];
  initialPassages: BibleStudyPassage[];
  initialNotes: BibleStudyNote[];
  initialHighlights: BibleStudyHighlight[];
}

interface LoadedChapter {
  key: string;
  content: ChapterContent;
}
type LoadedChapterMap = Record<string, LoadedChapter>;

const chapterKey = (bookId: string, chapter: number, version: ReadVersionId) =>
  `${bookId}:${chapter}:${version}`;

const VERSIONS: { id: ReadVersionId; label: string; short: string }[] = [
  { id: "vi", label: "Vietnamese", short: "VI" },
  { id: "niv", label: "New International Version", short: "NIV" },
  { id: "kjv", label: "King James Version", short: "KJV" },
];

const OT_MAX = 39;

const HIGHLIGHT_COLORS: { color: HighlightColor; bg: string; label: string }[] = [
  { color: "yellow", bg: "bg-yellow-200 dark:bg-yellow-800/60", label: "Yellow" },
  { color: "blue",   bg: "bg-blue-200 dark:bg-blue-800/60",   label: "Blue" },
  { color: "pink",   bg: "bg-pink-200 dark:bg-pink-800/60",   label: "Pink" },
  { color: "green",  bg: "bg-green-200 dark:bg-green-800/60", label: "Green" },
];

function highlightBg(color: HighlightColor) {
  return HIGHLIGHT_COLORS.find((h) => h.color === color)?.bg ?? "";
}

// ── Note inline editor ────────────────────────────────────────────────────────

type TIntl = typeof INTL.en;

function NoteEditor({
  listId,
  bookId,
  chapter,
  verseNumber,
  existing,
  t,
  onSave,
  onDelete,
  onClose,
}: {
  listId: string;
  bookId: string;
  chapter: number;
  verseNumber?: number | null;
  existing?: BibleStudyNote;
  t: TIntl;
  onSave: (note: BibleStudyNote) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(existing?.content ?? "");
  const [, start] = useTransition();

  const handleSave = () => {
    if (!text.trim()) return;
    start(async () => {
      const note = await saveNote({
        listId,
        bookId,
        chapter,
        verseNumber: verseNumber ?? null,
        content: text.trim(),
        noteId: existing?.id,
      });
      onSave(note);
      onClose();
    });
  };

  return (
    <div className="mt-1.5 rounded-xl border border-violet-300 bg-violet-50 p-3 dark:border-violet-700/50 dark:bg-violet-950/20">
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder={verseNumber ? t.noteOnVerse(verseNumber) : t.chapterNote}
        className="w-full resize-none bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!text.trim()}
            className="rounded-lg bg-violet-600 px-3 py-1 text-[11px] font-semibold text-white disabled:opacity-40"
          >
            {t.save}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-[11px] transition-colors"
          >
            {t.cancel}
          </button>
        </div>
        {existing && (
          <button
            type="button"
            onClick={() => { start(async () => { await deleteNote(existing.id); onDelete(existing.id); onClose(); }); }}
            className="text-muted-foreground hover:text-destructive text-[11px] transition-colors"
          >
            {t.deleteNote}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Verse row ─────────────────────────────────────────────────────────────────

function VerseRow({
  listId,
  bookId,
  chapter,
  verseNum,
  text,
  highlight,
  note,
  isSelected,
  onHighlight,
  onNote,
  onSelect,
}: {
  listId: string;
  bookId: string;
  chapter: number;
  verseNum: number;
  text: string;
  highlight?: BibleStudyHighlight;
  note?: BibleStudyNote;
  isSelected?: boolean;
  onHighlight: (verseNum: number, color: HighlightColor) => void;
  onNote: (verseNum: number) => void;
  onSelect: (verseNum: number) => void;
}) {
  const [showTools, setShowTools] = useState(false);
  const [, startHL] = useTransition();

  const handleCopy = () => navigator.clipboard.writeText(text);

  return (
    <div
      className={cn(
        "group relative flex gap-2 rounded-lg px-2 py-0.5 -mx-2 transition-all",
        isSelected
          ? "border-l-2 border-primary bg-primary/5 pl-3"
          : highlight ? highlightBg(highlight.color) : "hover:bg-muted/40"
      )}
      onMouseEnter={() => setShowTools(true)}
      onMouseLeave={() => setShowTools(false)}
    >
      <button
        type="button"
        onClick={() => onSelect(verseNum)}
        title={isSelected ? "Deselect verse" : "Select verse to ask AI"}
        className={cn(
          "mt-0.5 w-5 shrink-0 text-[11px] font-medium transition-colors",
          isSelected ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
        )}>
        {verseNum}
      </button>
      <div className="flex-1">
        <span className="text-foreground text-sm leading-relaxed">{text}</span>
        {note && (
          <div
            className="mt-1 flex items-start gap-1.5 rounded-lg border border-violet-200 bg-violet-50 dark:border-violet-700/40 dark:bg-violet-950/20 px-2 py-1.5 cursor-pointer"
            onClick={() => onNote(verseNum)}
          >
            <Pencil className="text-violet-500 mt-0.5 h-3 w-3 shrink-0" />
            <p className="text-xs text-violet-800 dark:text-violet-200 leading-snug">{note.content}</p>
          </div>
        )}
      </div>
      {/* Hover toolbar */}
      {showTools && (
        <div className="absolute right-0 top-0 flex items-center gap-0.5 rounded-xl border border-border bg-background px-1.5 py-1 shadow-md">
          {HIGHLIGHT_COLORS.map((hc) => (
            <button
              key={hc.color}
              type="button"
              title={hc.label}
              onClick={() => {
                startHL(async () => {
                  await toggleHighlight({ listId, bookId, chapter, verseNumber: verseNum, color: hc.color });
                  onHighlight(verseNum, hc.color);
                });
              }}
              className={cn(
                "h-4 w-4 rounded-full border-2 transition-transform hover:scale-110",
                highlight?.color === hc.color ? "border-foreground" : "border-transparent",
                hc.bg
              )}
            />
          ))}
          <div className="mx-1 h-3 w-px bg-border" />
          <button
            type="button"
            title="Add note"
            onClick={() => onNote(verseNum)}
            className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            type="button"
            title="Copy verse"
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Insights panel (inline) ───────────────────────────────────────────────────

function InlineInsights({ bookId, chapter, version, t }: { bookId: string; chapter: number; version: ReadVersionId; t: TIntl }) {
  const [data, setData] = useState<ChapterInsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightTab, setInsightTab] = useState<"context" | "explanation" | "reflection">("context");
  const apiLang = version === "vi" ? "VI" : "EN";

  useEffect(() => {
    setLoading(true);
    getInsightsForChapter(bookId, chapter, apiLang).then((res) => {
      setData(res.db ?? res.ai ?? null);
      setLoading(false);
    });
  }, [bookId, chapter, apiLang]);

  if (!loading && !data) return null;

  const insightTabs = [
    { key: "context" as const, label: t.context },
    { key: "explanation" as const, label: t.explanation },
    { key: "reflection" as const, label: t.reflection },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-muted-foreground/30 px-1.5 py-0.5 text-[10px] text-muted-foreground">
          <Sparkles className="h-2.5 w-2.5" /> {t.aiGenerated}
        </span>
      </div>
      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="bg-muted h-3 w-full rounded" />
          <div className="bg-muted h-3 w-4/5 rounded" />
        </div>
      ) : (
        <>
          <div className="mb-3 flex gap-1">
            {insightTabs.map((it) => (
              <button
                key={it.key}
                type="button"
                onClick={() => setInsightTab(it.key)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all",
                  insightTab === it.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {it.label}
              </button>
            ))}
          </div>
          {insightTab === "context" && <p className="text-xs leading-relaxed text-foreground/80">{data?.context}</p>}
          {insightTab === "explanation" && <p className="text-xs leading-relaxed text-foreground/80">{data?.explanation}</p>}
          {insightTab === "reflection" && (
            <div className="space-y-2">
              {data?.reflections.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <span className="bg-primary text-primary-foreground mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">{i + 1}</span>
                  <p className="text-xs leading-relaxed text-foreground/80">{r}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Verse quote card ──────────────────────────────────────────────────────────

function VerseQuoteCard({
  passage,
  books,
  version,
  lang,
  onDelete,
}: {
  passage: BibleStudyPassage;
  books: BibleBook[];
  version: ReadVersionId;
  lang: string;
  onDelete: (id: string) => void;
}) {
  const [verseText, setVerseText] = useState<string | null>(null);
  const [, startDelete] = useTransition();
  const book = books.find((b) => b.id === passage.bookId);

  useEffect(() => {
    getChapterContent(passage.bookId, passage.chapter, version).then((content) => {
      if (!content || passage.verseStart == null) return;
      const start = passage.verseStart;
      const end = passage.verseEnd ?? start;
      const texts = content.verses
        .filter((v) => v.number >= start && v.number <= end)
        .map((v) => v.text);
      setVerseText(texts.join(" "));
    });
  }, [passage.bookId, passage.chapter, passage.verseStart, passage.verseEnd, version]);

  if (!book) return null;

  const bookName = lang === "vi" ? (book.nameVi ?? book.nameEn) : book.nameEn;
  const testament = book.order <= OT_MAX ? "ot" : "nt";
  const readLink = `/bible/${lang}/read?version1=${version}&book1=${passage.bookId}&chapter1=${passage.chapter}&testament1=${testament}`;
  const verseLabel = passage.verseStart === passage.verseEnd
    ? `${passage.verseStart}`
    : `${passage.verseStart}–${passage.verseEnd}`;

  const handleDelete = () => {
    startDelete(async () => {
      await toggleStudyPassage({
        listId: passage.listId,
        bookId: passage.bookId,
        chapter: passage.chapter,
        verseStart: passage.verseStart,
        verseEnd: passage.verseEnd,
      });
      onDelete(passage.id);
    });
  };

  return (
    <div className="border-border bg-background/80 flex flex-col gap-2 rounded-xl border px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-foreground text-xs font-semibold">{bookName}</span>
          <span className="text-muted-foreground text-xs">{passage.chapter}:{verseLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <a
            href={readLink}
            title="Read in context"
            className="text-muted-foreground hover:text-primary rounded p-1 transition-colors"
          >
            <Link2 className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={handleDelete}
            title="Remove verse"
            className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {verseText == null ? (
        <div className="bg-muted h-3 w-3/4 animate-pulse rounded" />
      ) : (
        <p className="text-foreground/80 text-sm leading-relaxed italic">"{verseText}"</p>
      )}
    </div>
  );
}

// ── Main shell ────────────────────────────────────────────────────────────────

export function StudyReaderShell({
  list,
  books,
  initialPassages,
  initialNotes,
  initialHighlights,
}: StudyReaderShellProps) {
  const [version, setVersion] = useState<ReadVersionId>("niv");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(books[0]?.id ?? null);
  const [testament, setTestament] = useState<"ot" | "nt">("ot");
  const [loadedChapters, setLoadedChapters] = useState<LoadedChapterMap>({});
  const [passages, setPassages] = useState<BibleStudyPassage[]>(initialPassages);
  const [notes, setNotes] = useState<BibleStudyNote[]>(initialNotes);
  const [highlights, setHighlights] = useState<BibleStudyHighlight[]>(initialHighlights);
  const [isSaving, startSaving] = useTransition();
  const [focusMode, setFocusMode] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState<VerseRef[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [editingNoteFor, setEditingNoteFor] = useState<{ chapter: number; verseNumber: number | null } | null>(null);
  const [isPublic, setIsPublic] = useState(list.isPublic);
  const [publicSlug, setPublicSlug] = useState(list.publicSlug);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [, startStudied] = useTransition();
  const [, startShare] = useTransition();
  // Per-chapter highlighted-only toggle: key = `${bookId}:${chapter}`
  const [highlightedOnlySet, setHighlightedOnlySet] = useState<Set<string>>(new Set());
  const toggleHighlightedOnly = (key: string) =>
    setHighlightedOnlySet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  const pathname = usePathname();
  const lang = (pathname?.match(/^\/bible\/(en|vi)/)?.[1] ?? "en") as "en" | "vi";
  const t = (INTL[lang] ?? INTL.en) as typeof INTL.en;

  const handleSelectVerse = useCallback((bookId: string, chapter: number, verseNum: number, text: string, bookNameEn: string, bookNameVi: string) => {
    const bookName = lang === "vi" ? bookNameVi : bookNameEn;
    const key = `${bookId}:${chapter}:${verseNum}`;
    setSelectedVerses((prev) => {
      const exists = prev.find((v) => `${v.bookName}:${v.chapter}:${v.verseNum}` === `${bookName}:${chapter}:${verseNum}`);
      if (exists) return prev.filter((v) => !(v.bookName === bookName && v.chapter === chapter && v.verseNum === verseNum));
      return [...prev, { bookName, chapter, verseNum, text }];
    });
    void key;
  }, [lang]);

  // Split passages by type
  const chapterPassages = useMemo(() => passages.filter((p) => p.verseStart === null), [passages]);
  const versePassages = useMemo(() => passages.filter((p) => p.verseStart !== null), [passages]);

  const chapterPassagesRef = useRef(chapterPassages);
  chapterPassagesRef.current = chapterPassages;

  const otBooks = useMemo(() => books.filter((b) => b.order <= OT_MAX), [books]);
  const ntBooks = useMemo(() => books.filter((b) => b.order > OT_MAX), [books]);
  const visibleBooks = testament === "ot" ? otBooks : ntBooks;

  const selectedBook = useMemo(() => books.find((b) => b.id === selectedBookId) ?? null, [books, selectedBookId]);

  useEffect(() => {
    const first = testament === "ot" ? otBooks[0] : ntBooks[0];
    setSelectedBookId(first?.id ?? null);
  }, [testament, otBooks, ntBooks]);

  // Chapter grid only counts whole-chapter passages
  const chaptersForBook = useMemo(
    () => chapterPassages.filter((p) => p.bookId === selectedBook?.id).map((p) => p.chapter).sort((a, b) => a - b),
    [chapterPassages, selectedBook?.id]
  );

  const studiedChapters = useMemo(
    () => new Set(chapterPassages.filter((p) => p.isStudied).map((p) => `${p.bookId}:${p.chapter}`)),
    [chapterPassages]
  );

  const totalSelected = chapterPassages.length;
  const totalStudied = chapterPassages.filter((p) => p.isStudied).length;

  // highlights index: `${bookId}:${chapter}:${verseNumber}` → highlight
  const highlightIndex = useMemo(() => {
    const idx: Record<string, BibleStudyHighlight> = {};
    for (const h of highlights) idx[`${h.bookId}:${h.chapter}:${h.verseNumber}`] = h;
    return idx;
  }, [highlights]);

  // notes index: `${bookId}:${chapter}:${verseNumber ?? ""}` → note
  const noteIndex = useMemo(() => {
    const idx: Record<string, BibleStudyNote> = {};
    for (const n of notes) idx[`${n.bookId}:${n.chapter}:${n.verseNumber ?? ""}`] = n;
    return idx;
  }, [notes]);

  // verse ranges index: `${bookId}:${chapter}` → set of saved verse numbers (only for verse-level passages)
  const verseRangeIndex = useMemo(() => {
    const idx: Record<string, Set<number>> = {};
    for (const p of passages) {
      if (p.verseStart == null) continue; // whole-chapter passage — no dimming
      const k = `${p.bookId}:${p.chapter}`;
      if (!idx[k]) idx[k] = new Set();
      const end = p.verseEnd ?? p.verseStart;
      for (let v = p.verseStart; v <= end; v++) idx[k].add(v);
    }
    return idx;
  }, [passages]);

  const handleChapterClick = (chapter: number) => {
    if (!selectedBook) return;
    const key = chapterKey(selectedBook.id, chapter, version);
    const isSelected = chaptersForBook.includes(chapter);
    setPassages((prev) => {
      if (isSelected) {
        return prev.filter((p) => !(p.bookId === selectedBook.id && p.chapter === chapter && p.verseStart === null));
      }
      const now = new Date();
      return [...prev, { id: key, listId: list.id, bookId: selectedBook.id, chapter, verseStart: null, verseEnd: null, isStudied: false, studiedAt: null, createdAt: now, updatedAt: now }];
    });
    if (isSelected) {
      setLoadedChapters((prev) => { const n = { ...prev }; delete n[key]; return n; });
    } else {
      void (async () => {
        const content = await getChapterContent(selectedBook.id, chapter, version);
        if (content) setLoadedChapters((prev) => ({ ...prev, [key]: { key, content } }));
      })();
    }
    void toggleStudyPassage({ listId: list.id, bookId: selectedBook.id, chapter }).catch(console.error);
  };

  const handleClearBook = () => {
    if (!selectedBook) return;
    setPassages((prev) => prev.filter((p) => !(p.bookId === selectedBook.id && p.verseStart === null)));
    setLoadedChapters((prev) => {
      const n = { ...prev };
      for (const k of Object.keys(n)) { if (k.startsWith(`${selectedBook.id}:`)) delete n[k]; }
      return n;
    });
  };

  // Version change → reload whole-chapter passages only
  useEffect(() => {
    let cancelled = false;
    async function reload() {
      const current = chapterPassagesRef.current;
      if (current.length === 0) { if (!cancelled) setLoadedChapters({}); return; }
      const combos = Array.from(new Map(current.map((p) => [`${p.bookId}:${p.chapter}`, { bookId: p.bookId, chapter: p.chapter }])).values());
      const results = await Promise.all(combos.map((c) => getChapterContent(c.bookId, c.chapter, version)));
      const entries: LoadedChapterMap = {};
      results.forEach((content, i) => {
        if (!content) return;
        const { bookId, chapter } = combos[i];
        const k = chapterKey(bookId, chapter, version);
        entries[k] = { key: k, content };
      });
      if (!cancelled) setLoadedChapters(entries);
    }
    void reload();
    return () => { cancelled = true; };
  }, [version]);

  const handleMarkStudied = (bookId: string, chapter: number) => {
    const key = `${bookId}:${chapter}`;
    const isStudied = studiedChapters.has(key);
    setPassages((prev) => prev.map((p) => p.bookId === bookId && p.chapter === chapter ? { ...p, isStudied: !isStudied } : p));
    startStudied(async () => {
      await markChapterStudied({ listId: list.id, bookId, chapter, studied: !isStudied });
    });
  };

  const handleHighlight = useCallback((bookId: string, chapter: number, verseNum: number, color: HighlightColor) => {
    const k = `${bookId}:${chapter}:${verseNum}`;
    setHighlights((prev) => {
      const existing = prev.find((h) => h.bookId === bookId && h.chapter === chapter && h.verseNumber === verseNum);
      if (existing) {
        if (existing.color === color) return prev.filter((h) => h.id !== existing.id);
        return prev.map((h) => h.id === existing.id ? { ...h, color } : h);
      }
      return [...prev, { id: k, listId: list.id, bookId, chapter, verseNumber: verseNum, color, createdAt: new Date() }];
    });
  }, [list.id]);

  const handleNoteUpdated = (note: BibleStudyNote) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === note.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = note; return n; }
      return [...prev, note];
    });
  };

  const handleNoteDeleted = (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const handleDeleteVersePassage = (id: string) => setPassages((prev) => prev.filter((p) => p.id !== id));

  const handleShare = () => {
    startShare(async () => {
      const { isPublic: pub, publicSlug: slug } = await togglePublicShare(list.id);
      setIsPublic(pub);
      setPublicSlug(slug);
      if (pub && slug) {
        const url = `${window.location.origin}/study/shared/${slug}`;
        await navigator.clipboard.writeText(url);
        setShareMsg(t.linkCopied);
        setTimeout(() => setShareMsg(null), 3000);
      } else {
        setShareMsg(t.sharingDisabled);
        setTimeout(() => setShareMsg(null), 2000);
      }
    });
  };

  const handlePrint = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`/api/study/print?url=${url}`, "_blank");
  };

  const handleCopyAll = () => {
    const lines: string[] = [`# ${list.title}`, ""];
    const sorted = Object.values(loadedChapters).sort((a, b) =>
      a.content.book.order !== b.content.book.order ? a.content.book.order - b.content.book.order : a.content.chapter - b.content.chapter
    );
    for (const { content } of sorted) {
      lines.push(`## ${content.book.nameEn} ${content.chapter}`);
      for (const v of content.verses) lines.push(`${v.number}. ${v.text}`);
      lines.push("");
    }
    navigator.clipboard.writeText(lines.join("\n"));
  };

  const sortedChapters = Object.values(loadedChapters).sort((a, b) =>
    a.content.book.order !== b.content.book.order ? a.content.book.order - b.content.book.order : a.content.chapter - b.content.chapter
  );

  // Stats
  const uniqueBooks = new Set(passages.map((p) => p.bookId)).size;
  const otCount = passages.filter((p) => { const b = books.find((b) => b.id === p.bookId); return b && b.order <= OT_MAX; }).length;
  const ntCount = totalSelected - otCount;

  return (
    <div className={cn("min-h-screen", focusMode && "bg-background")}>
      <Container maxWidth="7xl" className="px-4 py-6 lg:px-0">
        {/* Header */}
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground mb-1 text-xs tracking-[0.18em] uppercase">{t.studyList}</p>
            <h1 className="text-foreground text-2xl font-semibold">{list.title}</h1>
            {list.description && <p className="text-muted-foreground mt-1 max-w-xl text-sm">{list.description}</p>}
            {list.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {list.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    <Tag className="h-2.5 w-2.5" />{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Toolbar */}
          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            <button type="button" onClick={handleCopyAll} disabled={sortedChapters.length === 0} title={t.copyAll} className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors disabled:opacity-30">
              <Copy className="h-4 w-4" />
            </button>
            <button type="button" onClick={handlePrint} title={t.print} className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors">
              <Printer className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleShare}
              title={isPublic ? t.disableShare : t.share}
              className={cn("rounded-lg p-2 transition-colors", isPublic ? "text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <Share2 className="h-4 w-4" />
            </button>
            {shareMsg && <span className="text-xs text-primary animate-in fade-in">{shareMsg}</span>}
            <button type="button" onClick={() => setShowInsights((v) => !v)} title={t.toggleInsights} className={cn("rounded-lg p-2 transition-colors", showInsights ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
              <Lightbulb className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setChatOpen((v) => !v)}
              title="Ask AI about verses"
              className={cn("relative rounded-lg p-2 transition-colors", chatOpen ? "text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <MessageCircle className="h-4 w-4" />
              {selectedVerses.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {selectedVerses.length}
                </span>
              )}
            </button>
            <button type="button" onClick={() => setFocusMode((v) => !v)} title={focusMode ? t.exitFocus : t.focusMode} className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors">
              {focusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Stats bar */}
        {totalSelected > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card/50 px-4 py-3 text-xs">
            <span className="text-muted-foreground">{t.books(uniqueBooks)}</span>
            <span className="text-muted-foreground">{t.chapters(totalSelected)}</span>
            <span className="text-muted-foreground">{t.otLabel} {otCount} · {t.ntLabel} {ntCount}</span>
            {totalSelected > 0 && (
              <>
                <div className="flex flex-1 items-center gap-2">
                  <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${Math.round((totalStudied / totalSelected) * 100)}%` }} />
                  </div>
                  <span className="text-muted-foreground shrink-0">{t.studied(totalStudied, totalSelected)}</span>
                </div>
              </>
            )}
          </div>
        )}

        <div className={cn("flex flex-col gap-6", !focusMode && "lg:flex-row lg:items-start lg:gap-4")}>
          {/* ── Sidebar ── */}
          {!focusMode && (
            <aside className="shrink-0 lg:w-64 xl:w-72">
              <div className="border-border bg-card/70 space-y-5 rounded-2xl border p-4 backdrop-blur">
                {/* Version */}
                <div>
                  <p className="text-muted-foreground mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">{t.version}</p>
                  <div className="flex flex-col gap-1.5">
                    {VERSIONS.map((v) => (
                      <button key={v.id} type="button" onClick={() => setVersion(v.id)}
                        className={cn("flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs transition-colors",
                          version === v.id ? "bg-foreground text-background border-foreground" : "bg-background text-foreground/80 border-border hover:bg-muted"
                        )}>
                        <span className={cn("flex h-5 w-8 shrink-0 items-center justify-center rounded text-[10px] font-bold",
                          version === v.id ? "bg-background/20" : "bg-muted text-muted-foreground")}>
                          {v.short}
                        </span>
                        <span className="font-medium">{t.versionLabels[v.id]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-border h-px" />

                {/* Testament */}
                <div>
                  <p className="text-muted-foreground mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">{t.testament}</p>
                  <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/40 p-1">
                    {(["ot", "nt"] as const).map((tst) => (
                      <button key={tst} type="button" onClick={() => setTestament(tst)}
                        className={cn("rounded-lg py-1.5 text-xs font-medium transition-all",
                          testament === tst ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                        {tst === "ot" ? t.old : t.new}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Book list */}
                <div>
                  <p className="text-muted-foreground mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">{t.book}</p>
                  <div className="max-h-64 space-y-0.5 overflow-y-auto pr-1 lg:max-h-80">
                    {visibleBooks.map((b) => {
                      const count = passages.filter((p) => p.bookId === b.id && p.verseStart === null).length;
                      const bookLabel = lang === "vi" ? (b.nameVi ?? b.nameEn) : b.nameEn;
                      return (
                        <button key={b.id} type="button" onClick={() => setSelectedBookId(b.id)}
                          className={cn("flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                            selectedBookId === b.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80 hover:bg-muted")}>
                          <span>{bookLabel}</span>
                          {count > 0 && (
                            <span className={cn("flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                              selectedBookId === b.id ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground")}>
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-border h-px" />

                {/* Summary & save */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-xs">
                      {totalSelected === 0 ? t.noChaptersSelected : t.chaptersSelected(totalSelected)}
                    </p>
                    {totalSelected > 0 && (
                      <button type="button" onClick={() => { setPassages([]); setLoadedChapters({}); }} className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2 transition-colors">
                        {t.clearAll}
                      </button>
                    )}
                  </div>
                  <button type="button"
                    onClick={() => startSaving(async () => { await saveStudyPassages({ listId: list.id, chapters: chapterPassages.map((p) => ({ bookId: p.bookId, chapter: p.chapter })) }).catch(console.error); })}
                    disabled={totalSelected === 0 || isSaving}
                    className={cn("w-full rounded-xl py-2 text-xs font-semibold transition-colors",
                      totalSelected === 0 || isSaving ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-foreground text-background hover:bg-foreground/90")}>
                    {isSaving ? t.saving : t.saveList}
                  </button>
                </div>
              </div>
            </aside>
          )}

          {/* ── Main panel ── */}
          <main className="min-w-0 flex-1">
            {/* Chapter grid for selected book */}
            {selectedBook && !focusMode && (
              <div className="border-border bg-card/50 mb-6 rounded-2xl border p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-foreground text-sm font-semibold">
                      {lang === "vi" ? (selectedBook.nameVi ?? selectedBook.nameEn) : selectedBook.nameEn}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {chaptersForBook.length > 0
                        ? t.chaptersSelected(chaptersForBook.length)
                        : t.tapToAdd}
                    </p>
                  </div>
                  {chaptersForBook.length > 0 && (
                    <button type="button" onClick={handleClearBook} className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors">
                      <Trash2 className="h-3 w-3" />{t.clearBook}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 md:grid-cols-12">
                  {Array.from({ length: selectedBook.chapterCount }, (_, idx) => {
                    const ch = idx + 1;
                    const active = chaptersForBook.includes(ch);
                    const studied = studiedChapters.has(`${selectedBook.id}:${ch}`);
                    return (
                      <button key={ch} type="button" onClick={() => handleChapterClick(ch)}
                        className={cn("relative h-8 rounded-xl border text-xs font-medium transition-all",
                          active ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105" : "bg-muted/60 text-foreground hover:bg-primary/10 hover:border-primary/30 border-transparent")}>
                        {ch}
                        {studied && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 border border-background" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Saved Verses */}
            {versePassages.length > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <Star className="text-primary h-4 w-4" />
                  <h2 className="text-foreground text-sm font-semibold">{t.savedVerses}</h2>
                  <span className="text-muted-foreground text-xs">· {versePassages.length}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {versePassages.map((p) => (
                    <VerseQuoteCard
                      key={p.id}
                      passage={p}
                      books={books}
                      version={version}
                      lang={lang}
                      onDelete={handleDeleteVersePassage}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Reading area */}
            {sortedChapters.length === 0 && versePassages.length === 0 ? (
              <div className="text-muted-foreground flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
                <BookCircleIcon size="lg" className="mb-1 opacity-50" />
                <p className="text-foreground text-sm font-medium">{t.selectChapters}</p>
                <p className="max-w-xs text-xs">{t.selectHint}</p>
              </div>
            ) : sortedChapters.length === 0 ? null : (
              <div className="space-y-6">
                {(() => {
                  const groups: { bookId: string; bookNameEn: string; bookNameVi: string; order: number; chapters: typeof sortedChapters }[] = [];
                  for (const ch of sortedChapters) {
                    const last = groups[groups.length - 1];
                    if (last && last.bookId === ch.content.book.id) last.chapters.push(ch);
                    else groups.push({ bookId: ch.content.book.id, bookNameEn: ch.content.book.nameEn, bookNameVi: ch.content.book.nameVi ?? ch.content.book.nameEn, order: ch.content.book.order, chapters: [ch] });
                  }
                  return groups.map((group) => (
                    <section key={group.bookId}>
                      <div className="mb-3 flex items-center gap-2">
                        <BookOpen className="text-primary h-4 w-4" />
                        <h2 className="text-foreground text-sm font-semibold">{lang === "vi" ? group.bookNameVi : group.bookNameEn}</h2>
                        <span className="text-muted-foreground text-xs">· {t.chapters(group.chapters.length)}</span>
                      </div>
                      <div className="space-y-4">
                        {group.chapters.map(({ key, content }) => {
                          const isStudied = studiedChapters.has(`${content.book.id}:${content.chapter}`);
                          const chapterNote = noteIndex[`${content.book.id}:${content.chapter}:`];
                          const isEditingChapterNote = editingNoteFor?.chapter === content.chapter && editingNoteFor?.verseNumber === null;

                          const chapterHlKey = `${content.book.id}:${content.chapter}`;
                          const isHighlightedOnly = highlightedOnlySet.has(chapterHlKey);

                          return (
                            <article key={key} className="border-border bg-background/80 rounded-2xl border">
                              <header className={cn(
                                "border-border/60 sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-5 py-3 rounded-t-2xl backdrop-blur-sm",
                                isStudied ? "from-green-500/10 bg-gradient-to-r to-background/95" : "from-primary/5 bg-gradient-to-r to-background/95"
                              )}>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-foreground text-sm font-semibold">{t.chapter(content.chapter)}</h3>
                                  {content.sectionTitle?.trim() && (
                                    <span className="text-muted-foreground text-xs italic">{content.sectionTitle.trim()}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-muted-foreground text-[10px] font-semibold tracking-[0.14em] uppercase">{version.toUpperCase()}</span>
                                  {/* Highlighted-only toggle — per chapter */}
                                  <button
                                    type="button"
                                    onClick={() => toggleHighlightedOnly(chapterHlKey)}
                                    title={isHighlightedOnly ? t.showAll : t.highlightedOnly}
                                    className={cn("rounded-lg p-1 transition-colors", isHighlightedOnly ? "text-amber-500" : "text-muted-foreground hover:text-amber-500")}
                                  >
                                    {isHighlightedOnly ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                                  </button>
                                  <button type="button" onClick={() => setEditingNoteFor(isEditingChapterNote ? null : { chapter: content.chapter, verseNumber: null })}
                                    title={t.chapterNote2}
                                    className={cn("rounded-lg p-1 transition-colors", chapterNote ? "text-violet-500" : "text-muted-foreground hover:text-violet-500")}>
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button type="button" onClick={() => handleMarkStudied(content.book.id, content.chapter)}
                                    title={isStudied ? t.markUnread : t.markStudied}
                                    className={cn("rounded-lg p-1 transition-colors", isStudied ? "text-green-500" : "text-muted-foreground hover:text-green-500")}>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </header>

                              <div className="px-5 py-4">
                                {/* Chapter note */}
                                {chapterNote && !isEditingChapterNote && (
                                  <div className="mb-3 flex items-start gap-1.5 rounded-xl border border-violet-200 bg-violet-50 dark:border-violet-700/40 dark:bg-violet-950/20 px-3 py-2 cursor-pointer"
                                    onClick={() => setEditingNoteFor({ chapter: content.chapter, verseNumber: null })}>
                                    <Pencil className="text-violet-500 mt-0.5 h-3.5 w-3.5 shrink-0" />
                                    <p className="text-xs text-violet-800 dark:text-violet-200">{chapterNote.content}</p>
                                  </div>
                                )}
                                {isEditingChapterNote && (
                                  <div className="mb-3">
                                    <NoteEditor
                                      listId={list.id}
                                      bookId={content.book.id}
                                      chapter={content.chapter}
                                      verseNumber={null}
                                      existing={chapterNote}
                                      t={t}
                                      onSave={handleNoteUpdated}
                                      onDelete={handleNoteDeleted}
                                      onClose={() => setEditingNoteFor(null)}
                                    />
                                  </div>
                                )}

                                {/* Verses */}
                                <div className="space-y-1">
                                  {(() => {
                                    const rangeKey = `${content.book.id}:${content.chapter}`;
                                    const verseRange = verseRangeIndex[rangeKey]; // undefined = whole-chapter, Set = specific verses
                                    return content.verses.map((v) => {
                                    const hl = highlightIndex[`${content.book.id}:${content.chapter}:${v.number}`];
                                    const vNote = noteIndex[`${content.book.id}:${content.chapter}:${v.number}`];
                                    const isEditingVerse = editingNoteFor?.chapter === content.chapter && editingNoteFor?.verseNumber === v.number;
                                    const isDimmed = verseRange !== undefined && !verseRange.has(v.number);
                                    // Hide non-highlighted verses when per-chapter highlighted-only mode is on
                                    if (isHighlightedOnly && !hl && !vNote && !isEditingVerse) return null;
                                    return (
                                      <div key={v.number} className={cn(isDimmed && !isHighlightedOnly && "opacity-30 select-none pointer-events-none")}>
                                        <VerseRow
                                          listId={list.id}
                                          bookId={content.book.id}
                                          chapter={content.chapter}
                                          verseNum={v.number}
                                          text={v.text}
                                          highlight={hl}
                                          note={vNote}
                                          isSelected={selectedVerses.some(s => s.bookName === (lang === "vi" ? (content.book.nameVi ?? content.book.nameEn) : content.book.nameEn) && s.chapter === content.chapter && s.verseNum === v.number)}
                                          onHighlight={(vn, color) => handleHighlight(content.book.id, content.chapter, vn, color)}
                                          onNote={(vn) => setEditingNoteFor(isEditingVerse ? null : { chapter: content.chapter, verseNumber: vn })}
                                          onSelect={(vn) => {
                                            handleSelectVerse(content.book.id, content.chapter, vn, v.text, content.book.nameEn, content.book.nameVi ?? content.book.nameEn);
                                            setChatOpen(true);
                                          }}
                                        />
                                        {isEditingVerse && (
                                          <NoteEditor
                                            listId={list.id}
                                            bookId={content.book.id}
                                            chapter={content.chapter}
                                            verseNumber={v.number}
                                            existing={vNote}
                                            t={t}
                                            onSave={handleNoteUpdated}
                                            onDelete={handleNoteDeleted}
                                            onClose={() => setEditingNoteFor(null)}
                                          />
                                        )}
                                      </div>
                                    );
                                  });})()}
                                </div>

                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  ));
                })()}
              </div>
            )}
          </main>

          {/* ── Right: Insights Panel ── */}
          {showInsights && !focusMode && sortedChapters.length > 0 && (
            <aside className="shrink-0 lg:w-80 xl:w-96">
              <div className="sticky top-20">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{t.chapterInsights}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInsights(false)}
                    className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="max-h-[calc(100vh-6rem)] space-y-3 overflow-y-auto pr-1">
                  {sortedChapters.map(({ key, content }) => (
                    <div key={key} className="rounded-2xl border border-border bg-background/80 p-4">
                      <p className="mb-3 text-xs font-semibold text-foreground">
                        {lang === "vi" ? (content.book.nameVi ?? content.book.nameEn) : content.book.nameEn}{" "}
                        {t.chapter(content.chapter)}
                      </p>
                      <InlineInsights bookId={content.book.id} chapter={content.chapter} version={version} t={t} />
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* ── Right: AI Chat Panel ── */}
          <AnimatePresence>
            {chatOpen && !focusMode && (
              <VerseChatPanel
                selectedVerses={selectedVerses}
                lang={lang}
                onClose={() => setChatOpen(false)}
                onClearSelection={() => setSelectedVerses([])}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Floating "Ask AI" button when verses selected and chat closed */}
        <AnimatePresence>
          {selectedVerses.length > 0 && !chatOpen && (
            <motion.button
              type="button"
              onClick={() => setChatOpen(true)}
              className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
              initial={{ opacity: 0, scale: 0.8, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 12 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <MessageCircle className="h-4 w-4" />
              {lang === "vi" ? `Hỏi AI về ${selectedVerses.length} câu` : `Ask AI · ${selectedVerses.length} verse${selectedVerses.length > 1 ? "s" : ""}`}
            </motion.button>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
