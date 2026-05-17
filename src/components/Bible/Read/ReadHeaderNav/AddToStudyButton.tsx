"use client";

import { useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BookmarkPlus, Check, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { useAuth } from "@clerk/nextjs";
import {
  getStudyListsForCurrentUser,
  getListsContainingPassage,
  toggleStudyPassage,
} from "@/app/actions/bible/study";
import { cn } from "@/lib/utils";
import type { BibleStudyListWithCount } from "@/types/bible-study";
import { useRouter } from "next/navigation";

interface FlyState { from: DOMRect; to: DOMRect }

export function AddToStudyButton({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { isSignedIn } = useAuth();
  const { leftBook, leftChapter, setStudyPanelOpen } = useRead();
  const { globalLanguage } = useBibleApp();
  const router = useRouter();
  const lang = globalLanguage === "VI" ? "vi" : "en";

  const [panelOpen, setPanelOpen] = useState(false);
  const [lists, setLists] = useState<BibleStudyListWithCount[]>([]);
  const [loading, setLoading] = useState(false);
  // true = in list, false = removed this session
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [flying, setFlying] = useState<FlyState | null>(null);
  const [, startTransition] = useTransition();

  const chipRef = useRef<HTMLDivElement>(null);
  const listItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  if (!isSignedIn || !leftBook) return null;

  const openPanel = async () => {
    setPanelOpen(true);
    setStudyPanelOpen(true);
    setAdded({});
    setLoading(true);
    const [allLists, containedIn] = await Promise.all([
      getStudyListsForCurrentUser(),
      getListsContainingPassage({ bookId: leftBook.id, chapter: leftChapter }),
    ]);
    setLists(allLists);
    // Pre-populate: lists that already contain this chapter start as true
    const initial: Record<string, boolean> = {};
    for (const id of containedIn) initial[id] = true;
    setAdded(initial);
    setLoading(false);
  };

  const handleToggle = (listId: string) => {
    const isCurrentlyAdded = added[listId] === true;

    // Flying chip only when adding
    if (!isCurrentlyAdded && chipRef.current) {
      const targetEl = listItemRefs.current[listId];
      if (targetEl) {
        setFlying({ from: chipRef.current.getBoundingClientRect(), to: targetEl.getBoundingClientRect() });
      }
    }

    startTransition(async () => {
      const result = await toggleStudyPassage({
        listId,
        bookId: leftBook.id,
        chapter: leftChapter,
      });
      setAdded((prev) => ({ ...prev, [listId]: result.added }));
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size={variant === "desktop" ? "sm" : "icon"}
        onClick={() => { if (panelOpen) { setPanelOpen(false); setStudyPanelOpen(false); } else { void openPanel(); } }}
        className={cn(
          "gap-1.5 rounded-lg transition-colors",
          panelOpen
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
        )}
        title="Add chapter to study list"
      >
        <BookmarkPlus className="h-4 w-4" />
        {variant === "desktop" && (
          <span className="hidden text-sm font-medium sm:inline">Study</span>
        )}
      </Button>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className="fixed right-0 top-14 bottom-0 z-40 flex w-72 flex-col border-l border-border bg-background/95 shadow-xl backdrop-blur-sm"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Add to study list</p>
                <p className="text-[10px] text-muted-foreground">
                  {leftBook.nameEn} · Chapter {leftChapter}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setPanelOpen(false); setStudyPanelOpen(false); }}
                className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chapter chip */}
            <div className="border-b border-border/50 bg-primary/3 px-4 py-3">
              <motion.div
                ref={chipRef}
                layoutId="study-add-chip"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5"
              >
                <BookmarkPlus className="h-3 w-3 text-primary" />
                <span className="text-xs font-semibold text-primary">
                  {leftBook.nameEn} {leftChapter}
                </span>
              </motion.div>
            </div>

            {/* Lists */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : lists.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <p className="text-sm text-muted-foreground">No study lists yet</p>
                  <button
                    type="button"
                    onClick={() => { setPanelOpen(false); setStudyPanelOpen(false); router.push(`/bible/${lang}/study`); }}
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
                    const isAdded = added[list.id] === true;
                    const isRemoved = added[list.id] === false;
                    return (
                      <motion.button
                        key={list.id}
                        ref={(el) => { listItemRefs.current[list.id] = el; }}
                        type="button"
                        onClick={() => handleToggle(list.id)}
                        className={cn(
                          "group relative flex w-full items-center justify-between overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all",
                          isAdded
                            ? "border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-950/20"
                            : "border-border bg-background hover:border-primary/30 hover:bg-primary/3"
                        )}
                        whileTap={{ scale: 0.97 }}
                      >
                        {/* ripple on add */}
                        <AnimatePresence>
                          {isAdded && !isRemoved && (
                            <motion.div
                              className="absolute inset-0 rounded-xl bg-green-400/20"
                              initial={{ scale: 0, opacity: 1 }}
                              animate={{ scale: 2, opacity: 0 }}
                              exit={{}}
                              transition={{ duration: 0.5 }}
                            />
                          )}
                        </AnimatePresence>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-foreground">{list.title}</p>
                          <p className="text-[10px] text-muted-foreground">{list.passageCount} chapters</p>
                        </div>

                        <AnimatePresence mode="wait">
                          {isAdded ? (
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
                              <Plus className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
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
                  onClick={() => { setPanelOpen(false); setStudyPanelOpen(false); router.push(`/bible/${lang}/study`); }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Plus className="h-3.5 w-3.5" /> Manage study lists
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying chip */}
      <AnimatePresence>
        {flying && (
          <motion.div
            className="pointer-events-none fixed z-50 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-semibold text-primary-foreground shadow-lg"
            style={{ top: flying.from.top, left: flying.from.left }}
            animate={{
              top: flying.to.top + flying.to.height / 2,
              left: flying.to.left + flying.to.width / 2,
              width: 8,
              height: 8,
              opacity: [1, 1, 0],
              padding: 0,
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={() => setFlying(null)}
          >
            <BookmarkPlus className="h-3 w-3" />
            <span>{leftBook.nameEn} {leftChapter}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
