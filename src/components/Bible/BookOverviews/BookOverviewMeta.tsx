"use client";

import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

interface BookOverviewMetaProps {
  lang: "en" | "vi";
  author: string | null;
  authorOccupation: string | null;
  date: string | null;
  audience: string | null;
  chapters: number;
}

function MetaCard({
  label,
  children,
  isVi,
}: {
  label: string;
  children: React.ReactNode;
  isVi: boolean;
}) {
  return (
    <div className="bg-card border-border overflow-hidden rounded-xl border">
      <div className="bg-second/35 theme-warm:bg-second/50 h-1 w-full" />
      <div className="p-4">
        <p
          className={cn(
            "text-muted-foreground text-sm",
            isVi && "font-vietnamese-flashcard"
          )}
        >
          {label}
        </p>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

export function BookOverviewMeta({
  lang,
  author,
  authorOccupation,
  date,
  audience,
  chapters,
}: BookOverviewMetaProps) {
  const isVi = lang === "vi";
  const { bodyClass, bodyClassUp } = useBibleFontClasses();

  return (
    <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <MetaCard label={isVi ? "Tác giả" : "Author"} isVi={isVi}>
        <p className={cn("text-foreground font-medium", bodyClassUp, isVi && "font-vietnamese-flashcard")}>
          {author ?? "—"}
        </p>
        {authorOccupation && (
          <p className={cn("text-muted-foreground/90 mt-1", bodyClass, isVi && "font-vietnamese-flashcard")}>
            {authorOccupation}
          </p>
        )}
      </MetaCard>

      <MetaCard label={isVi ? "Thời gian biên soạn" : "Written"} isVi={isVi}>
        <p className={cn("text-foreground font-medium", bodyClass, isVi && "font-vietnamese-flashcard")}>
          {date ?? "—"}
        </p>
      </MetaCard>

      <MetaCard label={isVi ? "Số chương" : "Chapters"} isVi={isVi}>
        <p className={cn("text-foreground font-bold text-2xl tabular-nums")}>{chapters}</p>
      </MetaCard>

      <MetaCard label={isVi ? "Đối tượng độc giả" : "Audience"} isVi={isVi}>
        <p className={cn("text-foreground font-medium", bodyClassUp, isVi && "font-vietnamese-flashcard")}>
          {audience ?? "—"}
        </p>
      </MetaCard>
    </div>
  );
}
