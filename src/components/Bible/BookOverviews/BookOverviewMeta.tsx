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
      {/* Author */}
      <div className="bg-card border-border rounded-xl border p-4">
        <p
          className={cn(
            "text-muted-foreground",
            bodyClass,
            isVi && "font-vietnamese-flashcard"
          )}
        >
          {isVi ? "Tác giả" : "Author"}
        </p>
        <div className="mt-3 flex flex-col items-start gap-1">
          <p
            className={cn(
              "text-foreground font-medium",
              bodyClassUp,
              isVi && "font-vietnamese-flashcard"
            )}
          >
            {author ?? "—"}
          </p>
          {authorOccupation && (
            <p
              className={cn(
                "text-muted-foreground/90",
                bodyClass,
                isVi && "font-vietnamese-flashcard"
              )}
            >
              {authorOccupation}
            </p>
          )}
        </div>
      </div>

      {/* Written */}
      <div className="bg-card border-border rounded-xl border p-4">
        <p
          className={cn(
            "text-muted-foreground",
            bodyClass,
            isVi && "font-vietnamese-flashcard"
          )}
        >
          {isVi ? "Thời gian biên soạn" : "Written"}
        </p>
        <div className="mt-3 flex flex-col items-start gap-1">
          <p
            className={cn(
              "text-foreground font-medium",
              bodyClass,
              isVi && "font-vietnamese-flashcard"
            )}
          >
            {date ?? "—"}
          </p>
        </div>
      </div>

      {/* Chapters */}
      <div className="bg-card border-border rounded-xl border p-4">
        <p
          className={cn(
            "text-muted-foreground",
            bodyClass,
            isVi && "font-vietnamese-flashcard"
          )}
        >
          {isVi ? "Số chương" : "Chapters"}
        </p>
        <div className="mt-3 flex flex-col items-start gap-1">
          <p
            className={cn(
              "text-foreground font-medium",
              bodyClass,
              isVi && "font-vietnamese-flashcard"
            )}
          >
            {chapters}
          </p>
        </div>
      </div>

      {/* Audience */}
      <div className="bg-card border-border rounded-xl border p-4">
        <p
          className={cn(
            "text-muted-foreground",
            bodyClass,
            isVi && "font-vietnamese-flashcard"
          )}
        >
          {isVi ? "Đối tượng độc giả" : "Audience"}
        </p>
        <div className="mt-3 flex flex-col items-start gap-1">
          <p
            className={cn(
              "text-foreground font-medium",
              bodyClassUp,
              isVi && "font-vietnamese-flashcard"
            )}
          >
            {audience ?? "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
