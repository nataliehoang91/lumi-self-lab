"use client";

import { useState, useTransition } from "react";
import { BookmarkPlus, Check, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { useAuth } from "@clerk/nextjs";
import { toggleStudyPassage } from "@/app/actions/bible/study";
import { getStudyListsForCurrentUser } from "@/app/actions/bible/study";
import { cn } from "@/lib/utils";
import type { BibleStudyListWithCount } from "@/types/bible-study";
import { useRouter, usePathname } from "next/navigation";

export function AddToStudyButton({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { isSignedIn } = useAuth();
  const { leftBook, leftChapter } = useRead();
  const { globalLanguage } = useBibleApp();
  const router = useRouter();
  const pathname = usePathname();
  const lang = globalLanguage === "VI" ? "vi" : "en";

  const [lists, setLists] = useState<BibleStudyListWithCount[]>([]);
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  if (!isSignedIn || !leftBook) return null;

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && lists.length === 0) {
      setLoading(true);
      const result = await getStudyListsForCurrentUser();
      setLists(result);
      setLoading(false);
    }
  };

  const handleAdd = (listId: string) => {
    if (!leftBook) return;
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
    <DropdownMenu open={open} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={variant === "desktop" ? "sm" : "icon"}
          className="bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary gap-1.5 rounded-lg"
          title="Add chapter to study"
        >
          <BookmarkPlus className="h-4 w-4" />
          {variant === "desktop" && <span className="hidden text-sm font-medium sm:inline">Study</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs">
          Add {leftBook.nameEn} {leftChapter} to…
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
          </div>
        ) : lists.length === 0 ? (
          <DropdownMenuItem
            onClick={() => { setOpen(false); router.push(`/bible/${lang}/study`); }}
            className="text-xs"
          >
            Create a study list first →
          </DropdownMenuItem>
        ) : (
          <>
            {lists.map((list) => (
              <DropdownMenuItem
                key={list.id}
                onClick={() => handleAdd(list.id)}
                className="flex items-center justify-between text-xs"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{list.title}</p>
                  <p className="text-muted-foreground">{list.passageCount} chapters</p>
                </div>
                {added[list.id] !== undefined ? (
                  added[list.id] ? <Check className="ml-2 h-3.5 w-3.5 shrink-0 text-green-500" /> : null
                ) : null}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => { setOpen(false); router.push(`/bible/${lang}/study`); }}
              className="text-xs text-muted-foreground"
            >
              Manage study lists →
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
