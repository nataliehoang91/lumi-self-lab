"use client";

import type { BibleStudyList } from "@/types/bible-study";
import { deleteStudyList } from "@/app/actions/bible/study";
import { BookOpen, Clock, Loader2, Trash2, X } from "lucide-react";
import {
  InteractiveForm,
  LoadingMessage,
  SubmitButton,
  SubmitMessage,
} from "@/components/CoreAdvancedComponent/behaviors/interactive-form";
import { ReserveLayout } from "@/components/ui/reverse-layout";

interface StudyListCardProps {
  list: BibleStudyList;
}

export function StudyListCard({ list }: StudyListCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-background text-left text-sm min-h-[180px]">
      <div className="flex items-start justify-between gap-2 rounded-t-2xl bg-muted px-4 py-3">
        <div className="pr-2">
          <div className="text-base font-semibold text-foreground line-clamp-1">{list.title}</div>
          {list.description && (
            <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {list.description}
            </div>
          )}
        </div>
        <InteractiveForm
          action={async () => {
            await deleteStudyList(list.id);
            return {
              redirect: "/bible/study",
              refresh: true,
            };
          }}
        >
          <SubmitButton>
            <ReserveLayout>
              <SubmitMessage>
                <X className="w-3.5 h-3.5" aria-hidden />
              </SubmitMessage>
              <LoadingMessage>
                <Loader2 className="w-3.5 h-3.5" aria-hidden />
              </LoadingMessage>
            </ReserveLayout>
          </SubmitButton>
        </InteractiveForm>
      </div>
      <div className="flex flex-col flex-1 px-4 pb-3 pt-2">
        <div className="mt-auto border-t border-border/60 pt-2" />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" aria-hidden />
            <span>0 passages</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" aria-hidden />
            <span>{list.createdAt.toLocaleDateString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
