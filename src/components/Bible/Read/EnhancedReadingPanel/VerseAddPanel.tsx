"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

import { BookmarkPlus, Check, Loader2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BibleStudyListWithCount } from "@/types/bible-study";

interface VerseAddPanelProps {
  bookName: string;
  chapter: number;
  verseNum: number;
  verseText: string;
  lists: BibleStudyListWithCount[];
  loading: boolean;
  added: Record<string, boolean>;
  onAdd: (listId: string, fromRect: DOMRect, targetRect: DOMRect) => void;
  onClose: () => void;
  onCreateList: () => void;
}

export function VerseAddPanel({
  bookName,
  chapter,
  verseNum,
  verseText,
  lists,
  loading,
  added,
  onAdd,
  onClose,
  onCreateList,
}: VerseAddPanelProps) {
  const chipRef = useRef<HTMLDivElement>(null);
  const listItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleAdd = (listId: string) => {
    const el = listItemRefs.current[listId];
    const fromRect = chipRef.current?.getBoundingClientRect() ?? new DOMRect();
    const toRect = el?.getBoundingClientRect() ?? new DOMRect();
    onAdd(listId, fromRect, toRect);
  };

  return (
    <motion.div
      className="fixed right-0 top-14 bottom-0 z-40 w-72 flex flex-col border-l border-border bg-background/95 shadow-xl backdrop-blur-sm"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Save verse to list</p>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Verse chip — layoutId matches the one in toolbar */}
      <div className="border-b border-border/50 bg-primary/3 px-4 py-3">
        <motion.div
          ref={chipRef}
          layoutId="verse-add-chip"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5"
        >
          <BookmarkPlus className="h-3 w-3 text-primary" />
          <span className="text-xs font-semibold text-primary">
            {bookName} {chapter}:{verseNum}
          </span>
        </motion.div>
        <p className="mt-2 line-clamp-2 text-[11px] italic leading-relaxed text-muted-foreground">
          "{verseText}"
        </p>
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : lists.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm text-muted-foreground">No study lists yet</p>
            <button
              type="button"
              onClick={onCreateList}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Create a list
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Choose a list
            </p>
            {lists.map((list) => {
              const isAdded = added[list.id];
              return (
                <motion.button
                  key={list.id}
                  ref={(el) => { listItemRefs.current[list.id] = el; }}
                  type="button"
                  onClick={() => handleAdd(list.id)}
                  className={cn(
                    "group relative flex w-full items-center justify-between overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all",
                    isAdded === true
                      ? "border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-950/20"
                      : "border-border bg-background hover:border-primary/30 hover:bg-primary/3"
                  )}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">{list.title}</p>
                    <p className="text-[10px] text-muted-foreground">{list.passageCount} saved</p>
                  </div>

                  <AnimatePresence mode="wait">
                    {isAdded === true ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
                      >
                        <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="add"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10"
                      >
                        <Plus className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {lists.length > 0 && (
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={onCreateList}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> New study list
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ── Flying verse chip ─────────────────────────────────────────────────────────
// Renders a brief flying clone from the panel chip → the target list item

interface FlyingChipProps {
  from: DOMRect;
  to: DOMRect;
  label: string;
  onDone: () => void;
}

export function FlyingChip({ from, to, label, onDone }: FlyingChipProps) {
  return (
    <motion.div
      className="pointer-events-none fixed z-50 rounded-full bg-primary px-3 py-1.5 text-[10px] font-semibold text-primary-foreground shadow-lg"
      style={{ top: from.top, left: from.left, width: from.width, height: from.height }}
      animate={{
        top: to.top + to.height / 2,
        left: to.left + to.width / 2,
        width: 8,
        height: 8,
        opacity: [1, 1, 0],
        borderRadius: "50%",
      }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      onAnimationComplete={onDone}
    >
      <span className="whitespace-nowrap">{label}</span>
    </motion.div>
  );
}
