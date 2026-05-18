"use client";

import type { BibleStudyListWithCount } from "@/types/bible-study";
import { deleteStudyList } from "@/app/actions/bible/study";
import { BookOpen, Clock, Loader2, Tag, X } from "lucide-react";
import {
  InteractiveForm,
  LoadingMessage,
  SubmitButton,
  SubmitMessage,
} from "@/components/CoreAdvancedComponent/behaviors/interactive-form";
import { ReserveLayout } from "@/components/ui/reverse-layout";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TAG_COLOR_KEYS = ["sage", "peach", "rose", "sky", "lavender"] as const;
type TagColorKey = typeof TAG_COLOR_KEYS[number];

const TAG_COLOR_CLASSES: Record<TagColorKey, string> = {
  sage:     "bg-sage/15 border-sage/30 text-sage",
  peach:    "bg-tertiary/20 border-tertiary/40 text-tertiary-foreground",
  rose:     "bg-coral/15 border-coral/30 text-coral",
  sky:      "bg-sky-blue/15 border-sky-blue/30 text-sky-blue",
  lavender: "bg-second/15 border-second/30 text-second",
};

function parseTag(raw: string): { color: TagColorKey; label: string } {
  const sep = raw.indexOf("|");
  if (sep > 0) {
    const maybeColor = raw.slice(0, sep) as TagColorKey;
    if ((TAG_COLOR_KEYS as readonly string[]).includes(maybeColor)) {
      return { color: maybeColor, label: raw.slice(sep + 1) };
    }
  }
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (h * 31 + raw.charCodeAt(i)) >>> 0;
  return { color: TAG_COLOR_KEYS[h % TAG_COLOR_KEYS.length]!, label: raw };
}

interface StudyListCardProps {
  list: BibleStudyListWithCount;
}

export function StudyListCard({ list }: StudyListCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const langSegment = pathname?.match(/^\/bible\/(en|vi)/)?.[1] ?? "en";

  const handleOpen = () => {
    router.push(`/bible/${langSegment}/study/${list.id}`);
  };

  return (
    <div
      className="border-border bg-background hover:border-primary/40 flex h-full min-h-[180px]
        cursor-pointer flex-col rounded-2xl border text-left text-sm transition-colors
        hover:shadow-sm"
      onClick={handleOpen}
    >
      <div
        className="bg-muted flex items-start justify-between gap-2 rounded-t-2xl px-4
          py-3"
      >
        <div className="pr-2">
          <div className="text-foreground line-clamp-1 text-base font-semibold">
            {list.title}
          </div>
          {list.description && (
            <div className="text-muted-foreground mt-1 line-clamp-2 text-xs">
              {list.description}
            </div>
          )}
          {list.tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {list.tags.map((raw) => {
                const { color, label } = parseTag(raw);
                return (
                  <span key={raw} className={cn("inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-medium", TAG_COLOR_CLASSES[color])}>
                    <Tag className="h-2 w-2" />{label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <InteractiveForm
            action={async () => {
              await deleteStudyList(list.id);
              return {
                redirect: `/bible/${langSegment}/study`,
                refresh: true,
              };
            }}
          >
            <SubmitButton>
              <ReserveLayout>
                <SubmitMessage>
                  <X className="h-3.5 w-3.5" aria-hidden />
                </SubmitMessage>
                <LoadingMessage>
                  <Loader2 className="h-3.5 w-3.5" aria-hidden />
                </LoadingMessage>
              </ReserveLayout>
            </SubmitButton>
          </InteractiveForm>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pt-2 pb-3">
        <div className="border-border/60 mt-auto border-t pt-2" />
        <div
          className="text-muted-foreground mt-2 flex items-center justify-between text-xs"
        >
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            <span>
              {list.passageCount} {list.passageCount === 1 ? "chapter" : "chapters"}
            </span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            <span>{list.createdAt.toLocaleDateString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
