"use client";

import type { BibleStudyList } from "@/types/bible-study";
import { deleteStudyList } from "@/app/actions/bible/study";
import { BookOpen, Clock, Loader2, X } from "lucide-react";
import {
  InteractiveForm,
  LoadingMessage,
  SubmitButton,
  SubmitMessage,
} from "@/components/CoreAdvancedComponent/behaviors/interactive-form";
import { ReserveLayout } from "@/components/ui/reverse-layout";
import { useRouter, usePathname } from "next/navigation";

interface StudyListCardProps {
  list: BibleStudyList;
}

export function StudyListCard({ list }: StudyListCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const langSegment = pathname?.match(/^\/bible\/(en|vi|zh)/)?.[1] ?? "en";

  const handleOpen = () => {
    router.push(`/bible/${langSegment}/study/${list.id}`);
  };

  return (
    <div
      className="border-border bg-background hover:border-primary/40 flex min-h-[180px]
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
            <span>0 passages</span>
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
