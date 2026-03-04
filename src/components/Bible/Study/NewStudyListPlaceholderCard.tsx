"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateStudyListForm } from "./CreateStudyListForm";

interface NewStudyListPlaceholderCardProps {
  label?: string;
}

export function NewStudyListPlaceholderCard({
  label = "New list",
}: NewStudyListPlaceholderCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondaryLight"
          className="group bg-primary/10 border-primary/40 hover:border-primary/40
            hover:bg-primary/5 flex min-h-[180px] flex-col items-center justify-center
            gap-2 rounded-xl border-2 border-dashed p-6 transition-all duration-200"
        >
          <div
            className="bg-primary/30 group-hover:bg-primary/10 flex h-10 w-10 items-center
              justify-center rounded-xl transition-colors"
          >
            <Plus
              className="text-foreground group-hover:text-muted-foreground h-5 w-5
                transition-colors"
            />
          </div>
          <span
            className="text-foreground group-hover:text-muted-foreground text-sm
              font-medium transition-colors"
          >
            {label}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new study list</DialogTitle>
        </DialogHeader>
        <CreateStudyListForm />
      </DialogContent>
    </Dialog>
  );
}
